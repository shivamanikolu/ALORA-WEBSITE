import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Cookie, Settings, ShieldAlert, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — ALORA" },
      { name: "description", content: "Understand how ALORA uses cookies, tracking pixels, and session storage to provide secure, high-performance voice reception services." },
    ],
  }),
  component: CookiePolicy,
});

function CookiePolicy() {
  const lastUpdated = "June 2026";

  const categories = [
    {
      icon: <Cookie className="w-6 h-6 text-primary" />,
      title: "Essential Cookies",
      description: "Crucial for system security, CSRF protection, theme state caching, and active session management. These cannot be disabled."
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      title: "Analytics Cookies",
      description: "Help us understand traffic patterns and optimize system performance using Google Analytics and Microsoft Clarity."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-primary" />,
      title: "Compliance Storage",
      description: "Records your consent choices for privacy agreements, cookie approvals, and security acknowledgements."
    }
  ];

  const sections = [
    {
      id: "what-are-cookies",
      title: "1. What Are Cookies & Local Storage?",
      content: "Cookies and local browser storage are small text files or database entries stored on your computer or mobile device when you visit websites. They enable websites to recall your actions, configurations, security nonces, and preferences (such as theme choice, login status, and language settings) over time, so you do not have to re-enter them upon return."
    },
    {
      id: "how-we-use",
      title: "2. How ALORA Uses Cookies",
      content: "We use cookies and similar local storage technologies strictly to enhance security, facilitate portal navigation, analyze usage metrics, and improve our AI receptionist services. We do not use advertising or marketing cookies that track your behavior across third-party websites."
    },
    {
      id: "types-used",
      title: "3. Specific Types of Storage We Utilize",
      subsections: [
        {
          label: "CSRF & Security Tokens (Session)",
          text: "Used to protect booking forms against Cross-Site Request Forgery (CSRF) attacks. These expire immediately when the browser is closed."
        },
        {
          label: "Theme & Layout Preferences (Persistent)",
          text: "Stores your Dark/Light mode preference so that the site loads correctly in your preferred style upon return visits."
        },
        {
          label: "Analytics & Telemetry (Persistent)",
          text: "Google Analytics 4 (GA4) and Microsoft Clarity set cookies to collect anonymous metadata such as page view paths, button clicks, and scroll depth."
        }
      ]
    },
    {
      id: "managing-cookies",
      title: "4. How to Control Cookies",
      content: "Most web browsers allow you to manage cookie preferences through their settings. You can configure your browser to block all cookies, accept only first-party cookies, or clear cookies when you exit the browser. Note that blocking essential cookies may disable some secure features of our booking form.",
      bullets: [
        "Chrome: Settings > Privacy and Security > Third-party cookies",
        "Safari: Settings > Privacy > Block all cookies",
        "Firefox: Settings > Privacy & Security > Cookies and Site Data"
      ]
    },
    {
      id: "updates",
      title: "5. Cookie Policy Modifications",
      content: "We may update this Cookie Policy periodically to align with modifications in privacy laws or shifts in our secure storage architecture. We encourage you to review this page regularly for the latest details."
    }
  ];

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 grid-bg border-b border-border/50" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Privacy Framework</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight mb-4">
            Cookie <span className="text-gradient italic">Policy</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg">
            Understand how ALORA utilizes secure local cookies and session storage to optimize portal delivery.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Core Storage Principles */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((c, idx) => (
              <div key={idx} className="card-elevated rounded-2xl p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {c.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="card-elevated rounded-3xl p-8 lg:p-12 space-y-12 leading-relaxed">
            {sections.map((sec) => (
              <div key={sec.id} className="space-y-4">
                <h2 className="font-display font-extrabold text-2xl border-b border-border/60 pb-3">{sec.title}</h2>
                {sec.content && <p className="text-muted-foreground text-sm lg:text-base">{sec.content}</p>}
                
                {sec.bullets && (
                  <ul className="space-y-2 pl-5 list-disc text-muted-foreground text-sm lg:text-base">
                    {sec.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}

                {sec.subsections && (
                  <div className="space-y-4 pt-2">
                    {sec.subsections.map((sub, i) => (
                      <div key={i} className="bg-secondary/30 rounded-xl p-4 border border-border/40">
                        <h4 className="font-display font-bold text-sm lg:text-base text-foreground mb-1 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" /> {sub.label}
                        </h4>
                        <p className="text-muted-foreground text-sm">{sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
