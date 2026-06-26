export type LogCategory = "SUCCESS" | "FAILURE" | "GOOGLE_API_ERROR" | "SPAM_ATTEMPT" | "RATE_LIMIT_VIOLATION";

export interface LogPayload {
  category: LogCategory;
  message: string;
  email?: string;
  phone?: string;
  ip?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  error?: string;
}

/**
 * Structured Logging Utility for Serverless environments (like Vercel).
 * Output is structured in JSON for easy ingestion by logging engines (DataDog, Axiom, Vercel Logs).
 */
export const logger = {
  info(payload: LogPayload) {
    console.log(JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      ...payload,
    }));
  },

  warn(payload: LogPayload) {
    console.warn(JSON.stringify({
      level: "warn",
      timestamp: new Date().toISOString(),
      ...payload,
    }));
  },

  error(payload: LogPayload) {
    console.error(JSON.stringify({
      level: "error",
      timestamp: new Date().toISOString(),
      ...payload,
    }));
  }
};
