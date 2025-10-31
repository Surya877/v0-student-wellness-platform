"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import playSound from "@/lib/sound-utils"

interface PhysicalDashboardProps {
  onBack: () => void
}

const STEPS_DATA = [
  { day: "Mon", steps: 8000 },
  { day: "Tue", steps: 10200 },
  { day: "Wed", steps: 7500 },
  { day: "Thu", steps: 9800 },
  { day: "Fri", steps: 11200 },
  { day: "Sat", steps: 12500 },
  { day: "Sun", steps: 9300 },
]

const SLEEP_DATA = [
  { night: "Mon", hours: 7 },
  { night: "Tue", hours: 6.5 },
  { night: "Wed", hours: 8 },
  { night: "Thu", hours: 7.5 },
  { night: "Fri", hours: 6 },
  { night: "Sat", hours: 9 },
  { night: "Sun", hours: 7.5 },
]

const SLEEP_QUALITY = [
  { name: "Deep", value: 30, fill: "#4c9999" },
  { name: "Light", value: 45, fill: "#a8d5d5" },
  { name: "REM", value: 25, fill: "#d1ecec" },
]

const WATER_DATA = [
  { name: "Consumed", value: 6, fill: "#6ba3c4" },
  { name: "Goal", value: 2, fill: "#c9e4f0" },
]

const EXERCISES = [
  { name: "Walking", emoji: "🚶", duration: 30, unit: "min" },
  { name: "Meditation", emoji: "🧘", duration: 15, unit: "min" },
  { name: "Yoga", emoji: "🧘‍♀️", duration: 20, unit: "min" },
  { name: "Jump Rope", emoji: "🦘", duration: 10, unit: "min" },
  { name: "Push-ups", emoji: "💪", duration: 3, unit: "sets" },
  { name: "Squats", emoji: "🏋️", duration: 3, unit: "sets" },
]

export default function PhysicalDashboard({ onBack }: PhysicalDashboardProps) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])

  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) {
      setTimerActive(false)
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          playSound()
          setTimerActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, timeRemaining])

  const handleExerciseClick = (exercise: (typeof EXERCISES)[0]) => {
    playSound()
    setSelectedExercise(exercise.name)
    setTimeRemaining(exercise.duration * 60) // Convert to seconds
    setTimerActive(true)
  }

  const handleCompleteExercise = () => {
    if (selectedExercise && !completedExercises.includes(selectedExercise)) {
      setCompletedExercises([...completedExercises, selectedExercise])
    }
    setSelectedExercise(null)
    setTimerActive(false)
    playSound()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="wellness-section py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">Physical Wellbeing</h2>
        <Button variant="outline" onClick={onBack} className="border-primary text-primary bg-transparent">
          Back to Home
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="wellness-card p-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">8,450</div>
          <p className="text-sm text-muted-foreground">Steps Today</p>
          <p className="text-xs text-muted-foreground mt-2">84% of daily goal</p>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <div className="text-4xl font-bold text-secondary mb-2">72</div>
          <p className="text-sm text-muted-foreground">Heart Rate (bpm)</p>
          <p className="text-xs text-muted-foreground mt-2">Resting rate</p>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <div className="text-4xl font-bold text-accent mb-2">7.5h</div>
          <p className="text-sm text-muted-foreground">Sleep Last Night</p>
          <p className="text-xs text-muted-foreground mt-2">Good quality</p>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <div className="text-4xl font-bold text-chart-2 mb-2">78</div>
          <p className="text-sm text-muted-foreground">Wellness Score</p>
          <p className="text-xs text-muted-foreground mt-2">Keep it up!</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="wellness-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Daily Steps</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={STEPS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "none", borderRadius: "8px" }} />
              <Line
                type="monotone"
                dataKey="steps"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: "var(--color-primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="wellness-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sleep Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={SLEEP_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="night" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "none", borderRadius: "8px" }} />
              <Bar dataKey="hours" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="wellness-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sleep Quality</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={SLEEP_QUALITY} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                {SLEEP_QUALITY.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="wellness-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Water Intake</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={WATER_DATA} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                {WATER_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Exercises Section */}
      <Card className="wellness-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-foreground">Quick Exercises</h3>
          <span className="text-sm text-muted-foreground">
            Completed: {completedExercises.length}/{EXERCISES.length}
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {EXERCISES.map((exercise) => (
            <button
              key={exercise.name}
              onClick={() => handleExerciseClick(exercise)}
              disabled={completedExercises.includes(exercise.name) && !selectedExercise}
              className={`p-6 rounded-xl transition-all text-left ${
                completedExercises.includes(exercise.name) && selectedExercise !== exercise.name
                  ? "bg-muted/50 opacity-50 cursor-not-allowed"
                  : selectedExercise === exercise.name
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div className="text-4xl mb-3">{exercise.emoji}</div>
              <p className="font-semibold text-foreground">{exercise.name}</p>
              <p className="text-sm text-muted-foreground">
                {exercise.duration} {exercise.unit}
              </p>
              {selectedExercise === exercise.name && timerActive && (
                <div className="mt-4 space-y-2">
                  <div className="text-2xl font-bold text-primary">{formatTime(timeRemaining)}</div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCompleteExercise()
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Done
                  </Button>
                </div>
              )}
              {completedExercises.includes(exercise.name) && (
                <div className="mt-4 text-green-600 font-semibold">✓ Completed</div>
              )}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
