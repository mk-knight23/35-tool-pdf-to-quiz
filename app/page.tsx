import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Zap, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-5xl font-bold tracking-tight">
          PDF to Quiz Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform any PDF into an interactive quiz in seconds using AI
        </p>
        <Button asChild size="lg">
          <Link href="/generator">Get Started</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card className="p-6 text-center space-y-3">
          <FileText className="h-12 w-12 mx-auto text-primary" />
          <h3 className="font-semibold">Upload PDF</h3>
          <p className="text-sm text-muted-foreground">
            Upload any PDF document
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <Zap className="h-12 w-12 mx-auto text-primary" />
          <h3 className="font-semibold">AI Generation</h3>
          <p className="text-sm text-muted-foreground">
            AI creates quiz questions
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <CheckCircle className="h-12 w-12 mx-auto text-primary" />
          <h3 className="font-semibold">Take Quiz</h3>
          <p className="text-sm text-muted-foreground">
            Interactive quiz experience
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "AI-powered question generation",
            "Multiple choice questions",
            "Instant results and scoring",
            "Clean, modern interface",
            "Free to use",
            "No registration required",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
