"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import playSound from "@/lib/sound-utils"

interface LoginFormProps {
  onSuccess: () => void
}

interface FormErrors {
  [key: string]: string
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetPassword, setResetPassword] = useState("")
  const [resetConfirmPassword, setResetConfirmPassword] = useState("")
  const [resetMessage, setResetMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
    bmi: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const calculateBMI = (weight: string, height: string) => {
    if (!weight || !height) return ""
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height) / 100
    return (w / (h * h)).toFixed(1)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email"
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!isLogin && !formData.gender) {
      newErrors.gender = "Gender is required"
    }

    if (!isLogin && !formData.dob) {
      newErrors.dob = "Date of birth is required"
    }

    if (!isLogin && (!formData.height || Number.parseFloat(formData.height) <= 0)) {
      newErrors.height = "Valid height is required"
    }

    if (!isLogin && (!formData.weight || Number.parseFloat(formData.weight) <= 0)) {
      newErrors.weight = "Valid weight is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }

    if (name === "weight" || name === "height") {
      updated.bmi = calculateBMI(updated.weight, updated.height)
    }

    setFormData(updated)
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (!forgotEmail.includes("@")) {
      setResetMessage("Please enter a valid email")
      return
    }

    if (resetPassword.length < 6) {
      setResetMessage("New password must be at least 6 characters")
      return
    }

    if (resetPassword !== resetConfirmPassword) {
      setResetMessage("Passwords do not match")
      return
    }

    const allUsers = JSON.parse(localStorage.getItem("relaxAllUsers") || "[]")
    const userIndex = allUsers.findIndex((u: any) => u.email === forgotEmail)

    if (userIndex === -1) {
      setResetMessage("No account found with this email")
      return
    }

    allUsers[userIndex].password = resetPassword
    localStorage.setItem("relaxAllUsers", JSON.stringify(allUsers))
    playSound()
    setResetMessage("Password reset successfully! You can now login with your new password.")

    setTimeout(() => {
      setShowForgotPassword(false)
      setForgotEmail("")
      setResetPassword("")
      setResetConfirmPassword("")
      setResetMessage("")
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!validateForm()) {
      playSound()
      return
    }

    setIsLoading(true)
    playSound()

    setTimeout(() => {
      if (isLogin) {
        const allUsers = JSON.parse(localStorage.getItem("relaxAllUsers") || "[]")
        const user = allUsers.find((u: any) => u.email === formData.email)

        if (!user || user.password !== formData.password) {
          setLoginError("Invalid email or password. Please check and try again.")
          playSound()
          setIsLoading(false)
          return
        }

        localStorage.setItem("relaxUser", JSON.stringify(user))
      } else {
        const allUsers = JSON.parse(localStorage.getItem("relaxAllUsers") || "[]")

        if (allUsers.some((u: any) => u.email === formData.email)) {
          setLoginError("Email already registered. Please login or use a different email.")
          playSound()
          setIsLoading(false)
          return
        }

        const newUser = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          gender: formData.gender,
          dob: formData.dob,
          height: formData.height,
          weight: formData.weight,
          bmi: formData.bmi,
          registeredAt: new Date().toISOString(),
        }

        allUsers.push(newUser)
        localStorage.setItem("relaxAllUsers", JSON.stringify(allUsers))
        localStorage.setItem("relaxUser", JSON.stringify(newUser))
      }

      setIsLoading(false)
      onSuccess()
    }, 500)
  }

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md">
        <Card className="p-8 space-y-6 bg-card/95 backdrop-blur border-border">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="bg-muted text-foreground border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <Input
                type="password"
                placeholder="••••••"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                required
                className="bg-muted text-foreground border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••"
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                required
                className="bg-muted text-foreground border-border"
              />
            </div>

            {resetMessage && (
              <Alert
                className={`${resetMessage.includes("successfully") ? "bg-green-500/20 border-green-500/30" : "bg-amber-500/20 border-amber-500/30"}`}
              >
                <AlertDescription className="text-sm text-foreground">{resetMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 wellness-button bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Reset Password
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetMessage("")
                  setForgotEmail("")
                  setResetPassword("")
                  setResetConfirmPassword("")
                }}
                className="flex-1 border-border"
              >
                Back
              </Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <Card className="p-8 space-y-6 bg-card/95 backdrop-blur border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">RELAX</h1>
          <p className="text-muted-foreground">Your Student Wellness Companion</p>
        </div>

        <div className="flex gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => {
              setIsLogin(true)
              setErrors({})
              setLoginError("")
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setErrors({})
              setLoginError("")
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              !isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        {loginError && (
          <Alert className="bg-destructive/20 border-destructive/30">
            <AlertDescription className="text-sm text-destructive">{loginError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`bg-muted text-foreground border-border ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`bg-muted text-foreground border-border ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password (Register only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`bg-muted text-foreground border-border ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Full Name (Register only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <Input
                type="text"
                name="fullName"
                placeholder="Your name"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`bg-muted text-foreground border-border ${errors.fullName ? "border-destructive" : ""}`}
              />
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>
          )}

          {/* Register specific fields */}
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={`w-full px-3 py-2 rounded-lg bg-muted text-foreground border text-sm ${
                      errors.gender ? "border-destructive" : "border-border"
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={`bg-muted text-foreground border-border ${errors.dob ? "border-destructive" : ""}`}
                  />
                  {errors.dob && <p className="text-xs text-destructive mt-1">{errors.dob}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Height (cm)</label>
                  <Input
                    type="number"
                    name="height"
                    placeholder="170"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={`bg-muted text-foreground border-border ${errors.height ? "border-destructive" : ""}`}
                  />
                  {errors.height && <p className="text-xs text-destructive mt-1">{errors.height}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                  <Input
                    type="number"
                    name="weight"
                    placeholder="65"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={`bg-muted text-foreground border-border ${errors.weight ? "border-destructive" : ""}`}
                  />
                  {errors.weight && <p className="text-xs text-destructive mt-1">{errors.weight}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">BMI</label>
                  <Input
                    type="text"
                    value={formData.bmi}
                    readOnly
                    placeholder="Auto"
                    disabled={isLoading}
                    className="bg-muted text-foreground border-border opacity-75"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full wellness-button bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            size="lg"
          >
            {isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {isLogin && (
          <button
            onClick={() => setShowForgotPassword(true)}
            className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </button>
        )}

        {isLogin && !showForgotPassword && (
          <Alert className="bg-secondary/20 border-secondary/30">
            <AlertDescription className="text-sm text-foreground">
              Demo: Use any email and password (min 6 characters) to register and continue
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  )
}
