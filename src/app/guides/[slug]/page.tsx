import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GUIDES } from "@/lib/guides";
import { SITE, CREATOR } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `${SITE.url}/guides/${slug}`,
      publishedTime: guide.publishedAt,
      authors: [CREATOR.portfolio],
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "datePublished": guide.publishedAt,
    "author": {
      "@type": "Person",
      "name": CREATOR.name,
      "url": CREATOR.portfolio,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE.url}/favicon.ico`,
      },
    },
    "mainEntityOfPage": `${SITE.url}/guides/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE.url },
      { "@type": "ListItem", "position": 2, "name": "Guides", "item": `${SITE.url}/guides` },
      { "@type": "ListItem", "position": 3, "name": guide.title, "item": `${SITE.url}/guides/${slug}` },
    ],
  };

  return (
    <article className="flex flex-col gap-6 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={12} />
        <Link href="/guides" className="hover:text-ink">Guides</Link>
        <ChevronRight size={12} />
        <span className="text-ink-secondary truncate" aria-current="page">{guide.title}</span>
      </nav>

      <div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span>Published on {guide.publishedAt}</span>
          <span>·</span>
          <span>{guide.readTime}</span>
        </div>
        <h1 className="mt-2 font-display text-4xl text-ink leading-tight sm:text-5xl">{guide.title}</h1>
        <p className="mt-3 text-lg text-ink-secondary leading-relaxed">{guide.description}</p>
      </div>

      <hr className="border-line" />

      {/* Render Markdown Content */}
      <div 
        className="qf-prose text-ink leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: guide.content
            .replace(/\n## (.*)/g, '<h2 class="font-display text-2xl text-ink mt-8 mb-4">$1</h2>')
            .replace(/\n### (.*)/g, '<h3 class="font-display text-xl text-ink mt-6 mb-3">$1</h3>')
            .replace(/\n\* (.*)/g, '<li class="my-1.5">$1</li>')
            .replace(/\n([0-9]+)\. (.*)/g, '<li class="my-1.5">$2</li>')
            .split('\n\n')
            .map(p => {
              if (p.trim().startsWith('<h') || p.trim().startsWith('<li') || p.trim().startsWith('<ul')) return p;
              return `<p class="my-4 text-sm text-ink-secondary leading-relaxed">${p.trim()}</p>`;
            })
            .join('')
        }}
      />
    </article>
  );
}
