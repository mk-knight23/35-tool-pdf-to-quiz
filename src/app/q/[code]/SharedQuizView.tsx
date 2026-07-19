"use client";

import Link from "next/link";
import { useState } from "react";
import { QuizPlayer, type PlaySession } from "@/components/player/QuizPlayer";
import { QuizResults } from "@/components/player/QuizResults";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import type { Question, Quiz } from "@/lib/types";

type Phase = "intro" | "play" | "results";

interface SharedQuizViewProps {
  quiz: Quiz;
}

/** Public, no-login player for a cloud-shared quiz. Funnels finishers into the creator. */
export function SharedQuizView({ quiz }: SharedQuizViewProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [session, setSession] = useState<PlaySession | null>(null);

  const start = (qs: Question[]) => {
    setQuestions(qs);
    setSession(null);
    setPhase("play");
    track("shared_quiz_started", { count: qs.length });
  };

  if (phase === "play") {
    return (
      <QuizPlayer
        title={quiz.title}
        questions={questions}
        quick={quiz.mode === "quick"}
        timed={quiz.timed}
        timeLimitSec={quiz.timeLimitSec}
        onFinish={(s) => {
          setSession(s);
          setPhase("results");
          track("shared_quiz_finished", { count: questions.length });
        }}
        onExit={() => setPhase("intro")}
      />
    );
  }

  if (phase === "results" && session) {
    return (
      <div className="flex flex-col gap-6">
        <QuizResults
          title={quiz.title}
          questions={questions}
          answers={session.answers}
          durationSec={session.durationSec}
          onRetakeAll={() => start(quiz.questions)}
          onRetakeIncorrect={(ids) => start(quiz.questions.filter((q) => ids.includes(q.id)))}
          onDone={() => setPhase("intro")}
        />
        <CreateYourOwn />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 p-6 shadow-paper">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">Shared quiz</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">{quiz.title}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"}
          {quiz.timed && quiz.timeLimitSec ? ` · timed (${Math.round(quiz.timeLimitSec / 60)} min)` : ""}
        </p>
        <div className="mt-5">
          <Button variant="primary" size="md" onClick={() => start(quiz.questions)}>
            Start quiz
          </Button>
        </div>
      </div>
      <CreateYourOwn />
    </div>
  );
}

function CreateYourOwn() {
  return (
    <div className="rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 p-5 text-center shadow-paper">
      <p className="text-sm font-semibold">Make your own quiz from any PDF or notes</p>
      <p className="mt-1 text-xs text-ink-muted">Free · no sign-up · works offline</p>
      <div className="mt-4">
        <Link href="/tool">
          <Button variant="secondary" size="sm" onClick={() => track("shared_quiz_cta_clicked", {})}>
            Create a quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
