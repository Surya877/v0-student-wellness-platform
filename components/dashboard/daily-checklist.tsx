"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import playSound from "@/lib/sound-utils"

interface ChecklistItem {
  id: string
  task: string
  emoji: string
  completed: boolean
}

interface DailyChecklistProps {
  onClose: () => void
}

export default function DailyChecklist({ onClose }: DailyChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    // Load today's checklist from localStorage
    const today = new Date().toDateString()
    const storedChecklist = localStorage.getItem(`checklist_${today}`)

    if (storedChecklist) {
      setChecklist(JSON.parse(storedChecklist))
    } else {
      // Initialize with default checklist
      const defaultChecklist: ChecklistItem[] = [
        { id: "1", task: "Drink 8 glasses of water", emoji: "💧", completed: false },
        { id: "2", task: "Exercise for 30 minutes", emoji: "🏃", completed: false },
        { id: "3", task: "Get 7-8 hours of sleep", emoji: "😴", completed: false },
        { id: "4", task: "Practice breathing exercises", emoji: "🌬️", completed: false },
        { id: "5", task: "Journal your thoughts", emoji: "📔", completed: false },
        { id: "6", task: "Meditate for 10 minutes", emoji: "🧘", completed: false },
        { id: "7", task: "Take a 10-minute break", emoji: "☕", completed: false },
        { id: "8", task: "Connect with a friend", emoji: "👥", completed: false },
      ]
      setChecklist(defaultChecklist)
      localStorage.setItem(`checklist_${today}`, JSON.stringify(defaultChecklist))
    }
  }, [])

  useEffect(() => {
    const completed = checklist.filter((item) => item.completed).length
    setCompletedCount(completed)
  }, [checklist])

  const handleToggleTask = (id: string) => {
    playSound()
    const updated = checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    setChecklist(updated)

    // Save updated checklist
    const today = new Date().toDateString()
    localStorage.setItem(`checklist_${today}`, JSON.stringify(updated))
  }

  const progress = Math.round((completedCount / checklist.length) * 100)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Today's Wellness Checklist</h2>
            <p className="text-muted-foreground mt-1">Complete these tasks for a healthier day</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-2xl p-0 h-auto w-auto">
            ✕
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm font-semibold text-primary">
              {completedCount}/{checklist.length} completed
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                item.completed ? "bg-primary/10 border-primary/30" : "bg-muted/50 border-border hover:border-primary/50"
              }`}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => handleToggleTask(item.id)}
                className="h-6 w-6"
              />
              <span className="text-2xl">{item.emoji}</span>
              <span
                className={`flex-1 font-medium ${
                  item.completed ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {item.task}
              </span>
              {item.completed && <span className="text-2xl">✓</span>}
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        {progress === 100 && (
          <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-center">
            <p className="font-semibold text-foreground">Congratulations! You've completed all tasks today!</p>
            <p className="text-sm text-muted-foreground mt-1">Great job taking care of yourself.</p>
          </div>
        )}

        <Button
          onClick={onClose}
          className="w-full wellness-button bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Continue to Dashboard
        </Button>
      </Card>
    </div>
  )
}
