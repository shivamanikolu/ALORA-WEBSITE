import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/revenue-systems")({
  head: () => ({
    meta: [
      { title: "Patient Revenue Systems — ALORA" },
      { name: "description", content: "Three healthcare AI systems. Each solves one expensive problem — missed calls, front-desk overload, and lost patient inquiries." },
      { property: "og:title", content: "Patient Revenue Systems — ALORA" },
      { property: "og:description", content: "24/7 AI Receptionist, Front Desk Automation, and Patient Recovery — built for clinics." },
    ],
  }),
  component: RevenueSystems,
});

type Scenario = {
  title: string;
  scenario: string;
  leak: string;
  fix: string;
  rows: { label: string; value: string; emphasis?: boolean }[];
  footnote: string;
};

const SYSTEMS: { tag: string; name: string; tagline: string; features: string[]; scenario: Scenario }[] = [
  {
    tag: "SYSTEM 1",
    name: "24/7 AI Receptionist",
    tagline: "Never miss another patient call.",
    features: [
      "24/7 AI Voice Receptionist",
      "Appointment Booking & Rescheduling",
      "Call Transfers for Emergencies",
      "Insurance & FAQ Handling",
      "Calendar Integration",
      "SMS Confirmations & Reminders",
      "Multi-Location Support",
      "Human-like Voice Conversations",
    ],
    scenario: {
      title: "System 1 — 24/7 AI Receptionist",
      scenario: "Multi-Location Dental Clinic",
      leak: "A dental clinic receives more than 350 calls every month. During peak hours and after business hours, nearly 30% of patient calls go unanswered. Many potential patients simply call the next dentist.",
      fix: "Deploying ALORA's 24/7 AI Receptionist. Every inbound call is answered instantly. The AI books appointments directly into the clinic's calendar, answers common questions, and transfers urgent cases to staff when needed.",
      rows: [
        { label: "Before ALORA", value: "250 booked appointments" },
        { label: "After ALORA", value: "340 booked appointments" },
        { label: "Additional Appointments", value: "+90 per month" },
        { label: "Potential Revenue Recovered", value: "+$45,000/mo", emphasis: true },
      ],
      footnote: "*Hypothetical projection based on industry averages. Actual results depend on call volume, services offered, and appointment conversion rates.",
    },
  },
  {
    tag: "SYSTEM 2",
    name: "Front Desk Automation",
    tagline: "Reduce staff workload and eliminate repetitive phone tasks.",
    features: [
      "Automated Appointment Reminders",
      "No-Show Reduction Campaigns",
      "Follow-up Calls & SMS",
      "Patient Intake Collection",
      "Voicemail Recovery",
      "Call Summaries & Notes",
      "CRM & EHR Integration",
      "Staff Escalation Workflows",
    ],
    scenario: {
      title: "System 2 — Front Desk Automation",
      scenario: "Busy Family Medical Clinic",
      leak: "The front desk team spends nearly 25 hours every week answering repetitive questions, confirming appointments, and calling patients about schedule changes.",
      fix: "ALORA automates appointment reminders, rescheduling requests, patient FAQs, and follow-up calls. Staff can focus on patients instead of administrative tasks.",
      rows: [
        { label: "Manual Administrative Work", value: "25 hours/week" },
        { label: "After Automation", value: "6 hours/week" },
        { label: "Time Recovered", value: "19 hours/week" },
        { label: "Estimated Payroll Efficiency", value: "+$3,000/mo", emphasis: true },
      ],
      footnote: "*Hypothetical projection based on administrative cost savings and recovered staff productivity.",
    },
  },
  {
    tag: "SYSTEM 3",
    name: "Patient Recovery System",
    tagline: "Recover missed opportunities and turn more inquiries into appointments.",
    features: [
      "Missed Call Text Back",
      "Lead Qualification Calls",
      "After-Hours Call Answering",
      "Reactivation Campaigns",
      "New Patient Follow-ups",
      "Abandoned Appointment Recovery",
      "Referral Follow-up Automation",
      "Revenue Analytics Dashboard",
    ],
    scenario: {
      title: "System 3 — Patient Recovery System",
      scenario: "Orthodontic Practice",
      leak: "The clinic spends thousands of dollars every month on Google and Meta ads. However, many inquiries happen after business hours and never receive a response.",
      fix: "ALORA automatically answers after-hours calls, sends instant SMS follow-ups, qualifies patients, and books consultations directly into the calendar.",
      rows: [
        { label: "Before ALORA", value: "80 consultations booked" },
        { label: "After ALORA", value: "145 consultations booked" },
        { label: "Additional Consultations", value: "+65 per month" },
        { label: "Potential Revenue Recovered", value: "+$32,500/mo", emphasis: true },
      ],
      footnote: "*Hypothetical projection based on industry averages and no increase in advertising spend.",
    },
  },
];

function ScenarioModal({ scenario, onClose }: { scenario: Scenario; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative card-elevated rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 lg:p-10">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary">
          <X className="w-4 h-4" />
        </button>
        <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-2">Example Scenario</p>
        <h3 className="font-display font-extrabold text-2xl lg:text-3xl mb-2">{scenario.title}</h3>
        <p className="text-muted-foreground mb-8">{scenario.scenario}</p>

        <div className="mb-6">
          <p className="font-display font-bold text-sm uppercase tracking-wider text-foreground/60 mb-2">The Leak</p>
          <p className="text-foreground/90 leading-relaxed">{scenario.leak}</p>
        </div>
        <div className="mb-8">
          <p className="font-display font-bold text-sm uppercase tracking-wider text-foreground/60 mb-2">The Fix</p>
          <p className="text-foreground/90 leading-relaxed">{scenario.fix}</p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-3 bg-secondary/50 border-b border-border">
            <p className="font-display font-bold text-sm">Projected Math</p>
          </div>
          <div className="divide-y divide-border">
            {scenario.rows.map((r) => (
              <div key={r.label} className={`px-6 py-4 flex items-center justify-between ${r.emphasis ? "bg-primary/5" : ""}`}>
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className={`font-display font-bold ${r.emphasis ? "text-primary text-lg" : ""}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">{scenario.footnote}</p>
      </div>
    </div>
  );
}

function RevenueSystems() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  return (
    <SiteLayout>
      <section className="pt-32 pb-12 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Patient Revenue Systems</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl leading-tight mb-6">
            Three systems.<br />
            <span className="text-foreground/50">Each solves one expensive problem.</span>
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {SYSTEMS.map((s) => (
            <div key={s.name} className="card-elevated rounded-2xl p-8 flex flex-col hover:border-primary/40 transition-colors">
              <p className="text-xs font-display font-bold tracking-widest text-muted-foreground mb-2">{s.tag}</p>
              <h3 className="font-display font-bold text-2xl mb-3">{s.name}</h3>
              <p className="text-muted-foreground mb-6">{s.tagline}</p>

              <p className="text-xs font-display font-bold tracking-widest text-foreground/70 mb-3">KEY FEATURES</p>
              <ul className="space-y-2 mb-8">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setActiveScenario(s.scenario)}
                className="mt-auto btn-primary rounded-full px-6 py-3 font-display font-semibold inline-flex items-center justify-center gap-2"
              >
                View Example Scenario <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display font-extrabold text-3xl lg:text-5xl leading-tight mb-6">
            Ready to stop missing patient calls?
          </h2>
          <Link to="/contact" className="btn-primary rounded-full px-8 py-4 font-display font-semibold inline-flex items-center gap-2">
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {activeScenario && <ScenarioModal scenario={activeScenario} onClose={() => setActiveScenario(null)} />}
    </SiteLayout>
  );
}
