import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, CheckCircle2, Loader2, Check, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SITE_URL, getBreadcrumbSchema } from "../lib/config";
import Turnstile from "react-turnstile";

// Zod Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).transform(val => val.trim()),
  email: z.string().email("Invalid email format").transform(val => val.trim().toLowerCase()),
  phone: z.string().min(7, "Phone number must be at least 7 digits").max(25),
  clinic: z.string().min(2, "Clinic name must be at least 2 characters").max(100).transform(val => val.trim()),
  type: z.string().optional(),
  volume: z.string().optional(),
  locations: z.string().optional(),
  challenge: z.string().max(1000).optional().transform(val => val ? val.trim() : ""),
  timeline: z.string().optional(),
  website_honeypot: z.string().max(100).optional(),
});

// Server-side IP Rate Limiter cache
const ipCache = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const cache = ipCache.get(ip);
  if (!cache || now > cache.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 mins reset
    return { allowed: true };
  }
  if (cache.count >= 5) {
    return { allowed: false, retryAfter: Math.ceil((cache.resetTime - now) / 1000) };
  }
  cache.count += 1;
  return { allowed: true };
}

// XSS/HTML Injection Sanitization
function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Server Function for secure form processing
export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { handleContactSubmission } = await import("../../lib/contactHandler");
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();

    const durationMs = Number(data.submissionDurationMs) || 3000;
    const turnstileToken = data.turnstileToken || "";

    const result = await handleContactSubmission(data, request, durationMs, turnstileToken);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  });

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Free Consultation — ALORA" },
      { name: "description", content: "Tell us about your practice. We'll show you exactly how ALORA can help you answer every patient call." },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { name: "twitter:url", content: `${SITE_URL}/contact` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/contact` },
    ],
    scripts: [
      getBreadcrumbSchema([{ name: "Book Consultation", path: "/contact" }]),
    ],
  }),
  component: Contact,
});

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Hardening states
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [pageLoadTime] = useState(Date.now());
  const [turnstileToken, setTurnstileToken] = useState("");

  // Turnstile Ref & States
  const [turnstileInstance, setTurnstileInstance] = useState<any>(null);
  const [turnstileState, setTurnstileState] = useState<"loading" | "verified" | "error" | "expired">("loading");

  useEffect(() => {
    if (!email) {
      setEmailError("");
      setEmailVerified(false);
      return;
    }

    if (!validateEmailFormat(email)) {
      setEmailError("Invalid email format");
      setEmailVerified(false);
      return;
    }

    setEmailError("");
    setIsVerifyingEmail(true);
    setEmailVerified(false);

    const timer = setTimeout(async () => {
      const result = await checkEmailExists(email);
      setIsVerifyingEmail(false);
      if (result.valid) {
        setEmailVerified(true);
        setEmailError("");
      } else {
        setEmailError(result.reason || "Invalid email domain");
        setEmailVerified(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [email]);

  if (submitted) {
    return (
      <SiteLayout>
        <section className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-20">
          <div className="card-elevated rounded-3xl p-12 text-center max-w-xl">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-6" />
            <h1 className="font-display font-extrabold text-3xl mb-4">Thank you.</h1>
            <p className="text-muted-foreground">We'll be in touch within one business day to schedule your free consultation.</p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="pt-32 pb-12 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Book a free consultation</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight mb-4">
            Tell us about your <span className="text-gradient italic">practice.</span>
          </h1>
          <p className="text-muted-foreground">30-minute call. No pressure. Just clarity on where ALORA could help.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setFormError("");

              // Email validation check
              if (emailError || !emailVerified) {
                setFormError("Please enter a valid, active email address.");
                return;
              }

              // Consent validation
              if (!consentChecked) {
                setFormError("You must consent to the HIPAA and Privacy terms before submitting.");
                return;
              }

              // Turnstile CAPTCHA check
              if (!turnstileToken || turnstileState !== "verified") {
                setFormError("Please complete the security verification.");
                return;
              }

              // Honeypot check (client-side prevention)
              if (honeypot) {
                setSubmitted(true);
                // Automatically clear token after successful submission
                setTurnstileToken("");
                setTurnstileState("loading");
                return;
              }

              // Rapid submission check
              if (Date.now() - pageLoadTime < 3000) {
                setFormError("Submission too rapid. Please take a moment to review your entries.");
                return;
              }

              setIsSubmitting(true);
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              
              // Include honeypot value
              data.website_honeypot = honeypot;
              // Include resolved phone value
              const phoneFull = formData.get("phone_full") as string || formData.get("phone") as string;
              data.phone = phoneFull;

              // Attach local session and UTM attribution metadata
              if (typeof window !== "undefined") {
                data.sessionId = localStorage.getItem("alora_session_id") || "";
                data.referrer = localStorage.getItem("alora_referrer") || "Direct";
                data.landingPage = localStorage.getItem("alora_landing_page") || window.location.href;
                data.utmSource = localStorage.getItem("alora_utm_source") || "";
                data.utmMedium = localStorage.getItem("alora_utm_medium") || "";
                data.utmCampaign = localStorage.getItem("alora_utm_campaign") || "";
                data.utmContent = localStorage.getItem("alora_utm_content") || "";
                data.utmTerm = localStorage.getItem("alora_utm_term") || "";
                data.submissionDurationMs = String(Date.now() - pageLoadTime);
                data.turnstileToken = turnstileToken;
              }

              try {
                const response = await submitContactForm({ data });
                if (response.success) {
                  setSubmitted(true);
                  // Automatically clear token after successful submission
                  setTurnstileToken("");
                  setTurnstileState("loading");
                } else {
                  setFormError(response.message || "Submission failed. Please try again.");
                  // Reset widget after failed submission
                  setTurnstileToken("");
                  setTurnstileState("loading");
                  turnstileInstance?.reset();
                }
              } catch (err: any) {
                setFormError(err.message || "An unexpected error occurred.");
                // Reset widget after failed submission
                setTurnstileToken("");
                setTurnstileState("loading");
                turnstileInstance?.reset();
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="card-elevated rounded-3xl p-8 lg:p-10 space-y-6"
          >
            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl p-4 text-sm flex items-center gap-2 font-sans animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Full name" name="name" required />
              <EmailField
                label="Email"
                name="email"
                required
                value={email}
                onChange={setEmail}
                error={emailError}
                setError={setEmailError}
                isVerifying={isVerifyingEmail}
                setIsVerifying={setIsVerifyingEmail}
                verified={emailVerified}
                setVerified={setEmailVerified}
              />
              <PhoneField label="Phone" name="phone" required />
              <Field label="Clinic / Practice name" name="clinic" required />
            </div>

            {/* Honeypot field for bot protection */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_honeypot">Website URL</label>
              <input
                id="website_honeypot"
                type="text"
                name="website_honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <Select label="Type of practice" name="type" options={["Dental", "Family Medicine", "Specialty Clinic", "Hospital", "Mental Health", "Other"]} />
            <Select label="Approximate monthly call volume" name="volume" options={["Under 200", "200 – 500", "500 – 1,000", "1,000 – 2,500", "2,500+"]} />
            <Select label="Number of locations" name="locations" options={["1", "2 – 5", "6 – 10", "10+"]} />

            <div>
              <label className="block text-sm font-display font-semibold mb-2">What's your biggest challenge right now?</label>
              <textarea name="challenge" rows={4} className="w-full rounded-xl bg-secondary/40 border border-border px-4 py-3 outline-none focus:border-primary" placeholder="Tell us what's pulling your front desk under..." />
            </div>

            <Select label="Preferred timeline" name="timeline" options={["ASAP", "Within 30 days", "Within 90 days", "Just exploring"]} />

            {/* Compliance Section: HIPAA and Consent Checkbox */}
            <div className="space-y-3 pt-2">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs text-muted-foreground flex gap-2 font-sans">
                <span className="font-bold text-primary flex-shrink-0">HIPAA Notice:</span>
                <span>Please do not submit patient Protected Health Information (PHI) through this contact form. This channel is for clinic consultations only.</span>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-xs text-muted-foreground leading-normal font-sans">
                  I consent to ALORA processing my clinic details and contacting me regarding my inquiry in accordance with the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>. *
                </span>
              </label>
            </div>

            {/* Cloudflare Turnstile CAPTCHA container */}
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Turnstile
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                onLoad={(widgetId, boundTurnstile) => {
                  setTurnstileInstance(boundTurnstile);
                  setTurnstileState("loading");
                }}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setTurnstileState("verified");
                }}
                onError={() => {
                  setTurnstileToken("");
                  setTurnstileState("error");
                }}
                onExpire={() => {
                  setTurnstileToken("");
                  setTurnstileState("expired");
                }}
                appearance="always"
                execution="render"
                theme="auto"
                language="auto"
              />
              {turnstileState === "loading" && (
                <p className="text-xs text-muted-foreground">Please complete the security verification.</p>
              )}
              {turnstileState === "expired" && (
                <p className="text-xs text-red-500 font-semibold">Verification expired. Please try again.</p>
              )}
              {turnstileState === "error" && (
                <p className="text-xs text-red-500 font-semibold font-sans">Something went wrong. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isVerifyingEmail || !!emailError || !emailVerified || !consentChecked || turnstileState !== "verified"}
              className="btn-primary rounded-full px-7 py-3.5 font-display font-semibold inline-flex items-center gap-2 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : isVerifyingEmail ? (
                "Verifying email..."
              ) : (
                "Submit & Book Consultation"
              )}
              {!isSubmitting && !isVerifyingEmail && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="text-xs text-muted-foreground text-center">We respect your privacy. No spam — just a real conversation.</p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function PhoneField({ label, name, required }: { label: string; name: string; required?: boolean }) {
  const [selectedCountry, setSelectedCountry] = useState({ name: "United States", code: "us", dial: "+1" });
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const countries = [
    { name: "United States", code: "us", dial: "+1" },
    { name: "Canada", code: "ca", dial: "+1" },
    { name: "United Kingdom", code: "gb", dial: "+44" },
    { name: "Australia", code: "au", dial: "+61" },
    { name: "India", code: "in", dial: "+91" },
    { name: "Germany", code: "de", dial: "+49" },
    { name: "France", code: "fr", dial: "+33" },
    { name: "Japan", code: "jp", dial: "+81" },
    { name: "Singapore", code: "sg", dial: "+65" },
    { name: "New Zealand", code: "nz", dial: "+64" },
    { name: "Brazil", code: "br", dial: "+55" },
    { name: "Mexico", code: "mx", dial: "+52" },
    { name: "South Africa", code: "za", dial: "+27" },
    { name: "United Arab Emirates", code: "ae", dial: "+971" },
    { name: "Spain", code: "es", dial: "+34" },
    { name: "Italy", code: "it", dial: "+39" },
    { name: "Netherlands", code: "nl", dial: "+31" },
    { name: "Switzerland", code: "ch", dial: "+41" },
    { name: "Sweden", code: "se", dial: "+46" },
    { name: "Norway", code: "no", dial: "+47" },
  ];

  return (
    <div>
      <label className="block text-sm font-display font-semibold mb-2">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <div className="flex gap-2 relative">
        {/* Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between rounded-xl bg-secondary/40 border border-border px-3 py-3 outline-none focus:border-primary w-[110px] text-sm text-foreground cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <img
              src={`https://flagcdn.com/w20/${selectedCountry.code}.png`}
              alt={selectedCountry.name}
              className="w-5 h-auto rounded-sm object-cover"
            />
            <span>{selectedCountry.dial}</span>
          </div>
          <span className="text-xs text-muted-foreground opacity-60">▼</span>
        </button>

        {/* Dropdown Menu Overlay */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-lg z-50 py-1">
              {countries.map((c) => (
                <button
                  key={`${c.code}-${c.dial}`}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-secondary text-sm flex items-center gap-3 transition-colors"
                >
                  <img
                    src={`https://flagcdn.com/w20/${c.code}.png`}
                    alt={c.name}
                    className="w-5 h-auto rounded-sm object-cover"
                  />
                  <span className="font-semibold text-foreground/90">{c.dial}</span>
                  <span className="text-muted-foreground text-xs truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <input
          name={name}
          type="tel"
          required={required}
          value={phoneNumber}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            setPhoneNumber(digits);
          }}
          placeholder="Phone number"
          className="flex-1 rounded-xl bg-secondary/40 border border-border px-4 py-3 outline-none focus:border-primary font-sans"
        />

        {/* Hidden combined value to submit in normal form data */}
        <input
          type="hidden"
          name={`${name}_full`}
          value={`${selectedCountry.dial} ${phoneNumber}`}
        />
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-display font-semibold mb-2">{label}{required && <span className="text-primary"> *</span>}</label>
      <input name={name} type={type} required={required} className="w-full rounded-xl bg-secondary/40 border border-border px-4 py-3 outline-none focus:border-primary" />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-display font-semibold mb-2">{label}</label>
      <select name={name} className="w-full rounded-xl bg-secondary/40 border border-border px-4 py-3 outline-none focus:border-primary">
        <option value="">Select an option</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

const validateEmailFormat = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const checkEmailExists = async (email: string) => {
  if (!validateEmailFormat(email)) {
    return { valid: false, reason: "Invalid email format" };
  }
  const domain = email.split("@")[1];
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
      headers: {
        accept: "application/dns-json",
      },
    });
    const data = await res.json();
    if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
      return { valid: true };
    }
    return { valid: false, reason: `The domain @${domain} does not have active mail servers.` };
  } catch (error) {
    return { valid: true };
  }
};

