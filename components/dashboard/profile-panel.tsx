"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import playSound from "@/lib/sound-utils"

interface ProfilePanelProps {
  onBack: () => void
}

const WELLNESS_PROGRESS = [
  { week: "W1", score: 65, physical: 70, emotional: 60 },
  { week: "W2", score: 70, physical: 72, emotional: 68 },
  { week: "W3", score: 72, physical: 75, emotional: 69 },
  { week: "W4", score: 78, physical: 80, emotional: 76 },
]

const WELLNESS_RADAR_DATA = [
  { category: "Sleep", value: 75 },
  { category: "Exercise", value: 82 },
  { category: "Nutrition", value: 68 },
  { category: "Mental Health", value: 78 },
  { category: "Social", value: 85 },
  { category: "Stress Level", value: 65 },
]

const ACHIEVEMENTS = [
  { emoji: "🏃", label: "Active Starter", unlocked: true, description: "Complete 5 exercises" },
  { emoji: "😴", label: "Sleep Master", unlocked: true, description: "Maintain 7+ hours sleep" },
  { emoji: "🧘", label: "Zen Mode", unlocked: true, description: "5 meditation sessions" },
  { emoji: "💪", label: "Strength Seeker", unlocked: false, description: "10 strength sessions" },
  { emoji: "📈", label: "Progress Tracker", unlocked: true, description: "Track for 2 weeks" },
  { emoji: "🎯", label: "Goal Achiever", unlocked: false, description: "Achieve all weekly goals" },
]

export default function ProfilePanel({ onBack }: ProfilePanelProps) {
  const [userInfo] = useState(() => {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("relaxUser")
    return stored ? JSON.parse(stored) : null
  })

  const [activeTab, setActiveTab] = useState<"profile" | "analytics" | "achievements">("profile")

  const renderProfileTab = () => (
    <>
      {/* Profile Card */}
      <Card className="wellness-card p-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl flex-shrink-0">
            👤
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">{userInfo?.fullName || "Student"}</h3>
            <p className="text-muted-foreground">{userInfo?.email}</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Gender</p>
                <p className="font-semibold text-foreground capitalize">{userInfo?.gender || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Height</p>
                <p className="font-semibold text-foreground">{userInfo?.height} cm</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Weight</p>
                <p className="font-semibold text-foreground">{userInfo?.weight} kg</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">BMI</p>
                <p className="font-semibold text-foreground">{userInfo?.bmi || "24.5"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">78</p>
            <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-secondary">15</p>
            <p className="text-sm text-muted-foreground mt-1">Days Streak</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-accent">82</p>
            <p className="text-sm text-muted-foreground mt-1">Best Score</p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="wellness-card p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6">Notification Settings</h3>
        <div className="space-y-4">
          {[
            { label: "Daily Reminders", icon: "🔔", enabled: true },
            { label: "Weekly Insights", icon: "📊", enabled: true },
            { label: "Mood Alerts", icon: "😊", enabled: true },
            { label: "Achievement Notifications", icon: "🏆", enabled: false },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              onClick={() => playSound()}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <input type="checkbox" defaultChecked={item.enabled} className="w-5 h-5 cursor-pointer" readOnly />
            </div>
          ))}
        </div>
      </Card>
    </>
  )

  const renderAnalyticsTab = () => (
    <>
      {/* Radar Chart */}
      <Card className="wellness-card p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6">Wellness Dimensions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={WELLNESS_RADAR_DATA}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis dataKey="category" stroke="var(--color-muted-foreground)" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--color-muted-foreground)" />
            <Radar
              name="Wellness Score"
              dataKey="value"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.6}
            />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "none", borderRadius: "8px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Progress Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="wellness-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Overall Wellness Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={WELLNESS_PROGRESS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "none", borderRadius: "8px" }} />
              <Bar dataKey="score" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="wellness-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Physical vs Emotional</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={WELLNESS_PROGRESS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "none", borderRadius: "8px" }} />
              <Legend />
              <Line type="monotone" dataKey="physical" stroke="var(--color-primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="emotional" stroke="var(--color-secondary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="wellness-card p-6 text-center">
          <p className="text-3xl font-bold text-primary mb-2">24</p>
          <p className="text-sm text-muted-foreground">Exercises Done</p>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <p className="text-3xl font-bold text-secondary mb-2">156h</p>
          <p className="text-sm text-muted-foreground">Sleep Tracked</p>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <p className="text-3xl font-bold text-accent mb-2">18</p>
          <p className="text-sm text-muted-foreground">Journal Entries</p>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <p className="text-3xl font-bold text-chart-2 mb-2">+12%</p>
          <p className="text-sm text-muted-foreground">Improvement</p>
        </Card>
      </div>
    </>
  )

  const renderAchievementsTab = () => (
    <Card className="wellness-card p-8">
      <h3 className="text-2xl font-semibold text-foreground mb-6">Achievement Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((achievement, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg text-center border-2 transition-all ${
              achievement.unlocked
                ? "bg-primary/10 border-primary hover:shadow-lg"
                : "bg-muted border-border opacity-50"
            }`}
          >
            <div className={`text-5xl mb-3 ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
              {achievement.emoji}
            </div>
            <p className="font-semibold text-foreground mb-1">{achievement.label}</p>
            <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
            {achievement.unlocked && (
              <Badge variant="default" className="bg-primary hover:bg-primary/90">
                Unlocked
              </Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  )

  return (
    <div className="wellness-section py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">Your Profile & Analytics</h2>
        <Button variant="outline" onClick={onBack} className="border-primary text-primary bg-transparent">
          Back to Home
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-muted rounded-lg p-1 w-fit">
        {["profile", "analytics", "achievements"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any)
              playSound()
            }}
            className={`px-6 py-2 rounded-md font-medium transition-all capitalize ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
        {activeTab === "achievements" && renderAchievementsTab()}
      </div>
    </div>
  )
}
