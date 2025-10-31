"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AssessmentModal from "./assessment-modal"
import MoodTracker from "./mood-tracker"
import StressBasedExercises from "./stress-based-exercises"
import playSound from "@/lib/sound-utils"

interface EmotionalDashboardProps {
  onBack: () => void
}

const STRESS_CATEGORIES = [
  { name: "Academic Pressure", emoji: "📚", color: "bg-chart-1" },
  { name: "Social Demand", emoji: "👥", color: "bg-chart-2" },
  { name: "Personal Stress", emoji: "💭", color: "bg-chart-3" },
  { name: "Social Media Pressure", emoji: "📱", color: "bg-chart-4" },
]

const COPING_STRATEGIES = [
  { title: "Deep Breathing", description: "Box breathing: inhale for 4, hold for 4, exhale for 4", emoji: "🌬️" },
  { title: "Progressive Relaxation", description: "Relax muscle groups from head to toe", emoji: "😌" },
  { title: "Grounding Technique", description: "Focus on 5 senses: see, hear, feel, smell, taste", emoji: "🌿" },
  { title: "Positive Affirmations", description: "Repeat positive statements to yourself", emoji: "✨" },
]

export default function EmotionalDashboard({ onBack }: EmotionalDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAssessment, setShowAssessment] = useState(false)
  const [journalEntry, setJournalEntry] = useState("")
  const [savedEntries, setSavedEntries] = useState<string[]>([])
  const [moodData, setMoodData] = useState([
    { date: "Mon", mood: 3 },
    { date: "Tue", mood: 4 },
    { date: "Wed", mood: 2 },
    { date: "Thu", mood: 4 },
    { date: "Fri", mood: 5 },
    { date: "Sat", mood: 5 },
    { date: "Sun", mood: 3 },
  ])
  const [stressLevel, setStressLevel] = useState<"low" | "moderate" | "high">("moderate")
  const [showStressExercises, setShowStressExercises] = useState(false)

  const handleCategoryClick = (category: string) => {
    playSound()
    setSelectedCategory(category)
    setShowAssessment(true)
  }

  const handleAssessmentComplete = (mood: number) => {
    playSound()
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" })
    setMoodData([...moodData.slice(1), { date: today, mood }])

    if (mood <= 2) {
      setStressLevel("high")
    } else if (mood === 3) {
      setStressLevel("moderate")
    } else {
      setStressLevel("low")
    }

    setShowAssessment(false)
  }

  const handleSaveEntry = () => {
    if (journalEntry.trim()) {
      playSound()
      setSavedEntries([...savedEntries, `${new Date().toLocaleString()}: ${journalEntry}`])
      setJournalEntry("")
    }
  }

  return (
    <div className="wellness-section py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">Emotional Wellbeing</h2>
        <Button variant="outline" onClick={onBack} className="border-primary text-primary bg-transparent">
          Back to Home
        </Button>
      </div>

      {/* Stress Level Indicator and Exercise Suggestion */}
      <Card className="wellness-card p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Current Stress Level</h3>
            <p className="text-muted-foreground mb-3">
              {stressLevel === "low" && "You're doing great! Keep maintaining your wellness routine."}
              {stressLevel === "moderate" && "You're moderately stressed. Try some coping exercises to feel better."}
              {stressLevel === "high" && "You're experiencing high stress. We have specialized exercises to help."}
            </p>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  stressLevel === "low"
                    ? "bg-green-500/20 text-green-700"
                    : stressLevel === "moderate"
                      ? "bg-amber-500/20 text-amber-700"
                      : "bg-red-500/20 text-red-700"
                }`}
              >
                {stressLevel === "low" ? "Low" : stressLevel === "moderate" ? "Moderate" : "High"}
              </span>
            </div>
          </div>
          <Button
            onClick={() => {
              playSound()
              setShowStressExercises(true)
            }}
            className="wellness-button bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            View Exercises for {stressLevel === "low" ? "Low" : stressLevel === "moderate" ? "Moderate" : "High"} Stress
          </Button>
        </div>
      </Card>

      {/* Stress-Based Exercises Modal */}
      {showStressExercises && (
        <Card className="wellness-card p-8 space-y-6">
          <StressBasedExercises stressLevel={stressLevel} onClose={() => setShowStressExercises(false)} />
        </Card>
      )}

      {/* Stress Assessment */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Stress Assessment by Category</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {STRESS_CATEGORIES.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="wellness-card p-8 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{category.emoji}</div>
              <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
              <p className="text-muted-foreground text-sm">Take assessment</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Tracker */}
      <MoodTracker moodData={moodData} onMoodSelect={handleAssessmentComplete} />

      {/* Coping Strategies */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Quick Coping Strategies</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {COPING_STRATEGIES.map((strategy) => (
            <Card key={strategy.title} className="wellness-card p-6">
              <div className="text-4xl mb-3">{strategy.emoji}</div>
              <h4 className="font-semibold text-foreground mb-2">{strategy.title}</h4>
              <p className="text-sm text-muted-foreground">{strategy.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Journal Section */}
      <Card className="wellness-card p-8">
        <h3 className="text-2xl font-semibold text-foreground mb-4">Daily Journal</h3>
        <p className="text-muted-foreground mb-4">What's on your mind today? Write freely without judgment.</p>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Express yourself freely..."
          className="w-full p-4 rounded-lg bg-muted text-foreground border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={6}
        />
        <Button
          onClick={handleSaveEntry}
          disabled={!journalEntry.trim()}
          className="mt-4 wellness-button bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          Save Entry
        </Button>

        {/* Recent Entries */}
        {savedEntries.length > 0 && (
          <div className="mt-8 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Recent Entries</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {savedEntries.map((entry, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg text-sm text-foreground">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Assessment Modal */}
      {showAssessment && (
        <AssessmentModal
          category={selectedCategory || "General"}
          onComplete={handleAssessmentComplete}
          onClose={() => setShowAssessment(false)}
        />
      )}
    </div>
  )
}
