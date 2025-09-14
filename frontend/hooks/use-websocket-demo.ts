"use client"

import { useEffect } from "react"
import { useWebSocketStore } from "@/lib/websocket-store"
import { useAuthStore } from "@/lib/auth-store"

// Demo hook to simulate WebSocket events for testing
export function useWebSocketDemo() {
  const { addNotification } = useWebSocketStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) return

    // Simulate notifications for demo purposes
    const simulateNotifications = () => {
      const notifications = [
        {
          id: `demo_grade_${Date.now()}`,
          userId: user.id,
          title: "Grade Updated",
          message: "Your grade for 'Calculus Problem Set 1' has been updated: 87/100",
          type: "grade" as const,
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: `demo_enrollment_${Date.now() + 1}`,
          userId: user.id,
          title: "Enrollment Approved",
          message: "Your enrollment request for 'Advanced Mathematics' has been approved.",
          type: "enrollment" as const,
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: `demo_assignment_${Date.now() + 2}`,
          userId: user.id,
          title: "Assignment Due Soon",
          message: "Programming Project - Calculator is due in 24 hours.",
          type: "assignment" as const,
          read: false,
          createdAt: new Date().toISOString(),
        },
      ]

      // Add notifications with delays to simulate real-time updates
      notifications.forEach((notification, index) => {
        setTimeout(
          () => {
            addNotification(notification)
          },
          (index + 1) * 3000,
        ) // 3 seconds apart
      })
    }

    // Start demo after 5 seconds
    const demoTimeout = setTimeout(simulateNotifications, 5000)

    return () => {
      clearTimeout(demoTimeout)
    }
  }, [user, addNotification])
}
