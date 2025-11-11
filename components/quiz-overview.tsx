import { Check, X, Flag, Timer, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Question } from '@/lib/schemas'

interface QuizReviewProps {
  questions: Question[]
  userAnswers: string[]
  timePerQuestion?: number[]
  bookmarkedQuestions?: number[]
}

export default function QuizReview({ 
  questions, 
  userAnswers, 
  timePerQuestion = [],
  bookmarkedQuestions = []
}: QuizReviewProps) {
  const answerLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quiz Review</CardTitle>
        {bookmarkedQuestions.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {bookmarkedQuestions.length} bookmarked question(s)
          </p>
        )}
      </CardHeader>
      <CardContent>
        {questions.map((question, questionIndex) => {
          const isBookmarked = bookmarkedQuestions.includes(questionIndex);
          const time = timePerQuestion[questionIndex] || 0;
          
          return (
            <div key={questionIndex} className="mb-8 last:mb-0">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{question.question}</h3>
                <div className="flex items-center gap-2 text-sm">
                  {isBookmarked && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Flag className="h-4 w-4" />
                      <span>Bookmarked</span>
                    </div>
                  )}
                  {time > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const currentLabel = answerLabels[optionIndex]
                  const isCorrect = currentLabel === question.answer
                  const isSelected = currentLabel === userAnswers[questionIndex]
                  const isIncorrectSelection = isSelected && !isCorrect

                  return (
                    <div
                      key={optionIndex}
                      className={`flex items-center p-4 rounded-lg ${
                        isCorrect
                          ? 'bg-green-100 dark:bg-green-700/50'
                          : isIncorrectSelection
                          ? 'bg-red-100 dark:bg-red-700/50'
                          : 'border border-border'
                      }`}
                    >
                      <span className="text-lg font-medium mr-4 w-6">{currentLabel}</span>
                      <span className="flex-grow">{option}</span>
                      {isCorrect && (
                        <Check className="ml-2 text-green-600 dark:text-green-400" size={20} />
                      )}
                      {isIncorrectSelection && (
                        <X className="ml-2 text-red-600 dark:text-red-400" size={20} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
