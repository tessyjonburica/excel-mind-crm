"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FileText, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const gradingSchema = z.object({
  grade: z.number().min(0).max(100),
  feedback: z.string().min(1, "Feedback is required"),
})

type GradingFormData = z.infer<typeof gradingSchema>

interface AssignmentGradingDialogProps {
  assignment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignmentGradingDialog({ assignment, open, onOpenChange }: AssignmentGradingDialogProps) {
  const [isGrading, setIsGrading] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(0)
  const { toast } = useToast()

  // Mock submissions data
  const submissions = [
    {
      id: "1",
      student: {
        id: "1",
        name: "John Smith",
        email: "john.smith@student.edu",
        avatar: "/placeholder.svg",
      },
      submittedAt: "2024-01-18T14:30:00",
      content: "I have completed all the calculus problems as requested. Please find my solutions attached.",
      fileUrl: "/submissions/john-smith-ps1.pdf",
      grade: null,
      feedback: null,
      status: "pending",
    },
    {
      id: "2",
      student: {
        id: "2",
        name: "Emily Davis",
        email: "emily.davis@student.edu",
        avatar: "/placeholder.svg",
      },
      submittedAt: "2024-01-19T09:15:00",
      content: "Here is my submission for the problem set. I found problem 3 particularly challenging.",
      fileUrl: "/submissions/emily-davis-ps1.pdf",
      grade: 92,
      feedback: "Excellent work! Very clear explanations.",
      status: "graded",
    },
    {
      id: "3",
      student: {
        id: "3",
        name: "Michael Brown",
        email: "michael.brown@student.edu",
        avatar: "/placeholder.svg",
      },
      submittedAt: "2024-01-20T16:45:00",
      content: "Please review my solutions. I had some difficulty with the integration by parts problems.",
      fileUrl: "/submissions/michael-brown-ps1.pdf",
      grade: null,
      feedback: null,
      status: "pending",
    },
  ]

  const form = useForm<GradingFormData>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      grade: 0,
      feedback: "",
    },
  })

  const currentSubmission = submissions[selectedSubmission]

  const onSubmit = async (data: GradingFormData) => {
    setIsGrading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Grade Submitted",
        description: `Grade for ${currentSubmission.student.name} has been saved.`,
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Grading Failed",
        description: "Failed to submit grade. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGrading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grade Assignment</DialogTitle>
          <DialogDescription>{assignment?.title} - Review and grade student submissions</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="submissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="grading">Grade Current</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            <div className="space-y-2">
              {submissions.map((submission, index) => (
                <div
                  key={submission.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSubmission === index ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedSubmission(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={submission.student.avatar || "/placeholder.svg"}
                          alt={submission.student.name}
                        />
                        <AvatarFallback>{getInitials(submission.student.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{submission.student.name}</p>
                        <p className="text-sm text-muted-foreground">Submitted: {formatDate(submission.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {submission.grade !== null && (
                        <Badge className="bg-green-100 text-green-800">{submission.grade}/100</Badge>
                      )}
                      <Badge variant={submission.status === "graded" ? "default" : "outline"}>
                        {submission.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grading" className="space-y-4">
            {currentSubmission && (
              <div className="space-y-4">
                {/* Student Info */}
                <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                  <Avatar>
                    <AvatarImage
                      src={currentSubmission.student.avatar || "/placeholder.svg"}
                      alt={currentSubmission.student.name}
                    />
                    <AvatarFallback>{getInitials(currentSubmission.student.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentSubmission.student.name}</p>
                    <p className="text-sm text-muted-foreground">{currentSubmission.student.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {formatDate(currentSubmission.submittedAt)}
                    </p>
                  </div>
                </div>

                {/* Submission Content */}
                <div className="space-y-2">
                  <Label>Submission Content</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{currentSubmission.content}</p>
                  </div>
                </div>

                {/* File Download */}
                {currentSubmission.fileUrl && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Submission
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View in Browser
                    </Button>
                  </div>
                )}

                {/* Grading Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade (0-100)</Label>
                      <Input
                        id="grade"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Enter grade"
                        {...form.register("grade", { valueAsNumber: true })}
                      />
                      {form.formState.errors.grade && (
                        <p className="text-sm text-destructive">{form.formState.errors.grade.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Max Points</Label>
                      <Input value={assignment?.maxPoints || 100} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Provide feedback for the student..."
                      className="min-h-[100px]"
                      {...form.register("feedback")}
                    />
                    {form.formState.errors.feedback && (
                      <p className="text-sm text-destructive">{form.formState.errors.feedback.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" disabled={isGrading}>
                      Save Draft
                    </Button>
                    <Button type="submit" disabled={isGrading}>
                      {isGrading ? "Submitting..." : "Submit Grade"}
                    </Button>
                  </div>
                </form>

                {/* Previous Grade/Feedback */}
                {currentSubmission.grade !== null && (
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h4 className="font-medium mb-2">Current Grade</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Grade:</span> {currentSubmission.grade}/100
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Feedback:</span> {currentSubmission.feedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
