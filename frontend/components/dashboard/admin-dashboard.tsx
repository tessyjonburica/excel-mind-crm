"use client"

import { motion } from "framer-motion"
import { Users, BookOpen, GraduationCap, BarChart3, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/lib/auth-store"

export function AdminDashboard() {
  const { user } = useAuthStore()

  // Mock data - in real app, this would come from API
  const systemStats = {
    totalUsers: 1247,
    totalCourses: 89,
    totalStudents: 1089,
    totalLecturers: 67,
    pendingEnrollments: 23,
    systemHealth: 98,
  }

  const recentActivity = [
    { type: "enrollment", message: "15 new student enrollments", time: "2 hours ago" },
    { type: "course", message: "3 new courses created", time: "4 hours ago" },
    { type: "user", message: "8 new user registrations", time: "6 hours ago" },
    { type: "system", message: "System backup completed", time: "12 hours ago" },
  ]

  const courseStats = [
    { name: "Computer Science", students: 245, courses: 12, growth: 15 },
    { name: "Mathematics", students: 198, courses: 8, growth: 8 },
    { name: "Physics", students: 167, courses: 6, growth: 12 },
    { name: "Chemistry", students: 134, courses: 5, growth: -3 },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <GraduationCap className="h-4 w-4" />
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      case "system":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold font-poppins">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>
        <Button>Generate Report</Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">+5 new this semester</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">87% of total users</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Statistics */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Department Statistics</CardTitle>
              <CardDescription>Student enrollment by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseStats.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.students} students • {dept.courses} courses
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`h-4 w-4 ${dept.growth > 0 ? "text-green-500" : "text-red-500"}`} />
                      <Badge variant={dept.growth > 0 ? "default" : "destructive"}>
                        {dept.growth > 0 ? "+" : ""}
                        {dept.growth}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(dept.students / 300) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pending Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items requiring administrative attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Enrollment Requests</p>
                  <p className="text-sm text-muted-foreground">{systemStats.pendingEnrollments} pending</p>
                </div>
                <Button size="sm">Review</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Course Approvals</p>
                  <p className="text-sm text-muted-foreground">5 pending</p>
                </div>
                <Button size="sm">Review</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">User Verifications</p>
                  <p className="text-sm text-muted-foreground">8 pending</p>
                </div>
                <Button size="sm">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
