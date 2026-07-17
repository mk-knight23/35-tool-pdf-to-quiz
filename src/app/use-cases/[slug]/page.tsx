import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { USE_CASES } from "@/lib/use-cases";
import { SITE } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = USE_CASES[slug];
  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/use-cases/${slug}` },
    openGraph: {
      title: item.title,
      description: item.description,
      type: "article",
      url: `${SITE.url}/use-cases/${slug}`,
    },
  };
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const item = USE_CASES[slug];
  if (!item) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE.url },
      { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": `${SITE.url}/use-cases` },
      { "@type": "ListItem", "position": 3, "name": item.title, "item": `${SITE.url}/use-cases/${slug}` },
    ],
  };

  return (
    <article className="flex flex-col gap-6 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={12} />
        <Link href="/use-cases" className="hover:text-ink">Use Cases</Link>
        <ChevronRight size={12} />
        <span className="text-ink-secondary truncate" aria-current="page">{item.title}</span>
      </nav>

      <div>
        <span className="text-3xs font-semibold uppercase tracking-[0.08em] text-accent">
          Audience: {item.audience}
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink leading-tight sm:text-5xl">{item.title}</h1>
        <p className="mt-3 text-lg text-ink-secondary leading-relaxed">{item.description}</p>
      </div>

      <hr className="border-line" />

      {/* Render Markdown Content */}
      <div 
        className="qf-prose text-ink leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: item.content
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
