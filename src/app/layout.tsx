import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsScripts } from "@/components/layout/AnalyticsScripts";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { CREATOR, SITE } from "@/lib/site";
import "./globals.css";

/** Ads load only when explicitly enabled AND a publisher id is present (STANDARDS §7). */
const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
  Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — PDF & notes to quizzes and flashcards`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: CREATOR.name, url: CREATOR.portfolio }],
  creator: CREATOR.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — PDF & notes to quizzes and flashcards`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SITE.name,
    "description": SITE.description,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "url": SITE.url,
    "author": {
      "@type": "Person",
      "name": CREATOR.name,
      "url": CREATOR.portfolio,
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <ThemeScript />
        {/* AEO & SEO Structured JSON-LD Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* AdSense loads only when explicitly enabled (default off) — see MONETIZATION_PLAN.md */}
        {ADSENSE_ENABLED && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="flex min-h-dvh flex-col bg-surface text-ink antialiased relative overflow-x-hidden">
        {/* Floating animated blobs */}
        <div className="qf-blob qf-blob-1" aria-hidden="true" />
        <div className="qf-blob qf-blob-2" aria-hidden="true" />
        <div className="qf-blob qf-blob-3" aria-hidden="true" />

        <a href="#main-content" className="qf-skip-link">
          Skip to content
        </a>
        
        {/* Outer Glass Shell Container */}
        <div className="mx-auto sm:my-4 md:my-8 w-full max-w-6xl flex-1 flex flex-col md:flex-row rounded-none sm:rounded-2xl md:rounded-3xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-slate-950/15 backdrop-blur-2xl shadow-overlay overflow-hidden relative z-10">
          <SiteHeader />
          <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white/5 dark:bg-slate-950/5">
            <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8 overflow-y-auto">
              {children}
            </main>
            <SiteFooter />
          </div>
        </div>

        {/* Cookie consent + consent-gated GTM/GA loader (STANDARDS §6) */}
        <ConsentBanner />
        <AnalyticsScripts />

        {/* Vercel Web Analytics and Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
