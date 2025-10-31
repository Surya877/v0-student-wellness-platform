"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import playSound from "@/lib/sound-utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface WellnessChatbotProps {
  userName?: string
}

const BOT_RESPONSES: { [key: string]: string[] } = {
  stress: [
    "I understand stress can be overwhelming. Have you tried taking deep breaths? In through your nose for 4 counts, hold for 4, and out through your mouth for 4.",
    "Stress is a normal part of life. What specifically is causing you stress today? Sometimes talking about it helps.",
    "Remember, you're not alone. Many students experience stress. Would you like to try a quick meditation exercise?",
  ],
  sleep: [
    "Good sleep is crucial for wellness. Try setting a consistent bedtime and reducing screen time an hour before bed.",
    "If you're having trouble sleeping, try our meditation exercises or journaling to clear your mind.",
    "Aim for 7-9 hours of sleep. Would a sleep tracking feature help you monitor your sleep patterns?",
  ],
  exercise: [
    "Regular exercise can boost your mood and reduce stress. Even a 20-minute walk can make a difference!",
    "What type of exercise do you enjoy? I can help you create a routine.",
    "Exercise releases endorphins - the body's natural feel-good chemicals. Start with what feels comfortable for you.",
  ],
  mood: [
    "It's important to acknowledge how you're feeling. Have you talked to someone about it?",
    "Your emotions are valid. Would you like to journal about what you're experiencing?",
    "Taking care of your mental health is just as important as physical health. How can I support you today?",
  ],
  default: [
    "That's an interesting point. How does this relate to your wellbeing?",
    "I'm here to support your wellness journey. What's on your mind?",
    "Thank you for sharing. Is there a specific area of your health you'd like to focus on?",
  ],
}

export default function WellnessChatbot({ userName = "Friend" }: WellnessChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hey ${userName}! I'm your wellness companion. I'm here to listen and support your journey to better health. How are you feeling today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getCategory = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes("stress") || lowerMessage.includes("anxious")) return "stress"
    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired")) return "sleep"
    if (lowerMessage.includes("exercise") || lowerMessage.includes("workout")) return "exercise"
    if (lowerMessage.includes("mood") || lowerMessage.includes("feeling")) return "mood"
    return "default"
  }

  const getBotResponse = (category: string): string => {
    const responses = BOT_RESPONSES[category]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    playSound()

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate bot response delay
    setTimeout(() => {
      const category = getCategory(inputValue)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(category),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
      playSound()
    }, 500)
  }

  return (
    <Card className="wellness-card flex flex-col h-96 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-primary/10 border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Wellness Chatbot</h3>
        <p className="text-xs text-muted-foreground">Here to support your wellbeing journey</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Share how you're feeling..."
          disabled={isLoading}
          className="bg-muted text-foreground border-border"
        />
        <Button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Send
        </Button>
      </form>
    </Card>
  )
}
