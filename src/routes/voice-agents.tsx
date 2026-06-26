import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, Pause, Mic } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState, useRef, useEffect } from "react";

import jessicaAudio from "@/assets/jessica.mp3";
import carolinaAudio from "@/assets/carolina.mp3";
import kebinAudio from "@/assets/kebin.mp3";
import jerrybAudio from "@/assets/jerryb.mp3";

export const Route = createFileRoute("/voice-agents")({
  head: () => ({
    meta: [
      { title: "Voice Agents — ALORA" },
      { name: "description", content: "Meet ALORA's AI voice receptionists, designed for healthcare conversations." },
    ],
  }),
  component: VoiceAgents,
});

const VOICES = [
  {
    name: "Jessica",
    role: "Warm & Reassuring",
    description: "Perfect for family practices and pediatric clinics. Soft tone, empathetic pacing, and gentle handling of patient concerns.",
    audio: jessicaAudio,
  },
  {
    name: "Carolina",
    role: "Professional & Clear",
    description: "Ideal for specialty clinics, dental offices, and orthodontic practices. Confident, articulate, and informative.",
    audio: carolinaAudio,
  },
  {
    name: "Kebin",
    role: "Friendly & Conversational",
    description: "Great for wellness clinics, chiropractic, and physiotherapy. Approachable, casual, and engaging.",
    audio: kebinAudio,
  },
  {
    name: "Jerry B",
    role: "Calm & Composed",
    description: "Built for hospitals, mental health practices, and high-volume clinics. Steady, patient, and trustworthy.",
    audio: jerrybAudio,
  },
];

function VoiceAgents() {
  const [playingName, setPlayingName] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (voiceName: string, audioSrc: string) => {
    if (playingName === voiceName) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingName(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioSrc);
      audioRef.current.play().catch((err) => console.error("Error playing audio:", err));
      setPlayingName(voiceName);

      audioRef.current.onended = () => {
        setPlayingName(null);
      };
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <SiteLayout>
      <section className="pt-32 pb-20 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">Voices by ALORA</p>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl leading-tight mb-6">
            Voices that sound <span className="text-gradient italic">human.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the voice that best matches your clinic's personality. Each voice is engineered for healthcare conversations — natural pacing, empathy, and clarity.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {VOICES.map((v) => {
            const isPlaying = playingName === v.name;
            return (
              <div key={v.name} className="card-elevated rounded-2xl p-8 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl">{v.name}</h3>
                    <p className="text-sm text-muted-foreground">{v.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{v.description}</p>
                <button
                  onClick={() => handlePlay(v.name, v.audio)}
                  className={`rounded-full px-5 py-2.5 border transition-all inline-flex items-center gap-2 text-sm font-display font-semibold ${
                    isPlaying
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause voice
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Preview voice
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl leading-tight mb-6">
            Hear ALORA in your own practice.
          </h2>
          <p className="text-muted-foreground mb-8">Book a free demo and we'll show you exactly how ALORA would sound answering your clinic's calls.</p>
          <Link to="/contact" className="btn-primary rounded-full px-8 py-4 font-display font-semibold inline-flex items-center gap-2">
            Book Live Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

