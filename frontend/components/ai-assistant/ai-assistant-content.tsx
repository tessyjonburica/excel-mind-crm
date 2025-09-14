"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Sparkles, BookOpen, FileText, Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/hooks/use-toast"
import { CourseRecommendationForm } from "./course-recommendation-form"
import { SyllabusGeneratorForm } from "./syllabus-generator-form"

export function AIAssistantContent() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI academic assistant. I can help you with course recommendations, syllabus generation, and answer questions about your academic journey. How can I assist you today?",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = currentMessage.trim()
    setCurrentMessage("")
    setIsLoading(true)

    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      // Simulate AI response - in real app, this would call the backend AI endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const aiResponse = generateAIResponse(userMessage)
      setChatMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
    } catch (error) {
      toast({
        title: "AI Assistant Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("course") && lowerMessage.includes("recommend")) {
      return "Based on your academic profile and interests, I'd recommend exploring courses in Data Science, Machine Learning, or Advanced Statistics. These align well with current industry trends and your mathematical background. Would you like me to provide more specific recommendations based on your current courses?"
    }

    if (lowerMessage.includes("syllabus") || lowerMessage.includes("curriculum")) {
      return "I can help you create a comprehensive syllabus! For effective syllabus design, consider including: learning objectives, weekly topics, assessment methods, required readings, and grading criteria. What subject area are you looking to create a syllabus for?"
    }

    if (lowerMessage.includes("study") && lowerMessage.includes("plan")) {
      return "Here's a personalized study plan strategy: 1) Review your current course load and deadlines, 2) Allocate 2-3 hours per credit hour weekly, 3) Use active recall and spaced repetition, 4) Schedule regular review sessions. Would you like me to create a specific study schedule based on your current courses?"
    }

    if (lowerMessage.includes("grade") || lowerMessage.includes("improve")) {
      return "To improve your academic performance, focus on: consistent attendance, active participation, regular study sessions, seeking help during office hours, and forming study groups. Based on your current grades, I notice you're doing well in mathematics - consider leveraging those strengths in related subjects."
    }

    return "I understand you're asking about academic matters. I can help with course recommendations, study planning, syllabus creation, and academic guidance. Could you be more specific about what you'd like assistance with? For example, you could ask about course selection, study strategies, or academic planning."
  }

  const aiFeatures = [
    {
      icon: BookOpen,
      title: "Course Recommendations",
      description: "Get personalized course suggestions based on your academic profile and career goals",
      action: "Get Recommendations",
    },
    {
      icon: FileText,
      title: "Syllabus Generator",
      description: "Create comprehensive syllabi with learning objectives and structured content",
      action: "Generate Syllabus",
    },
    {
      icon: Brain,
      title: "Study Planning",
      description: "Receive AI-powered study plans and academic scheduling assistance",
      action: "Plan Studies",
    },
    {
      icon: Sparkles,
      title: "Academic Insights",
      description: "Get insights on your academic performance and improvement suggestions",
      action: "View Insights",
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-poppins flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span>AI Assistant</span>
          </h1>
          <p className="text-muted-foreground">Your intelligent academic companion</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Sparkles className="h-3 w-3" />
          <span>Powered by AI</span>
        </Badge>
      </motion.div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="recommendations">Course Recommendations</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* AI Features Overview */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle>AI Features</CardTitle>
                  <CardDescription>Explore what I can help you with</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat Interface */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="h-[500px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Chat with AI</span>
                  </CardTitle>
                  <CardDescription>Ask me anything about your academic journey</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-muted-foreground p-3 rounded-lg flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Ask me about courses, study plans, or academic guidance..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !currentMessage.trim()} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <CourseRecommendationForm />
        </TabsContent>

        <TabsContent value="syllabus">
          <SyllabusGeneratorForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
