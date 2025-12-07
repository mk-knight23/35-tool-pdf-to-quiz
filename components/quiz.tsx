"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/lib/types";

type QuizProps = {
  questions: Question[];
  onReset: () => void;
};

export default function Quiz({ questions, onReset }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p className="text-lg">
          Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
        </p>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="border-l-4 pl-4" style={{ borderColor: answers[i] === q.answer ? "#22c55e" : "#ef4444" }}>
              <p className="font-medium">{q.question}</p>
              <p className="text-sm text-muted-foreground">
                Your answer: {answers[i]} | Correct: {q.answer}
              </p>
            </div>
          ))}
        </div>
        <Button onClick={onReset} className="w-full">New Quiz</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {current + 1} of {questions.length}</span>
        </div>
        <Progress value={progress} />
      </div>

      <h2 className="text-xl font-semibold">{question.question}</h2>

      <div className="space-y-2">
        {["A", "B", "C", "D"].map((letter, i) => (
          <Button
            key={letter}
            onClick={() => handleAnswer(letter)}
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
          >
            <span className="font-bold mr-2">{letter}.</span>
            {question.options[i]}
          </Button>
        ))}
      </div>
    </Card>
  );
}
