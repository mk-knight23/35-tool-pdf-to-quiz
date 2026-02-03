import { Outlet, Link, NavLink } from 'react-router';
import { useSettingsStore } from '@/stores/settings';
import {
  Settings as SettingsIcon,
  Github,
  Home,
  Clock,
  BarChart3,
  X,
} from 'lucide-react';
import { SettingsPanel } from './components/SettingsPanel';
import { useState } from 'react';

export default function App() {
  const { isDarkMode, focusMode, toggleHelp } = useSettingsStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} ${focusMode ? 'focus-mode' : ''}`}>
      {focusMode && <div className="focus-mode-indicator">FOCUS MODE</div>}
      <SettingsPanel onClose={() => toggleHelp()} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-start mb-8 border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div>
                <h1 className="font-display text-2xl font-normal tracking-tight text-[var(--text-primary)]">
                  Quiz<span className="font-semibold">Flow</span>
                </h1>
                <p className="text-xs text-[var(--text-secondary)] font-body tracking-wide uppercase">
                  PDF to Quiz Generator
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className="nav-link">
              <Home size={16} strokeWidth={1.5} />
              <span>Generate</span>
            </NavLink>
            <NavLink to="/history" className="nav-link">
              <Clock size={16} strokeWidth={1.5} />
              <span>History</span>
            </NavLink>
            <NavLink to="/stats" className="nav-link">
              <BarChart3 size={16} strokeWidth={1.5} />
              <span>Stats</span>
            </NavLink>
            <button
              onClick={() => toggleHelp()}
              className="p-2.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-ink)] transition-all focus-ring"
              aria-label="Open settings"
            >
              <SettingsIcon size={16} strokeWidth={1.5} />
            </button>
            <a
              href="https://github.com/mk-knight23/37-PDF-to-Quiz-Generator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-ink)] transition-all focus-ring"
              aria-label="View on GitHub"
            >
              <Github size={16} strokeWidth={1.5} />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <BarChart3 size={18} />}
          </button>
        </header>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mb-8 p-4 border border-[var(--border-color)] rounded-lg space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">
              <Home size={16} strokeWidth={1.5} />
              <span>Generate</span>
            </Link>
            <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">
              <Clock size={16} strokeWidth={1.5} />
              <span>History</span>
            </Link>
            <Link to="/stats" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">
              <BarChart3 size={16} strokeWidth={1.5} />
              <span>Stats</span>
            </Link>
            <button
              onClick={() => {
                toggleHelp();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <SettingsIcon size={16} strokeWidth={1.5} />
              <span>Settings</span>
            </button>
          </nav>
        )}

        {/* Main Content */}
        <main>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-sm">
            <p className="text-[var(--text-secondary)] font-mono">
              Made by MK — Musharraf Kazi
            </p>
            <p className="text-[var(--text-secondary)] font-mono">
              © 2026 QuizFlow AI
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
