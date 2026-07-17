/** Canonical site + creator identity (STANDARDS §3, exact and non-negotiable). */
export const SITE = {
  name: "MK QuizFlow",
  shortName: "QuizFlow",
  description:
    "Turn PDFs and pasted notes into quizzes and flashcards, right in your browser. The deterministic Quick mode works with zero AI keys.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://quizflow.mkazi.live").replace(/\/$/, ""),
} as const;

export const CREATOR = {
  name: "Kazi Musharraf",
  role: "AI Engineer · Full-Stack Developer · Open-Source Builder",
  github: "https://github.com/mk-knight23",
  portfolio: "https://www.mkazi.live",
  repo: "https://github.com/mk-knight23/35-tool-pdf-to-quiz",
  email: "kazi@reprime.com",
  issues: "https://github.com/mk-knight23/35-tool-pdf-to-quiz/issues",
} as const;

/** The exact footer sentence required on every public route (STANDARDS §3). */
export const FOOTER_SENTENCE = "Built and maintained by Kazi Musharraf. Open source for everyone.";

export const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/tool", label: "Create" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];
