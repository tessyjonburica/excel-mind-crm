"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useWebSocketDemo } from "@/hooks/use-websocket-demo"
import { StudentDashboard } from "./student-dashboard"
import { LecturerDashboard } from "./lecturer-dashboard"
import { AdminDashboard } from "./admin-dashboard"

export function DashboardContent() {
  const { user } = useAuthStore()

  useWebSocketDemo()

  if (!user) return null

  switch (user.role) {
    case "student":
      return <StudentDashboard />
    case "lecturer":
      return <LecturerDashboard />
    case "admin":
      return <AdminDashboard />
    default:
      return <div>Invalid user role</div>
  }
}
