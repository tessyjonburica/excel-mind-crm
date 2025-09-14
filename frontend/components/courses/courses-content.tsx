"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, BookOpen, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/auth-store"
import { RoleGuard } from "@/components/auth/role-guard"
import Link from "next/link"

export function CoursesContent() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  // Mock data - in real app, this would come from API
  const courses = [
    {
      id: "1",
      title: "Advanced Mathematics",
      code: "MATH301",
      description: "Advanced calculus and mathematical analysis for engineering students",
      credits: 4,
      department: "Mathematics",
      lecturer: "Dr. Sarah Johnson",
      enrolledStudents: 45,
      maxStudents: 50,
      schedule: "MWF 10:00-11:00",
      semester: "Spring 2024",
      isEnrolled: true,
    },
    {
      id: "2",
      title: "Computer Science Fundamentals",
      code: "CS101",
      description: "Introduction to programming concepts and computer science principles",
      credits: 3,
      department: "Computer Science",
      lecturer: "Prof. Michael Chen",
      enrolledStudents: 38,
      maxStudents: 40,
      schedule: "TTh 2:00-3:30",
      semester: "Spring 2024",
      isEnrolled: true,
    },
    {
      id: "3",
      title: "Physics Laboratory",
      code: "PHYS201",
      description: "Hands-on laboratory experiments in classical and modern physics",
      credits: 2,
      department: "Physics",
      lecturer: "Dr. Emily Rodriguez",
      enrolledStudents: 28,
      maxStudents: 30,
      schedule: "W 1:00-4:00",
      semester: "Spring 2024",
      isEnrolled: false,
    },
    {
      id: "4",
      title: "Organic Chemistry",
      code: "CHEM301",
      description: "Study of carbon-based compounds and their reactions",
      credits: 4,
      department: "Chemistry",
      lecturer: "Dr. James Wilson",
      enrolledStudents: 32,
      maxStudents: 35,
      schedule: "MWF 9:00-10:00",
      semester: "Spring 2024",
      isEnrolled: false,
    },
    {
      id: "5",
      title: "Linear Algebra",
      code: "MATH201",
      description: "Vector spaces, matrices, and linear transformations",
      credits: 3,
      department: "Mathematics",
      lecturer: "Dr. Sarah Johnson",
      enrolledStudents: 42,
      maxStudents: 45,
      schedule: "TTh 11:00-12:30",
      semester: "Spring 2024",
      isEnrolled: false,
    },
    {
      id: "6",
      title: "Data Structures",
      code: "CS201",
      description: "Advanced data structures and algorithms for efficient programming",
      credits: 3,
      department: "Computer Science",
      lecturer: "Prof. Michael Chen",
      enrolledStudents: 35,
      maxStudents: 40,
      schedule: "MWF 2:00-3:00",
      semester: "Spring 2024",
      isEnrolled: false,
    },
  ]

  const departments = ["all", "Mathematics", "Computer Science", "Physics", "Chemistry"]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment

    return matchesSearch && matchesDepartment
  })

  const getEnrollmentStatus = (course: any) => {
    if (course.isEnrolled) return "enrolled"
    if (course.enrolledStudents >= course.maxStudents) return "full"
    return "available"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enrolled":
        return <Badge className="bg-green-100 text-green-800">Enrolled</Badge>
      case "full":
        return <Badge variant="destructive">Full</Badge>
      case "available":
        return <Badge variant="outline">Available</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-poppins">Courses</h1>
          <p className="text-muted-foreground">Browse and manage your courses</p>
        </div>
        <RoleGuard allowedRoles={["lecturer", "admin"]}>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Course</span>
          </Button>
        </RoleGuard>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, codes, or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={`/courses/${course.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="font-mono text-sm">{course.code}</CardDescription>
                    </div>
                    {getStatusBadge(getEnrollmentStatus(course))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor</span>
                      <span className="font-medium">{course.lecturer}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Credits</span>
                      <span className="font-medium">{course.credits}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Schedule</span>
                      <span className="font-medium">{course.schedule}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>
                        {course.enrolledStudents}/{course.maxStudents}
                      </span>
                    </div>
                    <Badge variant="outline">{course.department}</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  )
}
