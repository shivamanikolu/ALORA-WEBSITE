import "./lib/error-capture";
import crypto from "node:crypto";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// Security Headers & CSP injector
async function applySecurityHeadersAndCSP(response: Response): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";
  const isHtml = contentType.includes("text/html");

  // Clone headers so we don't mutate read-only response headers
  const newHeaders = new Headers(response.headers);

  // Generate a cryptographically secure base64 nonce for inline scripts
  const nonce = crypto.randomBytes(16).toString("base64");

  // Create Strict CSP Whitelist
  const cspString = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'sha256-VRKfizwnyQxtND310AsmNPoFx6XzMKrglq3F12CdZv8=' https://vercel.live https://*.vercel.app https://www.googletagmanager.com https://*.clarity.ms https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https://flagcdn.com https://*.vercel.app https://*.vercel.live",
    "connect-src 'self' https://cloudflare-dns.com https://*.clarity.ms https://*.google-analytics.com https://analytics.google.com https://*.vapi.ai https://*.bland.ai https://*.retellai.com wss://*.vercel.live ws://localhost:* http://localhost:*",
    "frame-src 'self' https://vercel.live https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join("; ");

  // Set Enterprise-Grade Security Headers
  newHeaders.set("Content-Security-Policy", cspString);
  newHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  newHeaders.set("X-Frame-Options", "DENY");
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  newHeaders.set("Cross-Origin-Resource-Policy", "same-origin");
  newHeaders.set("Cross-Origin-Embedder-Policy", "credentialless");

  if (isHtml) {
    try {
      let html = await response.text();
      // Inject nonce attribute into all rendered scripts dynamically
      html = html.replace(/<script\b([^>]*)>/gi, (match, attrs) => {
        if (attrs.includes("nonce=")) return match;
        return `<script nonce="${nonce}"${attrs}>`;
      });

      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (e) {
      // Fall through to default response on text read failure
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return await applySecurityHeadersAndCSP(normalized);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
