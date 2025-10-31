"use client"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import playSound from "@/lib/sound-utils"

interface MoodTrackerProps {
  moodData: Array<{ date: string; mood: number }>
  onMoodSelect: (mood: number) => void
}

const MOOD_EMOJIS = ["😢", "🙁", "😐", "🙂", "😁"]
const MOOD_LABELS = ["Very Sad", "A bit sad", "Neutral", "Happy", "Very Happy"]

export default function MoodTracker({ moodData, onMoodSelect }: MoodTrackerProps) {
  return (
    <div className="wellness-card p-8">
      <h3 className="text-2xl font-semibold text-foreground mb-6">Mood Tracker & Stress Meter</h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Weekly Mood Chart */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">Your mood this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" domain={[0, 5]} />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "none", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="mood" stroke="var(--color-secondary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Selector */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">How are you feeling right now?</p>
          <div className="flex justify-between items-center">
            {MOOD_EMOJIS.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  playSound()
                  onMoodSelect(index + 1)
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
                title={MOOD_LABELS[index]}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs text-muted-foreground">{MOOD_LABELS[index]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stress Meter */}
      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground mb-4">Current Stress Level</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-chart-1 to-accent rounded-full transition-all"
              style={{ width: "45%" }}
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-2xl font-bold text-primary">45%</span>
            <span className="text-sm text-muted-foreground">Moderate</span>
          </div>
        </div>
      </div>
    </div>
  )
}
