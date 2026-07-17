"use client";

import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, QuickModeBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { findDuplicateIds } from "@/lib/dedupe";
import { QUESTION_TYPE_LABELS, type Question } from "@/lib/types";
import { ExportMenu } from "./ExportMenu";
import type { Quiz } from "@/lib/types";

interface QuestionEditorProps {
  quiz: Quiz;
  quick: boolean;
  saving: boolean;
  saved: boolean;
  canRegenerate: boolean;
  regeneratingId: string | null;
  regeneratingAll: boolean;
  onChangeTitle: (title: string) => void;
  onUpdateQuestion: (id: string, patch: Partial<Question>) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onDelete: (id: string) => void;
  onRegenerateOne: (id: string) => void;
  onRegenerateAll: () => void;
  onPlay: () => void;
  onSave: () => void;
  onBack: () => void;
}

export function QuestionEditor({
  quiz,
  quick,
  saving,
  saved,
  canRegenerate,
  regeneratingId,
  regeneratingAll,
  onChangeTitle,
  onUpdateQuestion,
  onMove,
  onDelete,
  onRegenerateOne,
  onRegenerateAll,
  onPlay,
  onSave,
  onBack,
}: QuestionEditorProps) {
  const duplicateIds = useMemo(() => findDuplicateIds(quiz.questions), [quiz.questions]);

  return (
    <section aria-labelledby="editor-heading" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <h2 id="editor-heading" className="font-display text-2xl text-ink">
            Review &amp; edit
          </h2>
          <input
            aria-label="Quiz title"
            value={quiz.title}
            onChange={(e) => onChangeTitle(e.target.value)}
            className="max-w-md rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-4 py-2.5 text-base font-bold text-ink outline-none hover:border-accent focus:border-accent focus:bg-white/45 dark:focus:bg-slate-900/45 transition-all duration-200 shadow-sm"
          />
        </div>
        {quick ? <QuickModeBadge /> : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-secondary">
          {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}
        </span>
        {duplicateIds.size > 0 ? (
          <Badge tone="warning">
            <AlertTriangle size={13} strokeWidth={1.75} aria-hidden />
            {duplicateIds.size} possible duplicate{duplicateIds.size === 1 ? "" : "s"}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onPlay} disabled={quiz.questions.length === 0}>
          <Play size={16} strokeWidth={1.75} aria-hidden /> Play quiz
        </Button>
        <Button variant="secondary" onClick={onSave} loading={saving} disabled={quiz.questions.length === 0}>
          {saved ? (
            <>
              <Save size={16} strokeWidth={1.75} aria-hidden /> Saved
            </>
          ) : (
            <>
              <Save size={16} strokeWidth={1.75} aria-hidden /> Save quiz
            </>
          )}
        </Button>
        {canRegenerate ? (
          <Button
            variant="secondary"
            onClick={onRegenerateAll}
            loading={regeneratingAll}
            title="Re-run Quick mode on the same source"
          >
            <RefreshCw size={16} strokeWidth={1.75} aria-hidden /> Regenerate all
          </Button>
        ) : null}
        <Button variant="ghost" onClick={onBack}>
          Back to configure
        </Button>
      </div>

      <ol className="flex flex-col gap-3">
        {quiz.questions.map((question, i) => (
          <EditableCard
            key={question.id}
            index={i}
            question={question}
            isDuplicate={duplicateIds.has(question.id)}
            isFirst={i === 0}
            isLast={i === quiz.questions.length - 1}
            canRegenerate={canRegenerate}
            regenerating={regeneratingId === question.id}
            onUpdate={(patch) => onUpdateQuestion(question.id, patch)}
            onMove={(dir) => onMove(question.id, dir)}
            onDelete={() => onDelete(question.id)}
            onRegenerate={() => onRegenerateOne(question.id)}
          />
        ))}
      </ol>

      <ExportMenu quiz={quiz} />
    </section>
  );
}

interface EditableCardProps {
  index: number;
  question: Question;
  isDuplicate: boolean;
  isFirst: boolean;
  isLast: boolean;
  canRegenerate: boolean;
  regenerating: boolean;
  onUpdate: (patch: Partial<Question>) => void;
  onMove: (direction: "up" | "down") => void;
  onDelete: () => void;
  onRegenerate: () => void;
}

function EditableCard({
  index,
  question,
  isDuplicate,
  isFirst,
  isLast,
  canRegenerate,
  regenerating,
  onUpdate,
  onMove,
  onDelete,
  onRegenerate,
}: EditableCardProps) {
  const [editing, setEditing] = useState(false);
  const isChoice = question.type === "mcq" || question.type === "tf";

  const answerSummary = isChoice
    ? question.options[question.correctIndex] ?? "—"
    : question.acceptableAnswers.join(" / ") || "—";

  const updateOption = (optionIndex: number, value: string) => {
    const options = question.options.map((o, oi) => (oi === optionIndex ? value : o));
    onUpdate({ options });
  };

  const addOption = () => {
    if (question.options.length >= 6) return;
    onUpdate({ options: [...question.options, ""] });
  };

  const removeOption = (optionIndex: number) => {
    if (question.options.length <= 2) return;
    const options = question.options.filter((_, oi) => oi !== optionIndex);
    let correctIndex = question.correctIndex;
    if (optionIndex === correctIndex) correctIndex = 0;
    else if (optionIndex < correctIndex) correctIndex -= 1;
    onUpdate({ options, correctIndex });
  };

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-white/35 dark:bg-slate-900/40 border-white/20 dark:border-white/5 p-5 shadow-paper transition-all duration-200",
        isDuplicate ? "border-warning/30 bg-warning-tint" : "border-white/20 dark:border-white/5",
        editing && "border-accent shadow-lifted bg-white/45 dark:bg-slate-900/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-ink-muted font-semibold">Q{index + 1}</span>
          <Badge tone="accent">{QUESTION_TYPE_LABELS[question.type]}</Badge>
          {isDuplicate ? (
            <Badge tone="warning">
              <AlertTriangle size={12} strokeWidth={2} aria-hidden /> Possible duplicate
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-1 bg-white/10 dark:bg-slate-950/20 p-0.5 rounded-xl border border-white/10">
          <IconAction label="Move up" disabled={isFirst} onClick={() => onMove("up")}>
            <ChevronUp size={16} aria-hidden />
          </IconAction>
          <IconAction label="Move down" disabled={isLast} onClick={() => onMove("down")}>
            <ChevronDown size={16} aria-hidden />
          </IconAction>
          {canRegenerate ? (
            <IconAction
              label="Regenerate this question"
              disabled={regenerating}
              onClick={onRegenerate}
            >
              <RefreshCw size={15} className={regenerating ? "animate-spin text-accent" : ""} aria-hidden />
            </IconAction>
          ) : null}
          <IconAction label={editing ? "Close editor" : "Edit"} onClick={() => setEditing((v) => !v)}>
            <Pencil size={15} aria-hidden />
          </IconAction>
          <IconAction label="Delete question" tone="danger" onClick={onDelete}>
            <Trash2 size={15} aria-hidden />
          </IconAction>
        </div>
      </div>

      {!editing ? (
        <div className="flex flex-col gap-1.5 pl-1">
          <p className="text-ink font-medium leading-relaxed">{question.prompt}</p>
          <p className="text-xs text-ink-secondary mt-1">
            Answer: <span className="font-semibold text-accent">{answerSummary}</span>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pl-1">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
            Question
            <textarea
              value={question.prompt}
              onChange={(e) => onUpdate({ prompt: e.target.value })}
              rows={2}
              className="resize-y rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3.5 py-2.5 text-sm font-normal leading-relaxed text-ink outline-none focus:border-accent focus:bg-white/45 dark:focus:bg-slate-900/45 transition-all shadow-sm"
            />
          </label>

          {question.type === "mcq" ? (
            <fieldset className="flex flex-col gap-2.5">
              <legend className="text-xs font-semibold text-ink mb-1">Options (select the correct one)</legend>
              {question.options.map((option, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctIndex === oi}
                    onChange={() => onUpdate({ correctIndex: oi })}
                    aria-label={`Mark option ${oi + 1} correct`}
                    className="size-4 accent-[var(--color-accent-strong)] shrink-0"
                  />
                  <input
                    value={option}
                    onChange={(e) => updateOption(oi, e.target.value)}
                    className="flex-1 rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3.5 py-2 text-xs text-ink outline-none focus:border-accent focus:bg-white/45 dark:focus:bg-slate-900/45 transition-all shadow-sm"
                  />
                  <IconAction
                    label={`Remove option ${oi + 1}`}
                    tone="danger"
                    disabled={question.options.length <= 2}
                    onClick={() => removeOption(oi)}
                  >
                    <Trash2 size={14} aria-hidden />
                  </IconAction>
                </div>
              ))}
              {question.options.length < 6 ? (
                <Button variant="ghost" size="sm" className="self-start mt-1" onClick={addOption}>
                  <Plus size={14} strokeWidth={2} aria-hidden /> Add option
                </Button>
              ) : null}
            </fieldset>
          ) : null}

          {question.type === "tf" ? (
            <fieldset className="flex gap-5">
              <legend className="mb-2 w-full text-xs font-semibold text-ink">Correct answer</legend>
              {["True", "False"].map((label, oi) => (
                <label key={label} className="inline-flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctIndex === oi}
                    onChange={() => onUpdate({ correctIndex: oi })}
                    className="size-4 accent-[var(--color-accent-strong)]"
                  />
                  {label}
                </label>
              ))}
            </fieldset>
          ) : null}

          {question.type === "short" || question.type === "fill" ? (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
              Acceptable answers (comma-separated)
              <input
                value={question.acceptableAnswers.join(", ")}
                onChange={(e) =>
                  onUpdate({
                    acceptableAnswers: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3.5 py-2 text-xs font-normal text-ink outline-none focus:border-accent focus:bg-white/45 dark:focus:bg-slate-900/45 transition-all shadow-sm"
              />
            </label>
          ) : null}

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
            Explanation <span className="font-normal text-ink-muted">(optional)</span>
            <textarea
              value={question.explanation}
              onChange={(e) => onUpdate({ explanation: e.target.value })}
              rows={2}
              className="resize-y rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3.5 py-2 text-xs font-normal leading-relaxed text-ink outline-none focus:border-accent focus:bg-white/45 dark:focus:bg-slate-900/45 transition-all shadow-sm"
            />
          </label>
        </div>
      )}
    </li>
  );
}

function IconAction({
  label,
  onClick,
  disabled,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed",
        tone === "danger"
          ? "text-ink-secondary hover:bg-error-tint hover:text-error"
          : "text-ink-secondary hover:bg-white/10 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
