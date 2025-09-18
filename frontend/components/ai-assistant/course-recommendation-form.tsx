"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { BookOpen, Target, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { apiClient } from "@/lib/api"

const recommendationSchema = z.object({
  currentMajor: z.string().min(1, "Please select your major"),
  academicLevel: z.string().min(1, "Please select your academic level"),
  interests: z.string().min(10, "Please describe your interests (at least 10 characters)"),
  careerGoals: z.string().min(10, "Please describe your career goals (at least 10 characters)"),
  preferredDifficulty: z.string().min(1, "Please select preferred difficulty"),
  timeCommitment: z.string().min(1, "Please select time commitment"),
})

type RecommendationFormData = z.infer<typeof recommendationSchema>

export function CourseRecommendationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const { toast } = useToast()
  const { user } = useAuthStore()

  const form = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      currentMajor: "",
      academicLevel: "",
      interests: "",
      careerGoals: "",
      preferredDifficulty: "",
      timeCommitment: "",
    },
  })

  const onSubmit = async (data: RecommendationFormData) => {
    setIsLoading(true)

    try {
      // Call the backend AI endpoint
      const response = await apiClient.getCourseRecommendations({
        interests: [data.interests],
        currentCourses: [data.currentMajor],
        academicLevel: data.academicLevel,
        careerGoals: [data.careerGoals]
      })

      setRecommendations(response.recommendations)
      toast({
        title: "Recommendations Generated",
        description: "AI has analyzed your profile and generated personalized course recommendations.",
      })
    } catch (error) {
      // Fallback to mock recommendations if API fails
      const mockRecommendations = [
        {
          id: "1",
          title: "Machine Learning Fundamentals",
          code: "CS401",
          description: "Introduction to machine learning algorithms and applications",
          difficulty: "Intermediate",
          credits: 3,
          prerequisites: ["CS201", "MATH301"],
          relevanceScore: 95,
          reasons: [
            "Aligns with your interest in data science",
            "Strong foundation for AI career goals",
            "Builds on your mathematical background",
          ],
        },
        {
          id: "2",
          title: "Data Visualization",
          code: "CS350",
          description: "Techniques for creating effective data visualizations",
          difficulty: "Intermediate",
          credits: 3,
          prerequisites: ["CS101"],
          relevanceScore: 88,
          reasons: ["Complements data analysis skills", "High demand in industry", "Matches your creative interests"],
        },
        {
          id: "3",
          title: "Statistical Analysis",
          code: "STAT401",
          description: "Advanced statistical methods for data analysis",
          difficulty: "Advanced",
          credits: 4,
          prerequisites: ["STAT101", "MATH201"],
          relevanceScore: 92,
          reasons: ["Essential for data science career", "Strong mathematical foundation", "High industry relevance"],
        },
      ]

      setRecommendations(mockRecommendations)
      toast({
        title: "Recommendations Generated (Offline Mode)",
        description: "Using offline recommendations. Some features may be limited.",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Course Recommendation Form</span>
            </CardTitle>
            <CardDescription>
              Tell us about your academic background and goals to get personalized course recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentMajor">Current Major</Label>
                  <Select onValueChange={(value) => form.setValue("currentMajor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.currentMajor && (
                    <p className="text-sm text-destructive">{form.formState.errors.currentMajor.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicLevel">Academic Level</Label>
                  <Select onValueChange={(value) => form.setValue("academicLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freshman">Freshman</SelectItem>
                      <SelectItem value="sophomore">Sophomore</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.academicLevel && (
                    <p className="text-sm text-destructive">{form.formState.errors.academicLevel.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Academic Interests</Label>
                <Textarea
                  id="interests"
                  placeholder="Describe your academic interests, favorite subjects, and areas you'd like to explore..."
                  className="min-h-[80px]"
                  {...form.register("interests")}
                />
                {form.formState.errors.interests && (
                  <p className="text-sm text-destructive">{form.formState.errors.interests.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="careerGoals">Career Goals</Label>
                <Textarea
                  id="careerGoals"
                  placeholder="Describe your career aspirations and the industry you want to work in..."
                  className="min-h-[80px]"
                  {...form.register("careerGoals")}
                />
                {form.formState.errors.careerGoals && (
                  <p className="text-sm text-destructive">{form.formState.errors.careerGoals.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDifficulty">Preferred Difficulty</Label>
                  <Select onValueChange={(value) => form.setValue("preferredDifficulty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="mixed">Mixed Levels</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.preferredDifficulty && (
                    <p className="text-sm text-destructive">{form.formState.errors.preferredDifficulty.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeCommitment">Time Commitment</Label>
                  <Select onValueChange={(value) => form.setValue("timeCommitment", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time commitment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light (6-9 hours/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (10-15 hours/week)</SelectItem>
                      <SelectItem value="heavy">Heavy (16+ hours/week)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.timeCommitment && (
                    <p className="text-sm text-destructive">{form.formState.errors.timeCommitment.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>AI Recommendations</span>
              </CardTitle>
              <CardDescription>Personalized course recommendations based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{course.code}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                        <Badge variant="outline">{course.relevanceScore}% match</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{course.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Credits: {course.credits}</span>
                      <span>•</span>
                      <span>Prerequisites: {course.prerequisites.join(", ")}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Why this course is recommended:</p>
                      <ul className="space-y-1">
                        {course.reasons.map((reason: string, reasonIndex: number) => (
                          <li key={reasonIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Course Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
