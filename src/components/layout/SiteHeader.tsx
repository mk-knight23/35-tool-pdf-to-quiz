"use client";

import { BookOpenCheck, Menu, X, FileText, BarChart3, Clock, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { NAV_LINKS, SITE, CREATOR } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

// Map nav links to matching Lucide icons for high-quality dashboard look
const NAV_ICONS: Record<string, typeof FileText> = {
  "/tool": FileText,
  "/dashboard": BarChart3,
  "/history": Clock,
  "/settings": Settings,
};

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Close mobile nav when pathname changes during render
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-white/5 dark:bg-slate-950/20 p-6 shrink-0 h-full">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 font-display text-xl text-ink mb-8">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent-strong text-on-accent shadow-md">
            <BookOpenCheck size={20} strokeWidth={2} aria-hidden />
          </span>
          <span className="font-bold tracking-tight">{SITE.name}</span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Sidebar Primary" className="flex-1 flex flex-col gap-1.5">
          {NAV_LINKS.map((link) => {
            const Icon = NAV_ICONS[link.href] || FileText;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent",
                  active
                    ? "bg-white/20 dark:bg-white/10 text-ink shadow-sm border-white/25 dark:border-white/10"
                    : "text-ink-secondary hover:bg-white/10 dark:hover:bg-white/5 hover:text-ink"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2 : 1.75} className={active ? "text-accent" : "text-ink-muted"} aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer controls & credits inside sidebar */}
        <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted font-medium">Appearance</span>
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href="/creator"
              className="group flex items-center gap-2 text-xs text-ink-secondary hover:text-ink font-medium"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-accent-tint text-accent">
                <User size={12} strokeWidth={2.5} />
              </span>
              <span className="group-hover:underline">{CREATOR.name}</span>
            </Link>
            <p className="text-[10px] text-ink-muted">AI Engineer & Developer</p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation Header */}
      <header className="md:hidden sticky top-0 z-40 w-full border-b border-white/10 bg-white/10 dark:bg-slate-950/40 backdrop-blur-xl transition-colors">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-lg text-ink">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent-strong text-on-accent shadow-sm">
              <BookOpenCheck size={16} strokeWidth={2} aria-hidden />
            </span>
            <span className="font-bold">{SITE.name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-white/15 text-ink-secondary bg-white/5"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav
            id="mobile-nav"
            aria-label="Primary mobile"
            className="border-t border-white/10 bg-white/30 dark:bg-slate-900/50 backdrop-blur-xl px-4 py-3 flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => {
              const Icon = NAV_ICONS[link.href] || FileText;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent-tint/80 text-accent font-semibold"
                      : "text-ink-secondary hover:bg-white/10 hover:text-ink"
                  )}
                >
                  <Icon size={18} strokeWidth={1.75} aria-hidden />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-white/10">
              <Link
                href="/creator"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs text-ink-secondary hover:text-ink px-4 py-2 font-medium"
              >
                <User size={14} />
                <span>By {CREATOR.name}</span>
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
