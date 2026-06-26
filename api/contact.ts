import { handleContactSubmission } from "../lib/contactHandler";

/**
 * Standalone Vercel Serverless Function endpoint for lead capture.
 * Exposes a standard HTTP POST API endpoint at `/api/contact` for external webhook integrations.
 */
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const rawPayload = req.body || {};

    // Map Node.js HTTP incoming request headers to global Fetch Headers for contactHandler
    const mockHeaders = new Headers();
    for (const key in req.headers) {
      const val = req.headers[key];
      if (typeof val === "string") {
        mockHeaders.set(key, val);
      } else if (Array.isArray(val)) {
        mockHeaders.set(key, val.join(", "));
      }
    }

    const mockRequest = {
      headers: mockHeaders,
    } as unknown as Request;

    const durationMs = Number(rawPayload.submissionDurationMs) || 3000;
    const turnstileToken = rawPayload.turnstileToken || "";

    const result = await handleContactSubmission(
      rawPayload,
      mockRequest,
      durationMs,
      turnstileToken
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Vercel Serverless API Handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during lead processing.",
    });
  }
}
