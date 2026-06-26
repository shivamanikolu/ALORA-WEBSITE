export interface RequestMetadata {
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
}

/**
 * Extracts IP, GeoIP, User Agent, Referrer, and UTM details from the request context and/or client-submitted payload.
 */
export function extractMetadata(request: Request | null, clientData: Record<string, any>): RequestMetadata {
  const headers = request?.headers || new Headers();

  // 1. Client IP Address extraction
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    clientData.ip ||
    "127.0.0.1";

  // 2. Geolocation headers injected by Vercel / Edge proxy
  const country = headers.get("x-vercel-ip-country") || clientData.country || "US";
  const region =
    headers.get("x-vercel-ip-country-region") ||
    headers.get("x-vercel-ip-region") ||
    clientData.region ||
    "Unknown";
  const city = headers.get("x-vercel-ip-city") || clientData.city || "Unknown";

  // 3. User Agent
  const userAgent = headers.get("user-agent") || clientData.userAgent || "Unknown UA";

  // 4. Referrer & Landing Page
  const referrer = clientData.referrer || headers.get("referer") || "Direct";
  const landingPage = clientData.landingPage || "Unknown";

  // 5. UTM parameters (tracked on client landing and passed down)
  const utmSource = clientData.utmSource || clientData.utm_source || "N/A";
  const utmMedium = clientData.utmMedium || clientData.utm_medium || "N/A";
  const utmCampaign = clientData.utmCampaign || clientData.utm_campaign || "N/A";
  const utmContent = clientData.utmContent || clientData.utm_content || "N/A";
  const utmTerm = clientData.utmTerm || clientData.utm_term || "N/A";

  return {
    ipAddress,
    country,
    region,
    city,
    userAgent,
    referrer,
    landingPage,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  };
}
