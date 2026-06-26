import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShieldCheck, Lock, Eye, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ALORA" },
      { name: "description", content: "Learn how ALORA protects patient data, ensures HIPAA compliance, and secures your practice's voice communications." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const lastUpdated = "June 2026";

  const keyPrinciples = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "HIPAA Compliant",
      description: "Full alignment with HIPAA/HITECH requirements. We sign Business Associate Agreements (BAAs) with all clinic partners."
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Bank-Grade Encryption",
      description: "All patient communications, call audio, and transcripts are encrypted in transit (TLS 1.3) and at rest (AES-256)."
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: "Clinic Control",
      description: "Your practice owns the data. Request deletion, export transcripts, or manage patient permissions at any time."
    }
  ];

  const sections = [
    {
      id: "intro",
      title: "1. Introduction & Commitment",
      content: "At ALORA, we build AI-driven receptionist and voice agent solutions exclusively designed for healthcare clinics, hospitals, and medical practices. We recognize that clinical voice communication involves highly sensitive information. Protecting patient privacy and maintaining the trust of your patients and clinic staff is our absolute priority. This Privacy Policy details how we collect, protect, store, and utilize data when you use ALORA."
    },
    {
      id: "hipaa",
      title: "2. HIPAA Compliance & Patient Health Information (PHI)",
      content: "ALORA operates as a Business Associate under the Health Insurance Portability and Accountability Act (HIPAA). When a clinic partners with us, we execute a comprehensive Business Associate Agreement (BAA). We do not share, sell, or disclose Protected Health Information (PHI) except as explicitly permitted under the BAA or required by law. All systems are engineered to prevent unauthorized disclosure of patient clinical records, booking histories, and contact details."
    },
    {
      id: "collection",
      title: "3. Information We Collect",
      subsections: [
        {
          label: "Voice & Transcription Data",
          text: "When a patient calls your clinic via ALORA, we stream the audio to perform real-time speech-to-text. We process the voice audio, transiently log audio streams for quality assurance, and produce text transcripts of the conversation."
        },
        {
          label: "Appointment & EHR Integration Data",
          text: "To book appointments and lookup patient profiles, we pull necessary identification details (such as names, dates of birth, phone numbers, insurance providers) from your Electronic Health Record (EHR) or Practice Management System (PMS)."
        },
        {
          label: "System Usage Logs",
          text: "We collect metadata regarding call lengths, call times, routing efficiency, and bot performance to ensure service quality and detect potential system anomalies."
        }
      ]
    },
    {
      id: "usage",
      title: "4. How We Use and Process Information",
      content: "We use the collected information solely to provide, refine, and secure ALORA's AI voice systems. Specifically, we process data to:",
      bullets: [
        "Enable our AI agents to correctly book appointments and answer clinical FAQs.",
        "Perform call forwarding, routing, and notifications for the clinic front desk.",
        "Integrate directly with clinic EHR/PMS systems to update schedules and clinical notes.",
        "Assess and optimize voice model accuracy (using anonymized, scrubbed text data only).",
        "Prevent malicious traffic, spoofing calls, or service disruption."
      ]
    },
    {
      id: "security",
      title: "5. Security Safeguards",
      content: "We employ administrative, technical, and physical safeguards designed to comply with HIPAA Security Rules:",
      bullets: [
        "Data Encryption: All data in transit utilizes TLS 1.3 encryption. At rest, data is secured using AES-256 standards.",
        "Access Controls: Strict multi-factor authentication (MFA) and role-based access control (RBAC) restrict internal engineering access to client data.",
        "Audit Logging: All operations, system accesses, and integrations are logged for security audits.",
        "Vulnerability Scanning: Regular third-party penetration testing and automated vulnerability scans are run against our hosting infrastructure."
      ]
    },
    {
      id: "retention",
      title: "6. Data Retention & Deletion",
      content: "We store patient transcripts and call logs for as long as is necessary to provide the service to the clinic or as dictated by clinical retention policies. Clinics can configure custom data retention windows (e.g., auto-deleting call recordings after 30 days) and can request complete deletion of transcripts and caller records at any time."
    },
    {
      id: "changes",
      title: "7. Policy Updates",
      content: "We may update this Privacy Policy from time to time to reflect shifts in technology, legal requirements, or our operational practices. When updates are published, we will modify the 'Last Updated' date at the top of this page."
    }
  ];

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 grid-bg border-b border-border/50" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Trust & Security</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight mb-4">
            Privacy <span className="text-gradient italic">Policy</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg">
            How we protect patient health information, encrypt communications, and ensure HIPAA compliance across all voice integrations.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Core Security Principles */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {keyPrinciples.map((kp, idx) => (
              <div key={idx} className="card-elevated rounded-2xl p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {kp.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">{kp.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{kp.description}</p>
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
