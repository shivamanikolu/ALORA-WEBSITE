import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope, Hospital, Smile, HeartPulse, Brain, Baby, Eye, Activity } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SITE_URL, getBreadcrumbSchema } from "../lib/config";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — ALORA" },
      { name: "description", content: "AI voice receptionists tailored for every healthcare specialty." },
      { property: "og:url", content: `${SITE_URL}/solutions` },
      { name: "twitter:url", content: `${SITE_URL}/solutions` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/solutions` },
    ],
    scripts: [
      getBreadcrumbSchema([{ name: "Solutions", path: "/solutions" }]),
    ],
  }),
  component: Solutions,
});

const SOLUTIONS = [
  { icon: Smile, name: "Dental Clinics", body: "Handle new patient inquiries, hygiene reminders, and emergency triage 24/7." },
  { icon: Stethoscope, name: "Family Medicine", body: "Book routine visits, manage follow-ups, and answer prescription questions." },
  { icon: Hospital, name: "Hospitals", body: "Route patient calls across departments and reduce front-desk overload." },
  { icon: HeartPulse, name: "Cardiology & Specialty", body: "Pre-screen referrals and confirm specialist appointments automatically." },
  { icon: Brain, name: "Mental Health", body: "Empathetic intake conversations with seamless handoff to clinicians." },
  { icon: Baby, name: "Pediatrics", body: "Warm voices designed for parents, with smart triage for urgent calls." },
  { icon: Eye, name: "Optometry & ENT", body: "Book exams, manage frame fittings, and answer insurance questions." },
  { icon: Activity, name: "Physiotherapy & Wellness", body: "Recover missed sessions and re-engage past patients automatically." },
];

function Solutions() {
  return (
    <SiteLayout>
      <section className="pt-32 pb-16 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Solutions</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl leading-tight mb-6">
            Built for every <span className="text-gradient italic">healthcare practice.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ALORA adapts to your specialty, your workflows, and your patients — not the other way around.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLUTIONS.map((s) => (
            <div key={s.name} className="card-elevated rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-5">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{s.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl leading-tight mb-6">
            Don't see your specialty?
          </h2>
          <p className="text-muted-foreground mb-8">If you serve patients over the phone, we can build a workflow for you.</p>
          <Link to="/contact" className="btn-primary rounded-full px-8 py-4 font-display font-semibold inline-flex items-center gap-2">
            Talk to us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
