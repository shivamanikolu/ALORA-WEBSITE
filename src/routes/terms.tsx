import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Scale, FileText, HelpCircle, PhoneCall } from "lucide-react";
import { SITE_URL, getBreadcrumbSchema } from "../lib/config";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ALORA" },
      { name: "description", content: "Terms and conditions governing the use of ALORA's AI voice receptionists and healthcare communication platform." },
      { property: "og:url", content: `${SITE_URL}/terms` },
      { name: "twitter:url", content: `${SITE_URL}/terms` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/terms` },
    ],
    scripts: [
      getBreadcrumbSchema([{ name: "Terms of Service", path: "/terms" }]),
    ],
  }),
  component: Terms,
});

function Terms() {
  const lastUpdated = "June 2026";

  const features = [
    {
      icon: <Scale className="w-6 h-6 text-primary" />,
      title: "Clinic & AI Scope",
      description: "ALORA operates as a clinical administrative assistant. We do not provide medical advice or diagnostic services."
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-primary" />,
      title: "Emergency Routing",
      description: "ALORA is not an emergency hotline. Our voice agents are programmed to immediately route emergency calls to 911."
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Service Terms",
      description: "Standard subscription terms apply, outlining call volumes, EHR integration rules, and system availability."
    }
  ];

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: "By subscribing to, accessing, or utilizing the AI voice receptionist systems, web portals, and integrations provided by ALORA (collectively, the 'Service'), you (the 'Clinic' or 'Customer') agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a clinic, medical practice, hospital, or other legal entity, you represent that you have the authority to bind such entity to these terms."
    },
    {
      id: "scope",
      title: "2. Scope of Service & AI Disclaimers",
      content: "ALORA provides automated artificial intelligence voice receptionists designed to help healthcare clinics manage inbound phone traffic, answer administrative questions, check patient details, and book appointments. You acknowledge and agree that:",
      bullets: [
        "No Medical Advice: ALORA is not a licensed medical provider. The Service does not provide medical advice, diagnosis, triage, or treatment recommendations.",
        "Emergency Triage: The Service is not configured to handle medical emergencies. The AI agents are instructed to direct any caller indicating a medical emergency to dial 911 or proceed to the nearest emergency room immediately.",
        "Accuracy of Information: While ALORA utilizes state-of-the-art natural language processing, AI responses can occasionally contain transcription errors or misunderstandings. The Clinic is responsible for reviewing and confirming appointment bookings, patient notes, and message requests."
      ]
    },
    {
      id: "baas",
      title: "3. HIPAA & Business Associate Agreements",
      content: "The Clinic's use of the Service is conditioned upon the execution of a Business Associate Agreement (BAA) in compliance with HIPAA and HITECH regulations. The BAA governs the transmission, storage, and processing of Protected Health Information (PHI) through ALORA and is incorporated by reference into these Terms of Service."
    },
    {
      id: "responsibilities",
      title: "4. Clinic Responsibilities",
      content: "To enable proper operation of ALORA, the Clinic agrees to:",
      bullets: [
        "Provide accurate scheduling rules, provider availability, and clinic FAQ answers.",
        "Maintain active and correct credentials for EHR or Practice Management System (PMS) integrations.",
        "Ensure all call-forwarding and telephony systems directing calls to ALORA are correctly configured.",
        "Obtain any necessary patient consents for receiving automated text messages, appointment reminders, or voice notifications."
      ]
    },
    {
      id: "billing",
      title: "5. Subscriptions, Fees & Billing",
      content: "The Service is billed on a subscription basis (monthly or annually) according to the pricing package selected by the Clinic. Billing details include:",
      bullets: [
        "Overage Fees: Certain plans may contain call volume limits. Inbound calls exceeding these limits are billed at the standard overage rate outlined in your service contract.",
        "Price Adjustments: ALORA reserves the right to adjust subscription pricing with at least 30 days' advance notice to the Clinic.",
        "Taxes: All fees are exclusive of applicable local, state, or federal taxes, which are the sole responsibility of the Clinic."
      ]
    },
    {
      id: "availability",
      title: "6. System Availability & Support",
      content: "We strive to achieve a system availability rate of 99.9% for our AI voice receptionists. However, the Service relies on public telephony carriers (PSTN), hosting providers, and third-party AI APIs. ALORA is not liable for service outages, call drops, or latency caused by telecommunication provider failures or external network disruptions."
    },
    {
      id: "intellectual-property",
      title: "7. Intellectual Property & Data Ownership",
      content: "The Clinic retains all ownership rights to any caller data, transcripts, patient databases, and EHR schedules accessed by ALORA. ALORA owns all right, title, and interest in and to the AI models, software portals, proprietary prompt libraries, training workflows, and documentation created or used to deliver the Service."
    },
    {
      id: "limitation",
      title: "8. Limitation of Liability",
      content: "To the maximum extent permitted by law, ALORA shall not be liable for any indirect, incidental, special, or consequential damages (including loss of clinical revenue, business interruption, or loss of patient data) arising out of or in connection with the use or performance of the Service, even if advised of the possibility of such damages."
    }
  ];

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 grid-bg border-b border-border/50" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Legal Framework</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight mb-4">
            Terms of <span className="text-gradient italic">Service</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg">
            Agreement governing subscriptions, platform usage, AI capability scopes, and clinic-provider responsibilities.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="card-elevated rounded-2xl p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Details */}
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
