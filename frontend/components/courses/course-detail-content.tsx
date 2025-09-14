"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Users, Clock, Calendar, FileText, UserPlus, UserMinus, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth-store"
import { RoleGuard } from "@/components/auth/role-guard"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface CourseDetailContentProps {
  courseId: string
}

export function CourseDetailContent({ courseId }: CourseDetailContentProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isEnrolled, setIsEnrolled] = useState(true) // Mock state

  // Mock data - in real app, this would come from API
  const course = {
    id: courseId,
    title: "Advanced Mathematics",
    code: "MATH301",
    description:
      "This course covers advanced topics in calculus, differential equations, and mathematical analysis. Students will develop strong analytical skills and learn to apply mathematical concepts to solve complex engineering problems.",
    credits: 4,
    department: "Mathematics",
    lecturer: {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      avatar: "/placeholder.svg",
      bio: "Dr. Johnson has over 15 years of experience teaching mathematics and has published numerous papers in applied mathematics.",
    },
    enrolledStudents: 45,
    maxStudents: 50,
    schedule: "MWF 10:00-11:00",
    location: "Math Building, Room 201",
    semester: "Spring 2024",
    prerequisites: ["MATH201 - Linear Algebra", "MATH101 - Calculus I"],
    learningObjectives: [
      "Master advanced calculus techniques and applications",
      "Solve complex differential equations",
      "Apply mathematical analysis to real-world problems",
      "Develop critical thinking and problem-solving skills",
    ],
    syllabus: [
      { week: 1, topic: "Review of Calculus Fundamentals", readings: "Chapter 1-2" },
      { week: 2, topic: "Advanced Integration Techniques", readings: "Chapter 3" },
      { week: 3, topic: "Differential Equations - First Order", readings: "Chapter 4" },
      { week: 4, topic: "Differential Equations - Higher Order", readings: "Chapter 5" },
      { week: 5, topic: "Series and Sequences", readings: "Chapter 6" },
      { week: 6, topic: "Fourier Analysis", readings: "Chapter 7" },
      { week: 7, topic: "Midterm Examination", readings: "Review Chapters 1-7" },
      { week: 8, topic: "Vector Calculus", readings: "Chapter 8" },
    ],
    assignments: [
      { id: "1", title: "Problem Set 1", dueDate: "2024-01-20", points: 100 },
      { id: "2", title: "Midterm Exam", dueDate: "2024-02-15", points: 200 },
      { id: "3", title: "Problem Set 2", dueDate: "2024-03-01", points: 100 },
      { id: "4", title: "Final Project", dueDate: "2024-04-15", points: 200 },
    ],
    enrolledStudentsList: [
      { id: "1", name: "John Smith", email: "john.smith@student.edu", avatar: "/placeholder.svg" },
      { id: "2", name: "Emily Davis", email: "emily.davis@student.edu", avatar: "/placeholder.svg" },
      { id: "3", name: "Michael Brown", email: "michael.brown@student.edu", avatar: "/placeholder.svg" },
      { id: "4", name: "Sarah Wilson", email: "sarah.wilson@student.edu", avatar: "/placeholder.svg" },
    ],
  }

  const handleEnrollment = () => {
    if (isEnrolled) {
      setIsEnrolled(false)
      toast({
        title: "Unenrolled Successfully",
        description: `You have been unenrolled from ${course.title}`,
      })
    } else {
      setIsEnrolled(true)
      toast({
        title: "Enrolled Successfully",
        description: `You have been enrolled in ${course.title}`,
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/courses">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-poppins">{course.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span className="font-mono">{course.code}</span>
              <span>•</span>
              <span>{course.credits} Credits</span>
              <span>•</span>
              <span>{course.semester}</span>
            </div>
            <Badge variant="outline">{course.department}</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <RoleGuard allowedRoles={["lecturer", "admin"]}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
            </RoleGuard>

            <RoleGuard allowedRoles={["student"]}>
              <Button onClick={handleEnrollment} variant={isEnrolled ? "destructive" : "default"}>
                {isEnrolled ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Unenroll
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Enroll
                  </>
                )}
              </Button>
            </RoleGuard>
          </div>
        </div>
      </motion.div>

      {/* Course Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrollment</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {course.enrolledStudents}/{course.maxStudents}
              </div>
              <p className="text-xs text-muted-foreground">Students enrolled</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Schedule</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{course.schedule}</div>
              <p className="text-xs text-muted-foreground">{course.location}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{course.assignments.length}</div>
              <p className="text-xs text-muted-foreground">Total assignments</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {course.assignments.reduce((sum, assignment) => sum + assignment.points, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Available points</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Course Details Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={course.lecturer.avatar || "/placeholder.svg"} alt={course.lecturer.name} />
                      <AvatarFallback>{getInitials(course.lecturer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-medium">{course.lecturer.name}</p>
                      <p className="text-sm text-muted-foreground">{course.lecturer.email}</p>
                      <p className="text-sm text-muted-foreground">{course.lecturer.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <span className="text-sm">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="syllabus">
            <Card>
              <CardHeader>
                <CardTitle>Course Syllabus</CardTitle>
                <CardDescription>Weekly topics and reading assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.syllabus.map((week) => (
                    <div key={week.week} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {week.week}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{week.topic}</h4>
                        <p className="text-sm text-muted-foreground">{week.readings}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Course Assignments</CardTitle>
                <CardDescription>All assignments and their due dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {assignment.dueDate}</span>
                          </div>
                          <span>•</span>
                          <span>{assignment.points} points</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <RoleGuard
              allowedRoles={["lecturer", "admin"]}
              fallback={
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">You don't have permission to view the student list.</p>
                  </CardContent>
                </Card>
              }
            >
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Students</CardTitle>
                  <CardDescription>Students currently enrolled in this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.enrolledStudentsList.map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </RoleGuard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
