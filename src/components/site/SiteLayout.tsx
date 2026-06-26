import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, Menu, X } from "lucide-react";
import logoLight from "@/assets/aloralogolight.png";
import logoDark from "@/assets/aloralogodark.png";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    // Always start in light mode on each page load per spec.
    document.documentElement.classList.remove("dark");
    setTheme("light");
  }, []);
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (next === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };
  return { theme, toggle };
}

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Revenue Systems", to: "/revenue-systems" },
  { label: "Voice Agents", to: "/voice-agents" },
  { label: "Solutions", to: "/solutions" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Nav({ theme, toggle }: { theme: "light" | "dark"; toggle: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-[72px]">
        <Link to="/" className="flex items-center gap-2">
          <img src={theme === "light" ? logoLight : logoDark} alt="ALORA" className="h-8 lg:h-9 w-auto" />
        </Link>
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="font-display font-semibold text-sm text-foreground/70 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <Link to="/contact" className="hidden sm:inline-flex btn-primary rounded-full px-5 py-2.5 text-sm font-semibold font-display">
            Book Free Consultation
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-full border border-border flex items-center justify-center">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="font-display font-semibold text-sm py-1">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer({ theme }: { theme: "light" | "dark" }) {
  return (
    <footer className="border-t border-border/60 mt-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <img src={theme === "light" ? logoLight : logoDark} alt="ALORA" className="h-9 w-auto mb-5" />
          <p className="text-muted-foreground max-w-md leading-relaxed">
            AI voice receptionists built exclusively for clinics, hospitals, and healthcare practices.
            Answer every patient, book more appointments, reduce front-desk workload.
          </p>
        </div>
        <div>
          <p className="font-display font-bold text-sm mb-4">Explore</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/revenue-systems" className="hover:text-foreground">Revenue Systems</Link></li>
            <li><Link to="/voice-agents" className="hover:text-foreground">Voice Agents</Link></li>
            <li><Link to="/solutions" className="hover:text-foreground">Solutions</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-sm mb-4">Get in touch</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground">Book Free Consultation</Link></li>
            <li><a href="mailto:helloalora@outlook.in" className="hover:text-foreground">helloalora@outlook.in</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ALORA. All rights reserved.</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-foreground">Cookie Policy</Link>
            <Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-16 lg:pt-[72px]">
      <Nav theme={theme} toggle={toggle} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer theme={theme} />
    </div>
  );
}
