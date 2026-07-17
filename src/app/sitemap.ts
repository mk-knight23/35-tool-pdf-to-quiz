import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { USE_CASES } from "@/lib/use-cases";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tool",
    "/flashcards",
    "/dashboard",
    "/history",
    "/settings",
    "/docs",
    "/faq",
    "/changelog",
    "/about",
    "/creator",
    "/open-source",
    "/privacy",
    "/terms",
    "/cookies",
    "/contact",
    "/use-cases",
    "/guides",
  ].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const guideRoutes = Object.keys(GUIDES).map((slug) => ({
    url: `${SITE.url}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const useCaseRoutes = Object.keys(USE_CASES).map((slug) => ({
    url: `${SITE.url}/use-cases/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...guideRoutes, ...useCaseRoutes];
}
