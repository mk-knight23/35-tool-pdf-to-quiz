import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, RefreshCw, FileText, Clock, Flag, FlagOff, Share2, Award, BarChart3, Timer, Info } from "lucide-react";
import QuizScore from "./score";
import QuizReview from "./quiz-overview";
import { Question } from "@/lib/schemas";

type QuizProps = {
  questions: Question[];
  clearPDF: () => void;
  title: string;
};

const QuestionCard: React.FC<{
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  isSubmitted: boolean;
  showCorrectAnswer: boolean;
  isBookmarked: boolean;
  onBookmark: () => void;
  questionIndex: number;
  isTimerEnabled: boolean;
  timeRemaining: number;
  onTimeUp: () => void;
}> = ({ 
  question, 
  selectedAnswer, 
  onSelectAnswer, 
  showCorrectAnswer, 
  isBookmarked, 
  onBookmark, 
  questionIndex,
  isTimerEnabled,
  timeRemaining,
  onTimeUp
}) => {
  const answerLabels = ["A", "B", "C", "D"];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if submitted
      if (showCorrectAnswer) return;
      
      // Number keys 1-4
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        onSelectAnswer(answerLabels[key - 1]);
      }
      
      // Left/Right arrows
      if (e.key === "ArrowLeft") {
        // Handle previous question (this would be handled by parent component)
      }
      if (e.key === "ArrowRight") {
        // Handle next question (this would be handled by parent component)
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectAnswer, showCorrectAnswer, answerLabels]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold leading-tight flex-grow">
          {questionIndex + 1}. {question.question}
        </h2>
        {isBookmarked ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBookmark}
            className="ml-2"
          >
            <Flag className="h-5 w-5 text-amber-500" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBookmark}
            className="ml-2"
          >
            <FlagOff className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {isTimerEnabled && (
        <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="text-sm font-medium">Time Remaining:</span>
          </div>
          <div className={`text-sm font-medium ${timeRemaining < 30 ? "text-red-500" : ""}`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={
              selectedAnswer === answerLabels[index] ? "secondary" : "outline"
            }
            className={`h-auto py-6 px-4 justify-start text-left whitespace-normal ${
              showCorrectAnswer && answerLabels[index] === question.answer
                ? "bg-green-600 hover:bg-green-700"
                : showCorrectAnswer &&
                  selectedAnswer === answerLabels[index] &&
                  selectedAnswer !== question.answer
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
            }`}
            onClick={() => onSelectAnswer(answerLabels[index])}
          >
            <span className="text-lg font-medium mr-4 shrink-0">
              {answerLabels[index]}
            </span>
            <span className="flex-grow">{option}</span>
            {(showCorrectAnswer && answerLabels[index] === question.answer) ||
              (selectedAnswer === answerLabels[index] && (
                <Check className="ml-2 shrink-0 text-white" size={20} />
              ))}
            {showCorrectAnswer &&
              selectedAnswer === answerLabels[index] &&
              selectedAnswer !== question.answer && (
                <X className="ml-2 shrink-0 text-white" size={20} />
              )}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Info className="h-3 w-3" />
        <span>Use number keys (1-4) to select answers quickly</span>
      </div>
    </div>
  );
};

export default function Quiz({
  questions,
  clearPDF,
  title = "Quiz",
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(null),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>(
    Array(questions.length).fill(0),
  );
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes per question

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  // Track time spent on each question
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isTimerEnabled && !isSubmitted) {
      intervalId = setInterval(() => {
        setCurrentQuestionTime(prev => prev + 1);
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up for this question
            handleNextQuestion();
            return 120; // Reset timer for next question
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentQuestionIndex, isTimerEnabled, isSubmitted]);

  // Save time spent on question when changing questions
  useEffect(() => {
    if (currentQuestionTime > 0) {
      setTimePerQuestion(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = currentQuestionTime;
        return newTimes;
      });
      setCurrentQuestionTime(0);
    }
  }, [currentQuestionIndex, currentQuestionTime]);

  const handleSelectAnswer = (answer: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    // Save time for current question
    setTimePerQuestion(prev => {
      const newTimes = [...prev];
      newTimes[currentQuestionIndex] = currentQuestionTime;
      return newTimes;
    });
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeRemaining(120); // Reset timer
    }
  };

  const handleSubmit = () => {
    // Save time for current question
    setTimePerQuestion(prev => {
      const newTimes = [...prev];
      newTimes[currentQuestionIndex] = currentQuestionTime;
      return newTimes;
    });
    
    setIsSubmitted(true);
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (question.answer === answers[index] ? 1 : 0);
    }, 0);
    setScore(correctAnswers);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setScore(null);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setBookmarkedQuestions([]);
    setTimePerQuestion(Array(questions.length).fill(0));
    setCurrentQuestionTime(0);
    setTimeRemaining(120);
  };

  const toggleBookmark = (index: number) => {
    if (bookmarkedQuestions.includes(index)) {
      setBookmarkedQuestions(bookmarkedQuestions.filter(i => i !== index));
    } else {
      setBookmarkedQuestions([...bookmarkedQuestions, index]);
    }
  };

  const handleShare = async () => {
    const results = `I scored ${score}/${questions.length} on "${title}" quiz!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quiz Results",
          text: results,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(results);
        alert("Results copied to clipboard!");
      } catch (err) {
        console.log("Error copying to clipboard:", err);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Calculate analytics data
  const averageTime = timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length;
  const fastestQuestion = timePerQuestion.indexOf(Math.min(...timePerQuestion));
  const slowestQuestion = timePerQuestion.indexOf(Math.max(...timePerQuestion));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          {title}
        </h1>
        
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTimerEnabled(!isTimerEnabled)}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              {isTimerEnabled ? "Timer: On" : "Timer: Off"}
            </Button>
            {isSubmitted && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                Share Results
              </Button>
            )}
            {isSubmitted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-1"
              >
                <BarChart3 className="h-4 w-4" />
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </Button>
            )}
          </div>
        </div>
        
        <div className="relative">
          {!isSubmitted && <Progress value={progress} className="h-1 mb-8" />}
          <div className="min-h-[400px]">
            {" "}
            {/* Prevent layout shift */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSubmitted ? "results" : currentQuestionIndex}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {!isSubmitted ? (
                  <div className="space-y-8">
                    <QuestionCard
                      question={currentQuestion}
                      selectedAnswer={answers[currentQuestionIndex]}
                      onSelectAnswer={handleSelectAnswer}
                      isSubmitted={isSubmitted}
                      showCorrectAnswer={false}
                      isBookmarked={bookmarkedQuestions.includes(currentQuestionIndex)}
                      onBookmark={() => toggleBookmark(currentQuestionIndex)}
                      questionIndex={currentQuestionIndex}
                      isTimerEnabled={isTimerEnabled}
                      timeRemaining={timeRemaining}
                      onTimeUp={handleNextQuestion}
                    />
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="ghost"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                          <path d="m15 18-6-6 6-6"/>
                        </svg> Previous
                      </Button>
                      <span className="text-sm font-medium">
                        {currentQuestionIndex + 1} / {questions.length}
                        {bookmarkedQuestions.length > 0 && (
                          <span className="ml-2 text-xs text-amber-500 flex items-center gap-1">
                            <Flag className="h-3 w-3" />
                            {bookmarkedQuestions.length} bookmarked
                          </span>
                        )}
                      </span>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={answers[currentQuestionIndex] === null}
                        variant="ghost"
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? "Submit"
                          : "Next"}{" "}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <QuizScore
                      correctAnswers={score ?? 0}
                      totalQuestions={questions.length}
                    />
                    
                    {showAnalytics && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <h3 className="font-semibold text-lg">Performance Analytics</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Timer className="h-4 w-4" />
                              <span className="text-sm font-medium">Average Time</span>
                            </div>
                            <div className="text-lg font-bold">
                              {Math.floor(averageTime / 60)}:{(averageTime % 60).toString().padStart(2, "0")}
                            </div>
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500">
                                <path d="M7 14l5-5 5 5z"/>
                              </svg>
                              <span className="text-sm font-medium">Fastest Question</span>
                            </div>
                            <div className="text-lg font-bold">
                              Q{fastestQuestion + 1}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.floor(timePerQuestion[fastestQuestion] / 60)}:{(timePerQuestion[fastestQuestion] % 60).toString().padStart(2, "0")}
                            </div>
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-500">
                                <path d="M12 2v20M7 7l5 5 5-5M7 17l5-5 5 5"/>
                              </svg>
                              <span className="text-sm font-medium">Slowest Question</span>
                            </div>
                            <div className="text-lg font-bold">
                              Q{slowestQuestion + 1}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.floor(timePerQuestion[slowestQuestion] / 60)}:{(timePerQuestion[slowestQuestion] % 60).toString().padStart(2, "0")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="space-y-12">
                      <QuizReview 
                        questions={questions} 
                        userAnswers={answers} 
                        timePerQuestion={timePerQuestion}
                        bookmarkedQuestions={bookmarkedQuestions}
                      />
                    </div>
                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="bg-muted hover:bg-muted/80 w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                      </Button>
                      <Button
                        onClick={clearPDF}
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" /> Try Another PDF
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
