"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/auth-store"
import { RoleGuard } from "@/components/auth/role-guard"
import { AssignmentSubmissionDialog } from "./assignment-submission-dialog"
import { AssignmentGradingDialog } from "./assignment-grading-dialog"

export function AssignmentsContent() {
  const { user } = useAuthStore()
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false)
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  // Mock data - in real app, this would come from API
  const assignments = [
    {
      id: "1",
      title: "Calculus Problem Set 1",
      description: "Solve integration problems using various techniques",
      course: { id: "1", title: "Advanced Mathematics", code: "MATH301" },
      dueDate: "2024-01-20T23:59:00",
      maxPoints: 100,
      status: "submitted",
      submittedAt: "2024-01-18T14:30:00",
      grade: 87,
      feedback: "Good work! Minor errors in problem 3.",
      fileUrl: "/assignments/math301-ps1.pdf",
    },
    {
      id: "2",
      title: "Programming Project - Calculator",
      description: "Build a scientific calculator using JavaScript",
      course: { id: "2", title: "Computer Science Fundamentals", code: "CS101" },
      dueDate: "2024-01-25T23:59:00",
      maxPoints: 150,
      status: "pending",
      submittedAt: null,
      grade: null,
      feedback: null,
      fileUrl: null,
    },
    {
      id: "3",
      title: "Lab Report - Pendulum Experiment",
      description: "Analyze pendulum motion and calculate gravitational acceleration",
      course: { id: "3", title: "Physics Laboratory", code: "PHYS201" },
      dueDate: "2024-01-30T23:59:00",
      maxPoints: 75,
      status: "overdue",
      submittedAt: null,
      grade: null,
      feedback: null,
      fileUrl: null,
    },
    {
      id: "4",
      title: "Midterm Exam",
      description: "Comprehensive exam covering chapters 1-5",
      course: { id: "1", title: "Advanced Mathematics", code: "MATH301" },
      dueDate: "2024-02-15T10:00:00",
      maxPoints: 200,
      status: "upcoming",
      submittedAt: null,
      grade: null,
      feedback: null,
      fileUrl: null,
    },
  ]

  // Mock grading assignments for lecturers
  const gradingAssignments = [
    {
      id: "1",
      title: "Calculus Problem Set 1",
      course: { title: "Advanced Mathematics", code: "MATH301" },
      submissions: 12,
      totalStudents: 45,
      dueDate: "2024-01-20T23:59:00",
      pendingGrades: 8,
    },
    {
      id: "2",
      title: "Linear Algebra Quiz",
      course: { title: "Linear Algebra", code: "MATH201" },
      submissions: 25,
      totalStudents: 38,
      dueDate: "2024-01-22T23:59:00",
      pendingGrades: 15,
    },
  ]

  const courses = ["all", "MATH301", "CS101", "PHYS201"]
  const statuses = ["all", "pending", "submitted", "graded", "overdue", "upcoming"]

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesCourse = selectedCourse === "all" || assignment.course.code === selectedCourse
    const matchesStatus = selectedStatus === "all" || assignment.status === selectedStatus
    return matchesCourse && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Graded</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "upcoming":
        return <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
      case "graded":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "pending":
      case "upcoming":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
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

  const handleSubmitAssignment = (assignment: any) => {
    setSelectedAssignment(assignment)
    setSubmissionDialogOpen(true)
  }

  const handleGradeAssignment = (assignment: any) => {
    setSelectedAssignment(assignment)
    setGradingDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-poppins">Assignments</h1>
          <p className="text-muted-foreground">
            {user?.role === "student" ? "View and submit your assignments" : "Manage and grade assignments"}
          </p>
        </div>
        <RoleGuard allowedRoles={["lecturer", "admin"]}>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Assignment</span>
          </Button>
        </RoleGuard>
      </motion.div>

      <RoleGuard
        allowedRoles={["student"]}
        fallback={
          // Lecturer/Admin view
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Tabs defaultValue="grading" className="space-y-4">
              <TabsList>
                <TabsTrigger value="grading">Pending Grading</TabsTrigger>
                <TabsTrigger value="all">All Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="grading" className="space-y-4">
                <div className="grid gap-4">
                  {gradingAssignments.map((assignment, index) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              <CardDescription>
                                {assignment.course.title} ({assignment.course.code})
                              </CardDescription>
                            </div>
                            <Badge variant="destructive">{assignment.pendingGrades} pending</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Due: {formatDate(assignment.dueDate)}</p>
                              <p className="text-sm text-muted-foreground">
                                Submissions: {assignment.submissions}/{assignment.totalStudents}
                              </p>
                            </div>
                            <Button onClick={() => handleGradeAssignment(assignment)}>Grade Submissions</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="flex items-center space-x-4 mb-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course === "all" ? "All Courses" : course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  {filteredAssignments.map((assignment, index) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              <CardDescription>
                                {assignment.course.title} ({assignment.course.code})
                              </CardDescription>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Due: {formatDate(assignment.dueDate)}</p>
                              <p className="text-sm text-muted-foreground">Points: {assignment.maxPoints}</p>
                            </div>
                            <Button variant="outline">View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        }
      >
        {/* Student view */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Filter Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course === "all" ? "All Courses" : course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment Cards */}
          <div className="grid gap-4">
            {filteredAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.course.title} ({assignment.course.code})
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(assignment.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>
                        <p className="font-medium">{formatDate(assignment.dueDate)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Points:</span>
                        <p className="font-medium">{assignment.maxPoints}</p>
                      </div>
                      {assignment.submittedAt && (
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <p className="font-medium">{formatDate(assignment.submittedAt)}</p>
                        </div>
                      )}
                      {assignment.grade !== null && (
                        <div>
                          <span className="text-muted-foreground">Grade:</span>
                          <p className="font-medium">
                            {assignment.grade}/{assignment.maxPoints}
                          </p>
                        </div>
                      )}
                    </div>

                    {assignment.feedback && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Instructor Feedback:</p>
                        <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        {assignment.fileUrl && (
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Submission
                          </Button>
                        )}
                      </div>
                      {(assignment.status === "pending" || assignment.status === "overdue") && (
                        <Button onClick={() => handleSubmitAssignment(assignment)}>
                          {assignment.status === "overdue" ? "Submit Late" : "Submit Assignment"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No assignments found</h3>
              <p className="text-muted-foreground">Try adjusting your filter criteria</p>
            </motion.div>
          )}
        </motion.div>
      </RoleGuard>

      {/* Dialogs */}
      <AssignmentSubmissionDialog
        assignment={selectedAssignment}
        open={submissionDialogOpen}
        onOpenChange={setSubmissionDialogOpen}
      />
      <AssignmentGradingDialog
        assignment={selectedAssignment}
        open={gradingDialogOpen}
        onOpenChange={setGradingDialogOpen}
      />
    </div>
  )
}
