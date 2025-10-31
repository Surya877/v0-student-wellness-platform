"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import LoginForm from "./login-form"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [showForm, setShowForm] = useState(true)

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Welcome to RELAX</h1>
          <p className="text-lg text-muted-foreground mb-8">Your Student Wellness Companion</p>
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            className="wellness-button bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Start Now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <LoginForm onSuccess={onLoginSuccess} />
    </div>
  )
}
