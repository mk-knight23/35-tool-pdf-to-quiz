import type { Question, Quiz } from "./types";
import { QUESTION_TYPE_LABELS } from "./types";

export const QUICK_MODE_LABEL = "Quick mode (no AI)";

function modeLabel(quiz: Quiz): string {
  return quiz.mode === "quick" ? QUICK_MODE_LABEL : "AI-assisted";
}

function answerText(q: Question): string {
  if (q.type === "mcq" || q.type === "tf") return q.options[q.correctIndex] ?? "";
  return q.acceptableAnswers.join(" / ");
}

export function toJson(quiz: Quiz): string {
  return JSON.stringify(quiz, null, 2);
}

function csvCell(value: string): string {
  const needsQuoting = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

export function toCsv(quiz: Quiz): string {
  const header = ["#", "Type", "Question", "Options", "Answer", "Explanation", "Mode"];
  const rows = quiz.questions.map((q, i) => [
    String(i + 1),
    QUESTION_TYPE_LABELS[q.type],
    q.prompt,
    q.options.join(" | "),
    answerText(q),
    q.explanation,
    modeLabel(quiz),
  ]);
  return [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
}

export function toMarkdown(quiz: Quiz): string {
  const lines: string[] = [];
  lines.push(`# ${quiz.title}`, "");
  lines.push(`*${quiz.questions.length} questions · ${modeLabel(quiz)} · Source: ${quiz.sourceName}*`, "");
  quiz.questions.forEach((q, i) => {
    lines.push(`## ${i + 1}. ${q.prompt}`);
    lines.push(`*${QUESTION_TYPE_LABELS[q.type]}*`, "");
    if (q.options.length > 0) {
      q.options.forEach((opt, oi) => {
        const marker = oi === q.correctIndex ? "**✓**" : "-";
        lines.push(`${marker} ${String.fromCharCode(65 + oi)}. ${opt}`);
      });
      lines.push("");
    }
    lines.push(`**Answer:** ${answerText(q)}`);
    if (q.explanation) lines.push("", `> ${q.explanation}`);
    lines.push("");
  });
  lines.push("---", "", `Made with MK QuizFlow — Built and maintained by Kazi Musharraf. Open source for everyone.`);
  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Self-contained printable HTML (print-to-PDF path). No external assets, print CSS included. */
export function toPrintableHtml(quiz: Quiz): string {
  const questionsHtml = quiz.questions
    .map((q, i) => {
      const options =
        q.options.length > 0
          ? `<ol type="A" class="opts">${q.options
              .map(
                (opt, oi) =>
                  `<li${oi === q.correctIndex ? ' class="correct"' : ""}>${escapeHtml(opt)}</li>`,
              )
              .join("")}</ol>`
          : "";
      const answer = `<p class="answer"><strong>Answer:</strong> ${escapeHtml(answerText(q))}</p>`;
      const explanation = q.explanation
        ? `<p class="explain">${escapeHtml(q.explanation)}</p>`
        : "";
      return `<article class="q"><h2>${i + 1}. ${escapeHtml(q.prompt)}</h2><p class="type">${escapeHtml(
        QUESTION_TYPE_LABELS[q.type],
      )}</p>${options}${answer}${explanation}</article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(quiz.title)}</title>
<style>
  :root { color-scheme: light; }
  body { font-family: Palatino, Georgia, serif; color: #1c1917; max-width: 46rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
  header { border-bottom: 2px solid #e7e0d5; padding-bottom: 1rem; margin-bottom: 1.5rem; }
  h1 { font-size: 1.75rem; margin: 0 0 .5rem; }
  .badge { display: inline-block; background: #f7eddd; color: #b45309; border-radius: 999px; padding: .15rem .6rem; font-size: .8rem; font-family: system-ui, sans-serif; }
  .meta { color: #57534e; font-size: .9rem; font-family: system-ui, sans-serif; }
  .q { margin: 1.25rem 0; page-break-inside: avoid; }
  .q h2 { font-size: 1.1rem; margin: 0 0 .25rem; }
  .type { font-size: .8rem; color: #79716b; font-family: system-ui, sans-serif; margin: 0 0 .5rem; }
  .opts { margin: .25rem 0 .5rem 1.25rem; }
  .opts li.correct { font-weight: 700; }
  .answer { font-family: system-ui, sans-serif; }
  .explain { color: #57534e; font-style: italic; }
  footer { margin-top: 2rem; border-top: 1px solid #e7e0d5; padding-top: 1rem; font-size: .85rem; color: #79716b; font-family: system-ui, sans-serif; }
  @media print { body { margin: 0; max-width: none; } .no-print { display: none; } }
</style></head>
<body>
  <header>
    <h1>${escapeHtml(quiz.title)}</h1>
    <p>${quiz.mode === "quick" ? `<span class="badge">${QUICK_MODE_LABEL}</span> ` : ""}<span class="meta">${quiz.questions.length} questions · Source: ${escapeHtml(quiz.sourceName)}</span></p>
  </header>
  <main>${questionsHtml}</main>
  <footer>Made with MK QuizFlow. Built and maintained by Kazi Musharraf. Open source for everyone.</footer>
</body></html>`;
}

/** Trigger a client-side download of text content. Browser only. */
export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "quiz"
  );
}
