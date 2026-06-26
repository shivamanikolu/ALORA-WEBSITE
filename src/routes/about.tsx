import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SITE_URL, getBreadcrumbSchema } from "../lib/config";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ALORA" },
      { name: "description", content: "ALORA builds AI voice receptionists exclusively for healthcare. We believe technology should help clinicians spend more time with patients." },
      { property: "og:url", content: `${SITE_URL}/about` },
      { name: "twitter:url", content: `${SITE_URL}/about` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/about` },
    ],
    scripts: [
      getBreadcrumbSchema([{ name: "About", path: "/about" }]),
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="pt-32 pb-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">About ALORA</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl leading-tight mb-6">
            We build AI for <span className="text-gradient italic">healthcare.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            ALORA was founded with a single mission: make sure no patient call ever goes unanswered. We build AI voice receptionists exclusively for clinics, hospitals, and healthcare practices.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          {[
            { title: "Our Philosophy", body: "Healthcare is personal. Every call matters. We design AI workflows around the patient experience — never around the technology itself." },
            { title: "What We Believe", body: "Front-desk staff should spend their time helping patients in person, not stuck on the phone. Patients should never be sent to voicemail when they need help. Practices should never lose revenue because nobody answered." },
            { title: "Why Healthcare Only", body: "Generic AI assistants weren't built for healthcare. We focus exclusively on clinics because we understand insurance flows, appointment rules, emergency triage, and the human side of patient communication." },
          ].map((b) => (
            <div key={b.title} className="card-elevated rounded-2xl p-8">
              <h2 className="font-display font-bold text-2xl mb-3">{b.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl leading-tight mb-6">
            Let's talk about your practice.
          </h2>
          <Link to="/contact" className="btn-primary rounded-full px-8 py-4 font-display font-semibold inline-flex items-center gap-2">
            Book Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
