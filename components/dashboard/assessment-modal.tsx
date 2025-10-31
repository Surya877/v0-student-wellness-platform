"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import playSound from "@/lib/sound-utils"

interface AssessmentModalProps {
  category: string
  onComplete: (mood: number) => void
  onClose: () => void
}

const ASSESSMENT_QUESTIONS = [
  {
    question: "How stressed do you feel about this lately?",
    options: ["Not at all", "A little", "Moderately", "Quite a bit", "Extremely"],
  },
  {
    question: "How has this affected your daily activities?",
    options: ["No impact", "Slight impact", "Some impact", "Major impact", "Overwhelming"],
  },
  {
    question: "Do you have support systems in place?",
    options: ["Yes, strong support", "Yes, some support", "Neutral", "Limited support", "No support"],
  },
  {
    question: "How often do you practice stress relief?",
    options: ["Daily", "Several times a week", "Weekly", "Rarely", "Never"],
  },
  {
    question: "What is your current mood?",
    options: ["Very Happy 😁", "Happy 🙂", "Neutral 😐", "A bit sad 🙁", "Very sad 😢"],
  },
]

const STRESS_RECOMMENDATIONS: { [key: string]: string[] } = {
  low: [
    "You're doing great! Keep maintaining your routine.",
    "Consider a light walk or meditation today.",
    "Check in with friends or family for positive vibes.",
  ],
  moderate: [
    "Try a 10-minute guided meditation.",
    "Take short breaks between tasks.",
    "Journal your thoughts to process stress.",
    "Engage in a hobby you enjoy.",
  ],
  high: [
    "Reach out to a counselor or trusted person.",
    "Practice deep breathing exercises.",
    "Take a 20-minute break from screens.",
    "Try progressive muscle relaxation.",
  ],
}

export default function AssessmentModal({ category, onComplete, onClose }: AssessmentModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<number[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [stressLevel, setStressLevel] = useState<"low" | "moderate" | "high" | null>(null)

  const handleStart = () => {
    playSound()
    setHasStarted(true)
  }

  const handleAnswer = (index: number) => {
    playSound()
    const newResponses = [...responses, index]
    setResponses(newResponses)

    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate stress level based on responses
      const avgScore = newResponses.reduce((a, b) => a + b) / newResponses.length
      if (avgScore < 1.5) {
        setStressLevel("low")
      } else if (avgScore < 3) {
        setStressLevel("moderate")
      } else {
        setStressLevel("high")
      }
      setIsFinished(true)
    }
  }

  const handleFinish = () => {
    playSound()
    const avgScore = Math.round(responses.reduce((a, b) => a + b) / responses.length + 1)
    onComplete(Math.min(5, avgScore))
    onClose()
  }

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="wellness-card p-8 max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">{category} Assessment</h2>
          <p className="text-muted-foreground mb-6">
            This quick assessment will help us understand your stress levels and provide personalized suggestions.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Takes about 3-5 minutes • {ASSESSMENT_QUESTIONS.length} questions
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              className="flex-1 wellness-button bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start Assessment
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (isFinished) {
    const recommendations = stressLevel ? STRESS_RECOMMENDATIONS[stressLevel] : []
    const levelColor =
      stressLevel === "low" ? "bg-green-100" : stressLevel === "moderate" ? "bg-yellow-100" : "bg-red-100"
    const levelText =
      stressLevel === "low" ? "Low Stress" : stressLevel === "moderate" ? "Moderate Stress" : "High Stress"

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="wellness-card p-8 max-w-md">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Assessment Complete</h2>
            <p className="text-muted-foreground mb-4">Thank you for sharing your feelings with us.</p>
            <div className={`inline-block px-4 py-2 rounded-full font-semibold ${levelColor} text-foreground mb-4`}>
              {levelText}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-foreground">Recommended Actions:</p>
            {recommendations.map((rec, idx) => (
              <Alert key={idx} className="bg-secondary/20 border-secondary/30">
                <AlertDescription className="text-sm text-foreground">✓ {rec}</AlertDescription>
              </Alert>
            ))}
          </div>

          <Button
            onClick={handleFinish}
            className="w-full wellness-button bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Finish
          </Button>
        </Card>
      </div>
    )
  }

  const question = ASSESSMENT_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="wellness-card p-8 max-w-xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
            </p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-6">{question.question}</h3>

        <div className="grid gap-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="p-4 rounded-lg bg-muted hover:bg-primary/20 text-foreground transition-all border border-transparent hover:border-primary text-left font-medium"
            >
              {option}
            </button>
          ))}
        </div>

        <Button variant="ghost" onClick={onClose} className="w-full text-muted-foreground hover:text-foreground">
          Skip Assessment
        </Button>
      </Card>
    </div>
  )
}
