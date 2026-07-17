/**
 * Inline, render-blocking theme bootstrap to avoid a flash of the wrong theme.
 * Reads the same key as src/lib/prefs.ts and applies `.dark` before paint.
 */
export function ThemeScript() {
  const js = `(function(){try{var m=localStorage.getItem('quizflow.theme')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
