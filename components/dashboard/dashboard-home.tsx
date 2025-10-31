"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PhysicalDashboard from "./physical-dashboard"
import EmotionalDashboard from "./emotional-dashboard"
import ProfilePanel from "./profile-panel"
import DailyChecklist from "./daily-checklist"
import playSound from "@/lib/sound-utils"

interface DashboardHomeProps {
  onLogout: () => void
}

export default function DashboardHome({ onLogout }: DashboardHomeProps) {
  const [activeTab, setActiveTab] = useState<"home" | "physical" | "emotional" | "profile">("home")
  const [userInfo] = useState(() => {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("relaxUser")
    return stored ? JSON.parse(stored) : null
  })
  const [showChecklist, setShowChecklist] = useState(false)

  useEffect(() => {
    // Show checklist only on first dashboard view of the day
    const today = new Date().toDateString()
    const lastChecklistShown = localStorage.getItem("lastChecklistShown")

    if (lastChecklistShown !== today) {
      setShowChecklist(true)
      localStorage.setItem("lastChecklistShown", today)
      playSound()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="wellness-section flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">RELAX</div>
          </div>
          <Button variant="ghost" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
            Logout
          </Button>
        </div>
      </header>

      {/* Daily Checklist Modal */}
      {showChecklist && <DailyChecklist onClose={() => setShowChecklist(false)} />}

      {/* Main Content */}
      {activeTab === "home" && (
        <div className="wellness-section py-12 space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-3">Welcome, {userInfo?.fullName || "Student"}</h2>
            <p className="text-lg text-muted-foreground">Choose your wellness path</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Physical Wellbeing Card */}
            <button
              onClick={() => setActiveTab("physical")}
              className="group wellness-card p-8 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Physical Wellbeing</h3>
              <p className="text-muted-foreground">Track your activity, heart rate, sleep, and fitness goals</p>
            </button>

            {/* Emotional Wellbeing Card */}
            <button
              onClick={() => setActiveTab("emotional")}
              className="group wellness-card p-8 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Emotional Wellbeing</h3>
              <p className="text-muted-foreground">Assess stress, mood, and get personalized support</p>
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setShowChecklist(true)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              View Daily Checklist
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("profile")}
              className="border-primary text-primary hover:bg-primary/10"
            >
              View Profile
            </Button>
          </div>
        </div>
      )}

      {activeTab === "physical" && <PhysicalDashboard onBack={() => setActiveTab("home")} />}
      {activeTab === "emotional" && <EmotionalDashboard onBack={() => setActiveTab("home")} />}
      {activeTab === "profile" && <ProfilePanel onBack={() => setActiveTab("home")} />}
    </div>
  )
}
