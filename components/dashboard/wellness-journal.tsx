"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import playSound from "@/lib/sound-utils"

interface JournalEntry {
  id: string
  content: string
  mood: number
  tags: string[]
  date: Date
}

interface WellnessJournalProps {
  onClose?: () => void
}

const MOOD_EMOJIS = ["😢", "🙁", "😐", "🙂", "😁"]
const SUGGESTED_TAGS = ["stress", "happiness", "sleep", "exercise", "school", "friends", "family", "health"]

export default function WellnessJournal({ onClose }: WellnessJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      content: "Had a good day today. Finished my assignments early and went for a walk.",
      mood: 4,
      tags: ["happiness", "exercise"],
      date: new Date(Date.now() - 86400000),
    },
  ])
  const [currentEntry, setCurrentEntry] = useState("")
  const [selectedMood, setSelectedMood] = useState(3)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"write" | "view">("view")

  const handleTagToggle = (tag: string) => {
    playSound()
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSaveEntry = () => {
    if (!currentEntry.trim()) return

    playSound()
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentEntry,
      mood: selectedMood,
      tags: selectedTags,
      date: new Date(),
    }
    setEntries([newEntry, ...entries])
    setCurrentEntry("")
    setSelectedMood(3)
    setSelectedTags([])
    setViewMode("view")
  }

  const handleDeleteEntry = (id: string) => {
    playSound()
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const getMoodColor = (mood: number) => {
    const colors = ["text-red-500", "text-orange-500", "text-yellow-500", "text-green-500", "text-emerald-500"]
    return colors[mood - 1] || colors[2]
  }

  if (viewMode === "write") {
    return (
      <Card className="wellness-card p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-foreground mb-2">New Journal Entry</h3>
          <p className="text-muted-foreground">Express your thoughts and feelings freely.</p>
        </div>

        <textarea
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
          placeholder="What's on your mind today? How are you feeling? What made you smile or worry today?"
          className="w-full p-4 rounded-lg bg-muted text-foreground border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary mb-6"
          rows={8}
        />

        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">How are you feeling?</p>
          <div className="flex justify-between gap-2">
            {MOOD_EMOJIS.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedMood(index + 1)
                  playSound()
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  selectedMood === index + 1
                    ? "bg-primary text-primary-foreground scale-110"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <span className="text-2xl">{emoji}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Add tags (optional)</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                onClick={() => handleTagToggle(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setViewMode("view")
              setCurrentEntry("")
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEntry}
            disabled={!currentEntry.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Entry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="wellness-card p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">My Journal</h3>
          <p className="text-muted-foreground text-sm">{entries.length} entries</p>
        </div>
        <Button
          onClick={() => {
            setViewMode("write")
            playSound()
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          New Entry
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No entries yet. Start your journey today!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-4 border border-border/50 hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xl ${getMoodColor(entry.mood)}`}>{MOOD_EMOJIS[entry.mood - 1]}</span>
                    <span className="text-sm text-muted-foreground">
                      {entry.date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  Delete
                </Button>
              </div>

              <p className="text-foreground text-sm mb-3 line-clamp-3">{entry.content}</p>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {onClose && (
        <Button variant="outline" onClick={onClose} className="w-full mt-6 bg-transparent">
          Close
        </Button>
      )}
    </Card>
  )
}