function EmailField({
  label,
  name,
  required,
  value,
  onChange,
  error,
  setError,
  isVerifying,
  setIsVerifying,
  verified,
  setVerified
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  error: string;
  setError: (val: string) => void;
  isVerifying: boolean;
  setIsVerifying: (val: boolean) => void;
  verified: boolean;
  setVerified: (val: boolean) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setVerified(false);
    setError("");
  };

  return (
    <div className="relative">
      <label className="block text-sm font-display font-semibold mb-2">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <div className="relative">
        <input
          name={name}
          type="email"
          required={required}
          value={value}
          onChange={handleChange}
          className={`w-full rounded-xl bg-secondary/40 border px-4 py-3 outline-none transition-colors font-sans pr-10 ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : verified
              ? "border-green-500/50 focus:border-green-500"
              : "border-border focus:border-primary"
          }`}
          placeholder="your@email.com"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          {isVerifying && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
          {verified && !error && <Check className="w-4 h-4 text-green-500" />}
          {error && <AlertCircle className="w-4 h-4 text-red-500" />}
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-sans">
          <AlertCircle className="w-3.5 h-3.5 inline" /> {error}
        </p>
      )}
      {verified && !error && (
        <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1 font-sans">
          <Check className="w-3.5 h-3.5 inline" /> Email domain verified
        </p>
      )}
    </div>
  );
}
