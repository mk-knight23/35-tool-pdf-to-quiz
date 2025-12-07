"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Quiz from "@/components/quiz";
import PdfPreview from "@/components/pdf-preview";
import { Question } from "@/lib/types";
import { Loader2, Upload } from "lucide-react";

export default function Generator() {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generateQuiz = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const pdfData = e.target?.result as string;

        const res = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: [{ data: pdfData, name: file.name }],
            customization: { numQuestions, model: "minimax/minimax-m2:free" },
          }),
        });

        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setQuestions([]);
  };

  if (questions.length > 0) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Quiz questions={questions} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Generate Quiz</h1>
          <p className="text-muted-foreground">Upload a PDF to create a quiz</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="pdf">PDF File</Label>
            <Input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {file && <PdfPreview file={file} />}

          <div>
            <Label htmlFor="num">Number of Questions</Label>
            <Input
              id="num"
              type="number"
              min={2}
              max={10}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              disabled={loading}
            />
          </div>

          <Button
            onClick={generateQuiz}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
