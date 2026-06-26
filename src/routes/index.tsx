import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Phone,
  Users,
  Clock,
  Heart,
  Shield,
  Zap,
  Headphones,
  Plus,
  Minus,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NetworkAnimation } from "@/components/site/NetworkAnimation";
import { IndustriesMarquee } from "@/components/site/IndustriesMarquee";
import { SITE_URL } from "../lib/config";
import { RevenueLeakageCalculator } from "@/components/site/RevenueLeakageCalculator";

const FAQS = [
  { q: "What exactly does ALORA do?", a: "ALORA provides AI voice receptionists for clinics, hospitals, and healthcare practices. Our AI answers calls 24/7, books appointments, reschedules visits, answers common patient questions, sends reminders, and supports your front desk team." },
  { q: "Will ALORA replace my front desk staff?", a: "No. ALORA is designed to support your team, not replace it. It handles repetitive calls and after-hours inquiries so your staff can spend more time helping patients in person." },
  { q: "Will I need to replace my existing software?", a: "No. ALORA is designed to work alongside your existing workflows. We can integrate with calendars, scheduling systems, CRMs, and other tools your practice already uses whenever possible." },
  { q: "How long does implementation take?", a: "Most clinics are up and running within a few days. The exact timeline depends on your call flows, scheduling requirements, and integrations, but our goal is to make setup as simple and fast as possible." },
  { q: "What if the AI gives incorrect information to a patient?", a: "Every AI receptionist is customized and thoroughly tested before going live. We define exactly what information ALORA can provide, and complex situations can always be transferred to your staff." },
  { q: "Can ALORA answer calls after business hours?", a: "Yes. ALORA works 24/7, including evenings, weekends, and holidays, ensuring your practice never misses another patient call." },
  { q: "Can patients book and reschedule appointments?", a: "Yes. ALORA can book appointments, reschedule existing visits, send confirmations, and provide reminders based on your clinic's scheduling rules." },
  { q: "Can ALORA handle multiple locations?", a: "Yes. We can configure separate call flows, hours, and scheduling rules for multi-location practices and healthcare groups." },
  { q: "How much work is required from my team?", a: "Very little. We handle setup, configuration, testing, and deployment. Your team simply provides information about your practice, and we take care of the rest." },
  { q: "How does pricing work?", a: "Every clinic has different call volumes and requirements, so we provide custom pricing based on your needs. Schedule a demo and we'll recommend the best solution for your practice." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALORA — AI Voice Receptionist for Clinics & Healthcare" },
      {
        name: "description",
        content:
          "ALORA answers every patient call, books appointments, handles FAQs, and supports your front desk 24/7. AI voice agents built for clinics, hospitals, and healthcare.",
      },
      { property: "og:title", content: "ALORA — AI Voice Receptionist for Healthcare" },
      {
        property: "og:description",
        content: "Never miss another patient call. ALORA is a 24/7 AI receptionist built for clinics.",
      },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:url", content: SITE_URL },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "canonical", href: SITE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a,
            },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center pt-28 pb-16 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-display font-semibold tracking-widest uppercase text-primary">
              AI Receptionist for Healthcare
            </span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
            Every missed call is a <span className="text-gradient italic">missed patient.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
            ALORA answers every patient call, books appointments, answers every FAQ, and supports your front desk 24/7.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary rounded-full px-7 py-3.5 font-display font-semibold inline-flex items-center gap-2">
              Book a free audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/revenue-systems" className="rounded-full px-7 py-3.5 font-display font-semibold border border-border hover:bg-secondary transition-colors">
              See our systems
            </Link>
          </div>
        </div>
        <div className="w-full">
          <NetworkAnimation />
        </div>
      </div>
    </section>
  );
}

