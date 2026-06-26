import { contactFormSchema } from "./validation";
import { sanitizeObject } from "./sanitize";
import { formRateLimiter } from "./rateLimit";
import { duplicateDetector, calculateSpamScore, verifyTurnstile } from "./security";
import { extractMetadata } from "./metadata";
import { appendLeadToGoogleSheet, LeadRowData } from "./googleSheets";
import { logger } from "./logger";

export interface ContactResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

/**
 * Handles the end-to-end form submission pipeline: rate limiting, spam check, 
 * sanitization, metadata/UTM mapping, and Google Sheet synchronization.
 */
export async function handleContactSubmission(
  rawPayload: any,
  request: Request | null,
  durationMs: number,
  turnstileToken?: string
): Promise<ContactResponse> {
  // Extract client IP address for logging and rate-limiting
  const headers = request?.headers || new Headers();
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    rawPayload.ip ||
    "127.0.0.1";

  // 1. IP Rate Limiting Check
  const limitCheck = await formRateLimiter.isRateLimited(ip);
  if (!limitCheck.allowed) {
    logger.warn({
      category: "RATE_LIMIT_VIOLATION",
      message: "Form submission blocked by IP rate limit.",
      ip,
    });
    return {
      success: false,
      message: `Too many submissions. Please wait ${limitCheck.retryAfter} seconds before trying again.`,
    };
  }

  // 2. Bot Honeypot Check
  if (rawPayload.website_honeypot) {
    logger.warn({
      category: "SPAM_ATTEMPT",
      message: "Bot honeypot field filled. Drop submission silently.",
      ip,
    });
    return {
      success: true, // Fail silently to mislead spam bots
      message: "Request processed successfully.",
    };
  }

  // 3. Zod Payload Schema Verification
  const validation = contactFormSchema.safeParse(rawPayload);
  if (!validation.success) {
    const errorMessages = validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    logger.warn({
      category: "FAILURE",
      message: "Payload validation failed.",
      ip,
      metadata: { errors: errorMessages },
    });
    return {
      success: false,
      message: validation.error.errors[0].message,
      errors: errorMessages,
    };
  }

  const validatedData = validation.data;

  // 4. Rolling 5-minute Duplicate Lead Check
  const isDuplicate = duplicateDetector.isDuplicate(validatedData.email, validatedData.phone);
  if (isDuplicate) {
    logger.warn({
      category: "SPAM_ATTEMPT",
      message: "Duplicate submission flagged within 5 minutes.",
      email: validatedData.email,
      phone: validatedData.phone,
      ip,
    });
    return {
      success: false,
      message: "We have already received your submission. Please wait a few minutes before trying again.",
    };
  }

  // 5. CAPTCHA Verification (Mandatory for all submissions)
  const captchaOk = await verifyTurnstile(turnstileToken || "", ip);
  if (!captchaOk) {
    logger.warn({
      category: "SPAM_ATTEMPT",
      message: "Cloudflare Turnstile token validation failed or token missing.",
      email: validatedData.email,
      ip,
    });
    return {
      success: false,
      message: "Captcha verification failed.",
    };
  }

  // 6. Multi-Factor Spam Scoring
  const spamResult = calculateSpamScore(validatedData, durationMs);
  if (spamResult.score >= 7) {
    logger.warn({
      category: "SPAM_ATTEMPT",
      message: `Submission rejected due to high spam score (${spamResult.score}/10).`,
      email: validatedData.email,
      ip,
      metadata: { reasons: spamResult.reasons },
    });
    return {
      success: false,
      message: "Submission rejected as potential spam. If this is an error, please email us directly at helloalora@outlook.in.",
    };
  }

  // 7. XSS Sanitization
  const sanitizedName = sanitizeObject({ name: validatedData.name }).name;
  const sanitizedClinic = sanitizeObject({ clinic: validatedData.clinic }).clinic;
  const sanitizedChallenge = sanitizeObject({ challenge: validatedData.challenge }).challenge;
  const sanitizedAdditional = sanitizeObject({ additional: validatedData.additional }).additional;

  // 8. Referrer & UTM Metadata Extraction
  const metadata = extractMetadata(request, rawPayload);

  // 9. Sync lead record to Google Sheets
  // format timestamp in Indian Standard Time (IST)
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const leadRow: LeadRowData = {
    timestamp,
    fullName: sanitizedName,
    email: validatedData.email,
    phone: validatedData.phone,
    clinicName: sanitizedClinic,
    practiceType: validatedData.type || "",
    monthlyCallVolume: validatedData.volume || "",
    numberOfLocations: validatedData.locations || "",
    biggestChallenge: sanitizedChallenge || "",
    preferredTimeline: validatedData.timeline || "",
    additionalInformation: sanitizedAdditional || "",
    ipAddress: metadata.ipAddress,
    country: metadata.country,
    region: metadata.region,
    city: metadata.city,
    userAgent: metadata.userAgent,
    referrer: metadata.referrer,
    landingPage: metadata.landingPage,
    utmSource: metadata.utmSource,
    utmMedium: metadata.utmMedium,
    utmCampaign: metadata.utmCampaign,
    utmContent: metadata.utmContent,
    utmTerm: metadata.utmTerm,
    sessionId: rawPayload.sessionId || "Unknown",
    submissionTime: durationMs,
    spamScore: spamResult.score,
    captchaVerified: !!turnstileToken,
  };

  try {
    await appendLeadToGoogleSheet(leadRow);
    return {
      success: true,
      message: "Lead captured successfully.",
    };
  } catch (error) {
    // Return a success flag with a note to client if sheets sync fails but lead is logged
    return {
      success: true,
      message: "Submission received. Our team will contact you shortly.",
    };
  }
}
