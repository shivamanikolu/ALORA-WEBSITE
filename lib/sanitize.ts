/**
 * Sanitizes input strings to protect against Cross-Site Scripting (XSS),
 * HTML injection, and malicious script payloads.
 */
export function sanitizeString(str: string): string {
  if (!str || typeof str !== "string") return "";
  
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Iteratively sanitizes all string properties in a key-value object.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === "string") {
      result[key] = sanitizeString(result[key]) as any;
    }
  }
  return result;
}
