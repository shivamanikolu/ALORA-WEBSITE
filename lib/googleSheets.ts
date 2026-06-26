import crypto from "node:crypto";
import { logger } from "./logger";

export interface LeadRowData {
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  clinicName: string;
  practiceType: string;
  monthlyCallVolume: string;
  numberOfLocations: string;
  biggestChallenge: string;
  preferredTimeline: string;
  additionalInformation: string;
  ipAddress: string;
  country: string;
  region: string;
  city: string;
  userAgent: string;
  referrer: string;
  landingPage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  sessionId: string;
  submissionTime: string; // formatted Indian Standard Time (IST) timestamp
  spamScore: number;
  captchaVerified: boolean;
}

/**
 * Encodes string/Buffer into Base64URL encoding format.
 */
function base64url(str: string | Buffer): string {
  const buf = typeof str === "string" ? Buffer.from(str) : str;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Creates a signed JWT claim for Google service account authentication using RS256.
 */
function createGoogleJWT(clientEmail: string, privateKey: string): string {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Normalize private key string representation (handling raw config newlines)
  const formattedKey = privateKey.replace(/\\n/g, "\n");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  const signature = signer.sign(formattedKey);
  const encodedSignature = base64url(signature);

  return `${signatureInput}.${encodedSignature}`;
}

/**
 * Retrieves a temporary Google OAuth 2.0 access token using RS256 JWT claim.
 */
async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const jwt = createGoogleJWT(clientEmail, privateKey);
  
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Google OAuth API rejection (HTTP ${response.status}): ${errorDetails}`);
  }

  const body = await response.json();
  return body.access_token;
}

/**
 * Network fetch wrapper with custom exponential backoff retry.
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (res.status >= 500 && retries > 0) {
      logger.warn({
        category: "GOOGLE_API_ERROR",
        message: `Temporary server issue (HTTP ${res.status}). Retrying in ${delay}ms...`,
      });
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    return res;
  } catch (error: any) {
    if (retries > 0) {
      logger.warn({
        category: "GOOGLE_API_ERROR",
        message: `Network error: ${error.message || error}. Retrying in ${delay}ms...`,
      });
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Appends a formatted lead row to the configured Google Sheet via Google Sheets v4 REST API.
 */
export async function appendLeadToGoogleSheet(lead: LeadRowData): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !clientEmail || !privateKey) {
    logger.warn({
      category: "GOOGLE_API_ERROR",
      message: "Google Sheets sync skipped: missing environment configurations (GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, or GOOGLE_PRIVATE_KEY).",
    });
    return;
  }

  try {
    // 1. Fetch OAuth access token
    const token = await getGoogleAccessToken(clientEmail, privateKey);

    // 2. Map lead object properties to raw row values matching the requested schema exactly
    const rawRowValues = [
      lead.timestamp,
      lead.fullName,
      lead.email,
      lead.phone,
      lead.clinicName,
      lead.practiceType,
      lead.monthlyCallVolume,
      lead.numberOfLocations,
      lead.biggestChallenge,
      lead.preferredTimeline,
      lead.additionalInformation,
      lead.ipAddress,
      lead.country,
      lead.region,
      lead.city,
      lead.userAgent,
      lead.referrer,
      lead.landingPage,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
      lead.utmContent,
      lead.utmTerm,
      lead.sessionId,
      lead.submissionTime,
      lead.spamScore,
      lead.captchaVerified ? "TRUE" : "FALSE",
    ];

    // Escape formula injection or automatic formula parsing in Google Sheets
    // by prefixing values starting with +, =, -, @ with a single quote.
    const rowValues = rawRowValues.map((val) => {
      if (typeof val === "string") {
        if (val.startsWith("+") || val.startsWith("=") || val.startsWith("-") || val.startsWith("@")) {
          return `'${val}`;
        }
      }
      return val;
    });

    // 3. Append to Sheet (writes to the first sheet dynamically in column range A to AA)
    const range = "A1:AA1"; 
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range,
        majorDimension: "ROWS",
        values: [rowValues],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Sheets append failure (HTTP ${response.status}): ${errorText}`);
    }

    logger.info({
      category: "SUCCESS",
      message: "Lead successfully appended to Google Sheet.",
      email: lead.email,
      phone: lead.phone,
      sessionId: lead.sessionId,
    });
  } catch (error: any) {
    logger.error({
      category: "GOOGLE_API_ERROR",
      message: `Failed to synchronize lead data to Google Sheet.`,
      email: lead.email,
      error: error.message || String(error),
    });
    throw error;
  }
}
