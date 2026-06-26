# ALORA Lead Capture & Sheets Sync System

This system implements a production-ready, highly secure, and optimized lead capture pipeline for the ALORA clinic AI voice receptionist platform. It validates and sanitizes inquiries and synchronizes them directly into Google Sheets without heavy dependencies.

---

## Technical Features

1. **Lightweight Google Sheets Integration (`/lib/googleSheets.ts`)**
   - Direct integration using standard fetch and Node's built-in `crypto` module.
   - Signs RS256 JWT claims to request Google API access tokens, bypassing the large `googleapis` library.
   - Low cold-start latency (critical for serverless environments like Vercel).
   - Exponential backoff retrying mechanism (up to 3 retries) on Google API transport issues.

2. **Enterprise-Grade Validation & Security**
   - **Data Validation (`/lib/validation.ts`)**: Enforces input structure using `Zod` schemas.
   - **XSS & Code Injection Protection (`/lib/sanitize.ts`)**: Iteratively sanitizes all string properties to strip HTML tags/script nodes.
   - **IP Rate Limiting (`/lib/rateLimit.ts`)**: Restricts IPs to a maximum of 5 submissions per 15 minutes.
   - **Spam Scoring (`/lib/security.ts`)**: Evaluates a spam score from 0 to 10 based on speed, temporary email domain detection, suspicious text keywords, and repetitive phone numbers.
   - **Duplicate Ingestion Prevention (`/lib/security.ts`)**: Implements an in-memory 5-minute cooldown on matching email and phone inputs to avoid spam submissions.
   - **Cloudflare Turnstile CAPTCHA (`/lib/security.ts`)**: Ready-to-use endpoint integration if keys are provided.

3. **UTM Attribution & Session Tracking (`/lib/metadata.ts`)**
   - Captures original referrer page, first landed page, and active Google/Meta UTM campaign tracking attributes (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`).
   - Generates a unique, cryptographically random Client Session ID.
   - Ingests Vercel/proxy Geolocation headers (`x-vercel-ip-country`, `x-vercel-ip-city`, `x-vercel-ip-region`).

---

## Environment Variables Configuration

To run the lead sync fully, define the following variables in your Vercel project environment (or in a local `.env` file):

```env
# Google Cloud Service Account Integration
GOOGLE_SHEET_ID=1lmezd0Ht-KrlOFecR_kriv7rnKXLMDOO3K8Hv4giOvE
GOOGLE_CLIENT_EMAIL=alora-sheets@alora-website-500611.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDXzkfrQEWARTEu\nDxYlLMllx5QghaXYocDf... (complete key block)"

# Optional Security configuration (Cloudflare Turnstile)
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

*Note: The private key should be pasted exactly as downloaded from the Google Cloud Console (with literal `\n` representation. The authenticater resolves them internally).*

---

## API & Form Architecture

- **Server Function (`src/routes/contact.tsx`)**: Plugs directly into TanStack Start's `submitContactForm` endpoint using dynamic module imports. This prevents server-only Node modules (like `crypto`) from bloating or crashing the browser client bundle.
- **REST Endpoint (`api/contact.ts`)**: Exposes a standalone Vercel Serverless Function POST route at `/api/contact` enabling external webhook processors (e.g. Zapier, Make.com) to route leads into the exact same secure validation & sheets append pipeline.
