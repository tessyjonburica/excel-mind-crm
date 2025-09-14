"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"

export function LecturerDashboard() {
  const { user } = useAuthStore()

  // Mock data - in real app, this would come from API
  const teachingCourses = [
    { id: "1", title: "Advanced Mathematics", code: "MATH301", students: 45, assignments: 3 },
    { id: "2", title: "Linear Algebra", code: "MATH201", students: 38, assignments: 2 },
    { id: "3", title: "Statistics", code: "STAT101", students: 52, assignments: 4 },
  ]

  const pendingGrading = [
    { id: "1", assignment: "Midterm Exam", course: "MATH301", submissions: 12, total: 45 },
    { id: "2", assignment: "Problem Set 3", course: "MATH201", submissions: 8, total: 38 },
    { id: "3", assignment: "Lab Report", course: "STAT101", submissions: 15, total: 52 },
  ]

  const enrollmentRequests = [
    { id: "1", student: "John Smith", course: "MATH301", date: "2024-01-10" },
    { id: "2", student: "Sarah Johnson", course: "MATH201", date: "2024-01-11" },
    { id: "3", student: "Mike Davis", course: "STAT101", date: "2024-01-12" },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-poppins">Welcome, Professor {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your courses and students</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teaching Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachingCourses.length}</div>
              <p className="text-xs text-muted-foreground">Active this semester</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teachingCourses.reduce((sum, course) => sum + course.students, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingGrading.reduce((sum, item) => sum + item.submissions, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Submissions to grade</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrollment Requests</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollmentRequests.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Teaching Courses */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Teaching Courses</CardTitle>
              <CardDescription>Your current semester courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teachingCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.students} students</p>
                    <p className="text-sm text-muted-foreground">{course.assignments} assignments</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Grading */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Pending Grading</CardTitle>
              <CardDescription>Assignments waiting for your review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingGrading.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.assignment}</p>
                    <p className="text-sm text-muted-foreground">{item.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">
                      {item.submissions}/{item.total}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">submissions</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enrollment Requests */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Requests</CardTitle>
            <CardDescription>Students requesting to join your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrollmentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{request.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.course} • Requested on {request.date}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
