import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "ALORA — AI Voice Receptionist for Clinics & Healthcare" },
      { name: "description", content: "ALORA builds HIPAA-compliant AI voice receptionists and automated answering systems exclusively for medical, dental, and healthcare practices. Answer every patient 24/7." },
      { name: "keywords", content: "AI Receptionist for Clinics, AI Receptionist for Hospitals, Healthcare Voice AI, Dental AI Answering Service, Medical Answering Service, HIPAA Answering Service" },
      { name: "author", content: "ALORA Health" },
      { name: "theme-color", content: "#8C78C8" },
      { name: "robots", content: "index, follow" },
      
      // OpenGraph SEO
      { property: "og:title", content: "ALORA — AI Voice Receptionist for Clinics & Healthcare" },
      { property: "og:description", content: "HIPAA-compliant AI voice receptionists built exclusively for healthcare. Answer every patient call, schedule appointments, and reduce workloads 24/7." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://alora.health" },
      { property: "og:image", content: "https://alora.health/og-image.png" },
      { property: "og:site_name", content: "ALORA" },
      
      // Twitter Card SEO
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ALORAHealth" },
      { name: "twitter:title", content: "ALORA — AI Voice Receptionist for Clinics & Healthcare" },
      { name: "twitter:description", content: "HIPAA-compliant AI voice receptionists built exclusively for medical and dental clinics." },
      { name: "twitter:image", content: "https://alora.health/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://alora.health" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" },
    ],
    scripts: [
      // Schema.org Structured Data: Organization
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ALORA",
          "url": "https://alora.health",
          "logo": "https://alora.health/logo.png",
          "description": "HIPAA-compliant AI voice receptionists for clinics, hospitals, and healthcare practices.",
          "sameAs": [
            "https://twitter.com/alorahealth"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "helloalora@outlook.in"
          }
        })
      },
      // Schema.org Structured Data: LocalBusiness / ProfessionalService
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "ALORA",
          "image": "https://alora.health/logo.png",
          "@id": "https://alora.health/#business",
          "url": "https://alora.health",
          "telephone": "",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "San Francisco",
            "addressRegion": "CA",
            "addressCountry": "US"
          },
          "areaServed": "US",
          "knowsAbout": ["Healthcare AI", "Medical Answering Service", "Dental AI Answering Service", "HIPAA Compliance"]
        })
      },
      // Schema.org Structured Data: WebSite
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ALORA",
          "url": "https://alora.health"
        })
      },
      // Google Analytics 4 Script (loads external library safely)
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",
        async: true,
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased overflow-x-hidden pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        {/* WCAG 2.2 AA Keyboard Accessibility: Skip to Main Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform"
        >
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Capture Referrer on landing
    if (!localStorage.getItem("alora_referrer")) {
      const referrer = document.referrer || "Direct";
      localStorage.setItem("alora_referrer", referrer);
    }

    // 2. Capture Landing Page (first visited page)
    if (!localStorage.getItem("alora_landing_page")) {
      localStorage.setItem("alora_landing_page", window.location.href);
    }

    // 3. Capture UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utms = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    utms.forEach((utm) => {
      const val = urlParams.get(utm);
      if (val) {
        localStorage.setItem(`alora_${utm}`, val);
      }
    });

    // 4. Generate unique client session ID if not exists
    if (!localStorage.getItem("alora_session_id")) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      const sessionId = Array.from(array, (dec) => dec.toString(16).padStart(2, "0")).join("");
      localStorage.setItem("alora_session_id", sessionId);
    }

    // 5. Initialize Google Analytics 4 dynamically to prevent CSP inline script blocks
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", "G-XXXXXXXXXX", { page_path: window.location.pathname });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

