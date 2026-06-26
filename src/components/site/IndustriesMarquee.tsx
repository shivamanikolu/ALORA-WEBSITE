const ITEMS = [
  "Dental Clinics",
  "Medical Clinics",
  "Hospitals",
  "Private Practices",
  "Med Spas",
  "Eye Clinics",
  "Orthodontic Clinics",
  "Pediatric Clinics",
  "Urgent Care Centers",
  "Multi-Specialty Clinics",
  "Mental Health Clinics",
  "Physical Therapy Clinics",
  "Veterinary Clinics",
];

export function IndustriesMarquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section className="py-14 border-y border-border/60 overflow-hidden">
      <p className="text-center text-xs font-display font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-7">
        Built For Healthcare
      </p>
      <div className="relative overflow-hidden">
        <div className="flex w-max marquee-track">
          {loop.map((t, i) => (
            <span
              key={i}
              className="mx-3 px-5 py-2 rounded-full border border-border bg-card/60 text-sm font-medium text-foreground/80 whitespace-nowrap"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to right, var(--background), transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to left, var(--background), transparent)" }} />
      </div>
    </section>
  );
}
