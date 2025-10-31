"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import playSound from "@/lib/sound-utils"

interface StressExercise {
  title: string
  description: string
  duration: string
  emoji: string
  steps: string[]
}

interface StressBasedExercisesProps {
  stressLevel: "low" | "moderate" | "high"
  onClose: () => void
}

export default function StressBasedExercises({ stressLevel, onClose }: StressBasedExercisesProps) {
  const exercises: Record<string, StressExercise[]> = {
    low: [
      {
        title: "Light Stretching",
        description: "Gentle stretches to relax your muscles",
        duration: "5 mins",
        emoji: "🧘",
        steps: [
          "Sit comfortably and take 3 deep breaths",
          "Gently stretch your neck in all directions",
          "Roll your shoulders backward and forward",
          "Stretch your arms overhead for 10 seconds",
        ],
      },
      {
        title: "Mindful Walking",
        description: "Walk around while focusing on your surroundings",
        duration: "10 mins",
        emoji: "🚶",
        steps: [
          "Find a quiet space to walk",
          "Focus on each step and your breathing",
          "Notice the colors and sounds around you",
          "Walk at a comfortable pace",
        ],
      },
    ],
    moderate: [
      {
        title: "Box Breathing",
        description: "Controlled breathing to calm your nervous system",
        duration: "5 mins",
        emoji: "🌬️",
        steps: [
          "Sit in a comfortable position",
          "Inhale for 4 counts",
          "Hold for 4 counts",
          "Exhale for 4 counts",
          "Repeat 10 times",
        ],
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Tense and relax different muscle groups",
        duration: "15 mins",
        emoji: "💪",
        steps: [
          "Start with your feet - tense for 5 seconds, then relax",
          "Move to your legs and repeat",
          "Continue with abdomen, chest, arms, and face",
          "Breathe slowly throughout",
        ],
      },
      {
        title: "Guided Visualization",
        description: "Imagine a calm and peaceful place",
        duration: "10 mins",
        emoji: "🌅",
        steps: [
          "Close your eyes and relax",
          "Picture your favorite peaceful place",
          "Engage all your senses - what do you see, hear, feel?",
          "Spend time in this place mentally",
        ],
      },
    ],
    high: [
      {
        title: "Intensive Box Breathing",
        description: "Extended breathing exercises for deep relaxation",
        duration: "10 mins",
        emoji: "🌬️",
        steps: [
          "Sit in a comfortable position",
          "Inhale for 6 counts",
          "Hold for 6 counts",
          "Exhale for 6 counts",
          "Repeat 15-20 times",
        ],
      },
      {
        title: "Full Body Relaxation",
        description: "Complete tension release from head to toe",
        duration: "20 mins",
        emoji: "😌",
        steps: [
          "Lie down in a comfortable position",
          "Tense each muscle group for 10 seconds",
          "Release and notice the relaxation",
          "Start from your head and move down to your toes",
          "End with deep, slow breathing",
        ],
      },
      {
        title: "Emotional Release Journaling",
        description: "Write down your feelings without judgment",
        duration: "15 mins",
        emoji: "📝",
        steps: [
          "Get a pen and paper",
          "Write everything you're feeling",
          "Don't worry about grammar or structure",
          "Let your emotions flow freely",
          "Read it back and acknowledge your feelings",
        ],
      },
      {
        title: "Cold Water Therapy",
        description: "Activate your parasympathetic nervous system",
        duration: "5 mins",
        emoji: "❄️",
        steps: [
          "Wash your face with cold water or use a cold compress",
          "Apply cold water to your wrists and neck",
          "Hold ice for 30 seconds in your hands",
          "Practice slow, deep breathing during the process",
        ],
      },
    ],
  }

  const currentExercises = exercises[stressLevel]
  const stressLabels = {
    low: "Low Stress",
    moderate: "Moderate Stress",
    high: "High Stress",
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Stress-Level-Based Coping Exercises</h3>
        <p className="text-muted-foreground">For {stressLabels[stressLevel]}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {currentExercises.map((exercise, idx) => (
          <Card key={idx} className="wellness-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl mb-2">{exercise.emoji}</div>
                <h4 className="text-lg font-semibold text-foreground">{exercise.title}</h4>
                <p className="text-sm text-muted-foreground">{exercise.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {exercise.duration}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">Steps:</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                {exercise.steps.map((step, stepIdx) => (
                  <li key={stepIdx}>{step}</li>
                ))}
              </ol>
            </div>

            <Button
              onClick={() => {
                playSound()
              }}
              variant="outline"
              className="w-full text-xs border-primary text-primary hover:bg-primary/10"
            >
              Start Exercise
            </Button>
          </Card>
        ))}
      </div>

      <Button
        onClick={onClose}
        variant="outline"
        className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
      >
        Close
      </Button>
    </div>
  )
}
