import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function RevenueLeakageCalculator() {
  // Input states
  const [treatmentValue, setTreatmentValue] = useState(800);
  const [bookingRate, setBookingRate] = useState(20);
  const [monthlyLeads, setMonthlyLeads] = useState(300);
  const [responseTimeOption, setResponseTimeOption] = useState("2-hours");

  // Response Time options mapping to Loss Factor
  const RESPONSE_TIMES = [
    { value: "under-5-mins", label: "Under 5 minutes", factor: 0.05 },
    { value: "15-mins", label: "15 minutes", factor: 0.15 },
    { value: "30-mins", label: "30 minutes", factor: 0.25 },
    { value: "1-hour", label: "1 hour", factor: 0.35 },
    { value: "2-hours", label: "2 hours (default)", factor: 0.50 },
    { value: "4-hours", label: "4 hours", factor: 0.60 },
    { value: "24-hours", label: "24 hours+", factor: 0.75 },
  ];

  // Helper pills for treatment value
  const TREATMENT_PILLS = [
    { label: "Dental Implant: $3,000+", value: 3000 },
    { label: "Invisalign: $4,000+", value: 4000 },
    { label: "General Dentistry: $500+", value: 500 },
    { label: "Medical Consultation: $200+", value: 200 },
  ];

  // Find active factor based on dropdown selection
  const selectedOption = RESPONSE_TIMES.find((o) => o.value === responseTimeOption) || RESPONSE_TIMES[4];
  const lossFactor = selectedOption.factor;

  // Live calculations
  // 1. Estimated Missed Patients = round( Monthly Leads × Loss Factor )
  const missedPatients = Math.round(monthlyLeads * lossFactor);

  // 2. Revenue Left on the Table = Missed Patients × Booking Rate × Average Treatment Value
  const revenueLeftOnTable = Math.round(missedPatients * (bookingRate / 100) * treatmentValue);

  // 3. Revenue Recovered With AI Voice Agent = Revenue Left on Table × 80%
  const revenueRecovered = Math.round(revenueLeftOnTable * 0.8);

  // 4. Front Desk Hours Saved = round( Missed Patients × 0.5 )
  const hoursSaved = Math.round(missedPatients * 0.5);

  // 5. Additional Appointments Booked = round( Missed Patients × 0.38 )
  const additionalAppointments = Math.round(missedPatients * 0.38);

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="py-24 lg:py-32 relative bg-background">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Headings */}
        <div className="text-center mb-12">
          <p className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            PATIENT REVENUE LEAKAGE CALCULATOR
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Every Missed Call Costs Patients & Revenue
          </h2>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT COLUMN: Input Panel */}
          <div className="card-elevated rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-8 h-full">
            {/* Control 1: Average Treatment Value */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-display font-semibold text-foreground">
                  Average Treatment Value
                </label>
                <span className="text-xs font-display font-bold px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary">
                  {formatCurrency(treatmentValue)}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="50"
                value={treatmentValue}
                onChange={(e) => setTreatmentValue(Number(e.target.value))}
                className="w-full h-1.5 bg-secondary border border-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none mb-2"
              />
              <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                Average revenue generated from a new patient.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TREATMENT_PILLS.map((pill) => (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => setTreatmentValue(pill.value)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all cursor-pointer ${
                      treatmentValue === pill.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Current Booking Rate */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-display font-semibold text-foreground">
                  Current Booking Rate
                </label>
                <span className="text-xs font-display font-bold px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary">
                  {bookingRate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={bookingRate}
                onChange={(e) => setBookingRate(Number(e.target.value))}
                className="w-full h-1.5 bg-secondary border border-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none mb-2"
              />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The percentage of inquiries that become booked appointments.
              </p>
            </div>

            {/* Control 3: Monthly Incoming Leads */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-display font-semibold text-foreground">
                  Monthly Incoming Leads
                </label>
                <span className="text-xs font-display font-bold px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary">
                  {monthlyLeads}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full h-1.5 bg-secondary border border-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none mb-2"
              />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The number of prospective patient inquiries received each month.
              </p>
            </div>

            {/* Control 4: Average Response Time */}
            <div className="flex flex-col">
              <label className="text-sm font-display font-semibold text-foreground mb-2">
                Average Response Time
              </label>
              <select
                value={responseTimeOption}
                onChange={(e) => setResponseTimeOption(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground outline-none focus:border-primary cursor-pointer text-sm font-sans"
              >
                {RESPONSE_TIMES.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                    {opt.label} ({Math.round(opt.factor * 100)}% Loss)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT COLUMN: Results Panel */}
          <div className="card-elevated rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 h-full">
            {/* Result Card 1: Estimated Missed Patients */}
            <div className="flex flex-col">
              <div className="text-4xl sm:text-5xl font-display font-extrabold text-foreground mb-2">
                {missedPatients}
              </div>
              <h4 className="text-sm font-display font-bold text-foreground mb-1">
                Estimated Missed Patients
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Potential patients who likely never booked because of delayed or missed responses.
              </p>
            </div>

            <hr className="border-border/60" />

            {/* Result Card 2: Revenue Left on the Table */}
            <div className="flex flex-col">
              <div className="text-4xl sm:text-5xl font-display font-extrabold text-foreground mb-2">
                {formatCurrency(revenueLeftOnTable)}<span className="text-lg font-normal text-muted-foreground">/mo</span>
              </div>
              <h4 className="text-sm font-display font-bold text-foreground mb-1">
                Revenue Left on the Table
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Estimated monthly revenue not captured because inquiries weren't handled instantly.
              </p>
            </div>

            <hr className="border-border/60" />

            {/* Result Card 3: Revenue Recovered with AI Voice Agent */}
            <div className="bg-primary/5 dark:bg-primary/10 border-2 border-primary/40 rounded-xl p-5 sm:p-6 shadow-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-gradient font-display font-extrabold text-4xl sm:text-5xl mb-2">
                +{formatCurrency(revenueRecovered)}<span className="text-lg font-normal text-primary">/mo</span>
              </div>
              <h4 className="text-sm font-display font-bold text-foreground mb-1">
                Potential Revenue Recovered With AI Voice Agent
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Additional revenue that could be recovered by responding to every patient instantly, 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS BAR: 3 Additional Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Card A — Missed Calls Answered */}
          <div className="card-elevated rounded-2xl p-6 text-center hover:border-primary/30 transition-all flex flex-col items-center">
            <div className="text-gradient font-display font-extrabold text-4xl mb-2">
              95%
            </div>
            <h4 className="text-xs font-display font-bold text-foreground mb-1 uppercase tracking-wider">
              Missed Calls Answered
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              of missed calls can be automatically answered and qualified.
            </p>
          </div>

          {/* Card B — Front Desk Hours Saved */}
          <div className="card-elevated rounded-2xl p-6 text-center hover:border-primary/30 transition-all flex flex-col items-center">
            <div className="text-gradient font-display font-extrabold text-4xl mb-2">
              {hoursSaved} hrs<span className="text-xs font-normal">/mo</span>
            </div>
            <h4 className="text-xs font-display font-bold text-foreground mb-1 uppercase tracking-wider">
              Front Desk Hours Saved
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Administrative time your staff can spend on patients instead of answering repetitive calls.
            </p>
          </div>

          {/* Card C — Additional Appointments Booked */}
          <div className="card-elevated rounded-2xl p-6 text-center hover:border-primary/30 transition-all flex flex-col items-center">
            <div className="text-gradient font-display font-extrabold text-4xl mb-2">
              +{additionalAppointments} appts<span className="text-xs font-normal">/mo</span>
            </div>
            <h4 className="text-xs font-display font-bold text-foreground mb-1 uppercase tracking-wider">
              Additional Appointments Booked
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Estimated increase in booked consultations.
            </p>
          </div>
        </div>

        {/* CTA Block */}
        <div className="text-center mt-12 max-w-xl mx-auto flex flex-col items-center gap-4">
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
            You're likely losing more patients than you think.
          </h3>
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p>Every missed call is a patient booking somewhere else.</p>
            <p>See how much revenue your clinic could recover with a 24/7 AI Voice Agent.</p>
          </div>
          <Link
            to="/contact"
            className="btn-primary rounded-full px-8 py-4 font-display font-semibold inline-flex items-center gap-2 w-full sm:w-[320px] justify-center mt-2"
          >
            Book My Free Revenue Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center mt-8 max-w-3xl mx-auto">
          *The figures above are estimated projections based on healthcare lead-response benchmarks and industry research. Actual results may vary depending on your specialty, patient demand, treatment value, and operational processes. This calculator is intended for educational and illustrative purposes only.
        </p>
      </div>
    </section>
  );
}
