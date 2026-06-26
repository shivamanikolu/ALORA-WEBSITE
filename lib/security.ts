import crypto from "node:crypto";

/**
 * Generates a cryptographically secure unique session ID.
 * Avoids heavy external packages like nanoid.
 */
export function generateSessionId(): string {
  const alphabet = "usecomplete-query-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const size = 21;
  const bytes = crypto.randomBytes(size);
  let id = "";
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

/**
 * Verifies Cloudflare Turnstile CAPTCHA.
 * If TURNSTILE_SECRET_KEY is not defined in environment variables, it defaults to true.
 */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // If the Turnstile secret key isn't configured, bypass verification (developer/fallback mode)
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: ip,
      }),
    });

    const data = await response.json();
    return !!data.success;
  } catch (error) {
    console.error("Cloudflare Turnstile verification network error:", error);
    // Fail-open to avoid losing business leads due to Cloudflare API downtime, but log it.
    return true;
  }
}

/**
 * In-memory Duplicate Submission Detector.
 * Tracks email and phone numbers for a rolling window of 5 minutes.
 */
class DuplicateDetector {
  private cache = new Map<string, number>(); // key -> resetTime (ms)
  private windowMs: number;

  constructor(windowMs = 5 * 60 * 1000) {
    this.windowMs = windowMs;
  }

  public isDuplicate(email: string, phone: string): boolean {
    const now = Date.now();
    this.prune(now);

    const normalizedEmail = email.toLowerCase().trim();
    const cleanPhone = phone.replace(/\D/g, "");

    const emailKey = `email:${normalizedEmail}`;
    const phoneKey = `phone:${cleanPhone}`;

    if (this.cache.has(emailKey)) {
      return true;
    }
    if (cleanPhone && this.cache.has(phoneKey)) {
      return true;
    }

    // Set expiration times
    const resetTime = now + this.windowMs;
    this.cache.set(emailKey, resetTime);
    if (cleanPhone) {
      this.cache.set(phoneKey, resetTime);
    }

    return false;
  }

  private prune(now: number): void {
    for (const [key, resetTime] of this.cache.entries()) {
      if (now > resetTime) {
        this.cache.delete(key);
      }
    }
  }
}

export const duplicateDetector = new DuplicateDetector();

export interface SpamResult {
  score: number;
  reasons: string[];
}

/**
 * Evaluates lead submission details and assigns a spam score from 0 to 10.
 */
export function calculateSpamScore(
  data: {
    name: string;
    email: string;
    phone: string;
    clinic: string;
    challenge?: string;
    additional?: string;
  },
  durationMs: number
): SpamResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Check submission velocity (timestamp test)
  if (durationMs < 2000) {
    score += 6;
    reasons.push("Extremely rapid form submission (under 2s)");
  } else if (durationMs < 4000) {
    score += 3;
    reasons.push("Fast form submission (under 4s)");
  }

  // 2. Scan text fields for classic SEO or script spam keywords
  const spamKeywords = [
    "seo", "crypto", "bitcoin", "solana", "forex", "money", "invest", "viagra",
    "casino", "lottery", "porn", "whatsapp", "telegram", "earn", "rich", "bonus",
    "http://", "https://", "www.", ".ru", ".cn", ".ua", ".link"
  ];

  const combinedText = `${data.name} ${data.clinic} ${data.challenge || ""} ${data.additional || ""}`.toLowerCase();
  
  let matchCount = 0;
  for (const keyword of spamKeywords) {
    if (combinedText.includes(keyword)) {
      matchCount++;
    }
  }

  if (matchCount > 0) {
    const points = Math.min(matchCount * 2, 6);
    score += points;
    reasons.push(`Contains spammy keywords or link patterns (${matchCount} matches)`);
  }

  // 3. Scan for disposable or temporary email providers
  const disposableDomains = [
    "mailinator.com", "yopmail.com", "10minutemail.com", "tempmail.com",
    "guerrillamail.com", "sharklasers.com", "dispostable.com", "getairmail.com"
  ];
  const domain = data.email.split("@")[1]?.toLowerCase();
  if (domain && disposableDomains.includes(domain)) {
    score += 8;
    reasons.push("Disposable email domain detected");
  }

  // 4. Scan for invalid phone number patterns
  const digits = data.phone.replace(/\D/g, "");
  if (digits.length < 7) {
    score += 3;
    reasons.push("Phone number is too short");
  } else if (/^(.)\1+$/.test(digits)) {
    score += 4;
    reasons.push("Repeating phone number pattern detected (e.g. 1111111)");
  } else if ("1234567890123456789".includes(digits)) {
    score += 3;
    reasons.push("Sequential phone number pattern detected");
  }

  return {
    score: Math.min(score, 10),
    reasons,
  };
}
