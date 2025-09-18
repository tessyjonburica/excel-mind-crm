"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { FileText, Download, Loader2, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { RoleGuard } from "@/components/auth/role-guard"
import { apiClient } from "@/lib/api"

const syllabusSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required"),
  courseCode: z.string().min(1, "Course code is required"),
  credits: z.number().min(1).max(6),
  duration: z.string().min(1, "Duration is required"),
  level: z.string().min(1, "Level is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  objectives: z.string().min(20, "Learning objectives must be at least 20 characters"),
  topics: z.string().min(20, "Topics must be at least 20 characters"),
  assessmentMethods: z.string().min(10, "Assessment methods must be at least 10 characters"),
})

type SyllabusFormData = z.infer<typeof syllabusSchema>

export function SyllabusGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedSyllabus, setGeneratedSyllabus] = useState<any>(null)
  const { toast } = useToast()

  const form = useForm<SyllabusFormData>({
    resolver: zodResolver(syllabusSchema),
    defaultValues: {
      courseTitle: "",
      courseCode: "",
      credits: 3,
      duration: "",
      level: "",
      description: "",
      objectives: "",
      topics: "",
      assessmentMethods: "",
    },
  })

  const onSubmit = async (data: SyllabusFormData) => {
    setIsLoading(true)

    try {
      // Call the backend AI endpoint
      const response = await apiClient.generateSyllabus({
        topic: data.courseTitle,
        level: data.level,
        duration: data.duration,
        learningObjectives: [data.objectives]
      })

      setGeneratedSyllabus(response)
      toast({
        title: "Syllabus Generated",
        description: "AI has created a comprehensive syllabus based on your specifications.",
      })
    } catch (error) {
      // Fallback to mock syllabus if API fails
      const mockSyllabus = {
        courseInfo: {
          title: data.courseTitle,
          code: data.courseCode,
          credits: data.credits,
          duration: data.duration,
          level: data.level,
          description: data.description,
        },
        learningObjectives: [
          "Understand fundamental concepts and principles of the subject matter",
          "Apply theoretical knowledge to practical problem-solving scenarios",
          "Develop critical thinking and analytical skills",
          "Demonstrate proficiency in relevant tools and methodologies",
          "Communicate effectively about complex topics in the field",
        ],
        weeklySchedule: [
          {
            week: 1,
            topic: "Introduction and Course Overview",
            readings: "Chapter 1: Foundations",
            assignments: "Introductory Survey",
          },
          {
            week: 2,
            topic: "Fundamental Concepts",
            readings: "Chapter 2: Core Principles",
            assignments: "Problem Set 1",
          },
          {
            week: 3,
            topic: "Theoretical Framework",
            readings: "Chapter 3: Theory",
            assignments: "Reading Reflection",
          },
          {
            week: 4,
            topic: "Practical Applications",
            readings: "Chapter 4: Applications",
            assignments: "Lab Exercise 1",
          },
          {
            week: 5,
            topic: "Case Studies",
            readings: "Selected Case Studies",
            assignments: "Case Analysis",
          },
          {
            week: 6,
            topic: "Advanced Topics",
            readings: "Chapter 5: Advanced Concepts",
            assignments: "Problem Set 2",
          },
          {
            week: 7,
            topic: "Midterm Review",
            readings: "Review Materials",
            assignments: "Study Guide",
          },
          {
            week: 8,
            topic: "Midterm Examination",
            readings: "N/A",
            assignments: "Midterm Exam",
          },
        ],
        assessmentBreakdown: [
          { type: "Participation", percentage: 10, description: "Class attendance and engagement" },
          { type: "Assignments", percentage: 30, description: "Problem sets and lab exercises" },
          { type: "Midterm Exam", percentage: 25, description: "Comprehensive midterm examination" },
          { type: "Final Project", percentage: 25, description: "Capstone project with presentation" },
          { type: "Final Exam", percentage: 10, description: "Cumulative final examination" },
        ],
        policies: [
          "Attendance is mandatory and will be tracked",
          "Late submissions will be penalized 10% per day",
          "Academic integrity violations will result in course failure",
          "Students with disabilities should contact the accessibility office",
          "Office hours are available by appointment",
        ],
      }

      setGeneratedSyllabus(mockSyllabus)
      toast({
        title: "Syllabus Generated (Offline Mode)",
        description: "Using offline syllabus generation. Some features may be limited.",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadSyllabus = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Download Started",
      description: "Syllabus PDF is being prepared for download.",
    })
  }

  return (
    <RoleGuard
      allowedRoles={["lecturer", "admin"]}
      fallback={
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
              <p className="text-muted-foreground">
                Syllabus generation is only available for lecturers and administrators.
              </p>
            </div>
          </CardContent>
        </Card>
      }
    >
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>AI Syllabus Generator</span>
              </CardTitle>
              <CardDescription>
                Create comprehensive course syllabi with AI assistance. Provide course details and let AI structure your
                syllabus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input
                      id="courseTitle"
                      placeholder="e.g., Introduction to Data Science"
                      {...form.register("courseTitle")}
                    />
                    {form.formState.errors.courseTitle && (
                      <p className="text-sm text-destructive">{form.formState.errors.courseTitle.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code</Label>
                    <Input id="courseCode" placeholder="e.g., CS301" {...form.register("courseCode")} />
                    {form.formState.errors.courseCode && (
                      <p className="text-sm text-destructive">{form.formState.errors.courseCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      max="6"
                      {...form.register("credits", { valueAsNumber: true })}
                    />
                    {form.formState.errors.credits && (
                      <p className="text-sm text-destructive">{form.formState.errors.credits.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select onValueChange={(value) => form.setValue("duration", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8-weeks">8 Weeks</SelectItem>
                        <SelectItem value="12-weeks">12 Weeks</SelectItem>
                        <SelectItem value="16-weeks">16 Weeks (Semester)</SelectItem>
                        <SelectItem value="10-weeks">10 Weeks (Quarter)</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.duration && (
                      <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Course Level</Label>
                    <Select onValueChange={(value) => form.setValue("level", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="doctoral">Doctoral</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.level && (
                      <p className="text-sm text-destructive">{form.formState.errors.level.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the course content and scope..."
                    className="min-h-[80px]"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">Learning Objectives</Label>
                  <Textarea
                    id="objectives"
                    placeholder="List the key learning objectives and outcomes for students..."
                    className="min-h-[80px]"
                    {...form.register("objectives")}
                  />
                  {form.formState.errors.objectives && (
                    <p className="text-sm text-destructive">{form.formState.errors.objectives.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topics">Main Topics</Label>
                  <Textarea
                    id="topics"
                    placeholder="List the main topics and concepts to be covered in the course..."
                    className="min-h-[80px]"
                    {...form.register("topics")}
                  />
                  {form.formState.errors.topics && (
                    <p className="text-sm text-destructive">{form.formState.errors.topics.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentMethods">Assessment Methods</Label>
                  <Textarea
                    id="assessmentMethods"
                    placeholder="Describe how students will be assessed (exams, projects, assignments, etc.)..."
                    className="min-h-[60px]"
                    {...form.register("assessmentMethods")}
                  />
                  {form.formState.errors.assessmentMethods && (
                    <p className="text-sm text-destructive">{form.formState.errors.assessmentMethods.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Syllabus...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate AI Syllabus
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Syllabus Display */}
        {generatedSyllabus && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Syllabus</CardTitle>
                    <CardDescription>AI-generated comprehensive course syllabus</CardDescription>
                  </div>
                  <Button onClick={downloadSyllabus} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Course Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Title:</span> {generatedSyllabus.courseInfo.title}
                    </div>
                    <div>
                      <span className="font-medium">Code:</span> {generatedSyllabus.courseInfo.code}
                    </div>
                    <div>
                      <span className="font-medium">Credits:</span> {generatedSyllabus.courseInfo.credits}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {generatedSyllabus.courseInfo.duration}
                    </div>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {generatedSyllabus.learningObjectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weekly Schedule */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Weekly Schedule</h3>
                  <div className="space-y-3">
                    {generatedSyllabus.weeklySchedule.map((week: any) => (
                      <div key={week.week} className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">Week {week.week}</Badge>
                          <h4 className="font-medium">{week.topic}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Readings:</span> {week.readings}
                          </div>
                          <div>
                            <span className="font-medium">Assignments:</span> {week.assignments}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Assessment Breakdown</h3>
                  <div className="space-y-2">
                    {generatedSyllabus.assessmentBreakdown.map((assessment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{assessment.type}</p>
                          <p className="text-sm text-muted-foreground">{assessment.description}</p>
                        </div>
                        <Badge variant="secondary">{assessment.percentage}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Policies */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Course Policies</h3>
                  <ul className="space-y-2">
                    {generatedSyllabus.policies.map((policy: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{policy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </RoleGuard>
  )
}