function Problems() {
  const items = [
    {
      title: "Every Missed Call Is Lost Revenue",
      body: "A patient calls. Nobody answers. They move on to another clinic. Every unanswered call is a missed opportunity to book an appointment.",
    },
    {
      title: "Your Front Desk Is Overwhelmed",
      body: "Constant phone calls, appointment changes, and patient questions pull your staff away from what matters most—your patients.",
    },
    {
      title: "Patients Need You 24/7",
      body: "Healthcare doesn't stop at 5 PM. Patients need answers after hours, on weekends, and during emergencies. Your clinic should never miss an opportunity to help.",
    },
  ];
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <h2 className="font-display font-extrabold text-4xl lg:text-6xl leading-tight max-w-2xl">
            You're providing excellent care.
            <br />
            <span className="text-foreground/50">But missed calls are costing you patients.</span>
          </h2>
          <Link to="/revenue-systems" className="btn-primary rounded-full px-6 py-3 font-display font-semibold inline-flex items-center gap-2">
            We fix all three. See how <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <div key={p.title} className="card-elevated rounded-2xl p-8 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-12">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  {i === 0 ? <Phone className="w-5 h-5" /> : i === 1 ? <Users className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <span className="font-display font-bold text-3xl text-muted-foreground/40">0{i + 1}</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-4">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyAlora() {
  const items = [
    {
      icon: Heart,
      title: "Patients First, Technology Second",
      body: "We don't deploy AI just because it's exciting. Every workflow has one purpose: helping your practice answer more calls, book more appointments, and deliver a better patient experience.",
    },
    {
      icon: Phone,
      title: "More Appointments. Less Revenue Left Behind.",
      body: "Every missed call is a missed opportunity. ALORA is designed to recover lost appointments, reduce missed calls, and help your practice capture more revenue without increasing marketing spend.",
    },
    {
      icon: Zap,
      title: "Live in Days, Not Months",
      body: "No lengthy implementation projects. No complicated setup. Your AI receptionist can be configured, tested, and answering patient calls in just a few days.",
    },
    {
      icon: Shield,
      title: "Zero Extra Work for Your Team",
      body: "Your staff shouldn't have to learn another complicated system. We build, customize, integrate, and maintain everything behind the scenes. Your team simply gets more time back and fewer interruptions.",
    },
  ];
  return (
    <section className="py-24 lg:py-32 relative" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Why ALORA</p>
        <h2 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight mb-16 max-w-3xl">
          Why healthcare teams <span className="text-gradient">choose ALORA</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((it) => (
            <div key={it.title} className="card-elevated rounded-2xl p-8 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-6">
                <it.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{it.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Voices by ALORA</p>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight mb-6">
            Hear the <span className="text-gradient">difference.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            AI receptionists that sound natural, professional, and human.
          </p>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            From answering new patient inquiries to scheduling appointments, every voice is designed to create a comfortable experience for your patients.
          </p>
          <ul className="space-y-2 mb-8 text-sm">
            {[
              "Human-like conversations",
              "Natural pauses and emotions",
              "Built for healthcare interactions",
              "Available 24/7",
              "Custom voices for your practice",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-xs">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link to="/voice-agents" className="btn-primary rounded-full px-7 py-3.5 font-display font-semibold inline-flex items-center gap-2">
            Explore Voice Agents <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="card-elevated rounded-3xl p-10 relative">
          <Headphones className="w-10 h-10 text-primary mb-6" />
          <p className="font-display font-bold text-2xl lg:text-3xl leading-snug mb-4">
            "Most patients won't realize they're speaking with AI."
          </p>
          <p className="text-sm text-muted-foreground">— Designed for warmth, calibrated for healthcare.</p>
          <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-display font-bold uppercase tracking-wider">Live demo</div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      title: "We Learn Your Practice",
      body: "30-minute discovery call. We understand how your clinic handles calls today, identify where appointments are being lost, and map exactly how ALORA can support your team.",
    },
    {
      title: "We Configure Your AI Receptionist",
      body: "We train ALORA on your services, hours, insurance info, FAQs, scheduling rules, emergency routing, and multi-location workflows. Everything customized to your practice.",
    },
    {
      title: "We Integrate & Test",
      body: "We connect ALORA with your phone system, calendar, and workflows. Before going live we run extensive testing to ensure every patient receives a seamless experience.",
    },
    {
      title: "Go Live & Never Miss Another Call",
      body: "Your AI receptionist starts answering calls 24/7. Patients get immediate responses, appointments are booked automatically, and your front desk gets valuable time back.",
    },
  ];
  return (
    <section className="py-24 lg:py-32 grid-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="inline-flex items-center gap-3 text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-6">
          <span className="w-8 h-px bg-primary" /> Our Process
        </p>
        <h2 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight max-w-3xl">
          From discovery call to your AI receptionist answering patient calls.
          <br />
          <span className="text-foreground/50">Live in days, not months.</span>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-2xl">
          Implementation usually takes less than 14 working days. No hardware. No long-term contracts. No disruption to your clinic.
        </p>

        <div className="grid md:grid-cols-4 gap-8 mt-20 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <div key={s.title} className="text-center relative">
              <div className="relative z-10 inline-flex items-center justify-center mb-6">
                <span className="font-display font-extrabold text-5xl text-muted-foreground/30">0{i + 1}</span>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4 text-center">FAQ</p>
        <h2 className="font-display font-extrabold text-4xl lg:text-5xl leading-tight text-center mb-4">
          Clear answers. <span className="text-foreground/50">No jargon.</span>
        </h2>
        <div className="mt-16 divide-y divide-border border-t border-b border-border">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display font-semibold text-lg">{f.q}</span>
                  <span className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-primary flex-shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && <p className="pb-6 text-muted-foreground leading-relaxed pr-12">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="card-elevated rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
          <h2 className="font-display font-extrabold text-4xl lg:text-6xl leading-tight mb-4">
            Your patients shouldn't go <span className="text-gradient">unanswered.</span>
          </h2>
          <p className="font-display font-bold text-2xl lg:text-3xl mb-6">Let's fix it.</p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Book a free 30-minute consultation. We'll show you exactly where your practice is missing calls, losing appointments, and how an AI receptionist can help you answer every patient, reduce front-desk workload, and capture more revenue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary rounded-full px-8 py-4 font-display font-semibold inline-flex items-center gap-2">
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/revenue-systems" className="rounded-full px-8 py-4 font-display font-semibold border border-border hover:bg-secondary transition-colors">
              Explore Solutions
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6">No obligation. No pressure. Just clarity.</p>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <IndustriesMarquee />
      <Problems />
      <RevenueLeakageCalculator />
      <WhyAlora />
      <Voices />
      <Process />
      <FAQ />
      <CTA />
    </SiteLayout>
  );
}
