"use client"

import { useState } from "react"
import LoginPage from "@/components/auth/login-page"
import DashboardHome from "@/components/dashboard/dashboard-home"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <main className="min-h-screen">
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <DashboardHome onLogout={() => setIsLoggedIn(false)} />
      )}
    </main>
  )
}
