import type { NextConfig } from "next";
import path from "path";

/**
 * Security headers (STANDARDS §8). Applied to every route via `headers()`.
 *
 * CSP notes / documented exceptions:
 * - `script-src` includes `'unsafe-inline'`: these headers are emitted
 *   statically (no per-request nonce) so the 38 routes can keep prerendering.
 *   Next.js App Router injects inline bootstrap/hydration scripts, and we emit
 *   an inline theme script + JSON-LD, all of which require `'unsafe-inline'`
 *   without a nonce. `'unsafe-eval'` is deliberately NOT allowed in production.
 * - `'wasm-unsafe-eval'` is allowed for client-side pdf.js image/codec decoding
 *   (WASM only — it does not permit JavaScript eval).
 * - `worker-src 'self' blob:` covers the pdf.js worker (same-origin file + the
 *   blob workers pdf.js may spawn).
 * - The GTM/GA/AdSense/Vercel-analytics hosts are listed as a ceiling only;
 *   nothing actually loads them until the user consents (§6) or ads are enabled
 *   (§7). CSP is an allow-list, not a loader.
 */
const GA_GTM = "https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com";
const ADSENSE = "https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net";
const VERCEL = "https://va.vercel-scripts.com https://vitals.vercel-insights.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${GA_GTM} ${ADSENSE} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${GA_GTM} ${ADSENSE} https://www.gstatic.com https://ssl.gstatic.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${GA_GTM} ${ADSENSE} ${VERCEL}`,
  `frame-src 'self' https://www.googletagmanager.com ${ADSENSE} https://td.doubleclick.net`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // STANDARDS §8: never leak the framework via X-Powered-By.
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
