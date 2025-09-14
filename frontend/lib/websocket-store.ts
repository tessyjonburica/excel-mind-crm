import { create } from "zustand"
import { io, type Socket } from "socket.io-client"
import type { Notification } from "./types"

interface WebSocketState {
  socket: Socket | null
  isConnected: boolean
  notifications: Notification[]
  connect: (userId: string, token: string) => void
  disconnect: () => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  clearNotifications: () => void
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  notifications: [],

  connect: (userId: string, token: string) => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001", {
      auth: {
        token,
        userId,
      },
      transports: ["websocket"],
    })

    socket.on("connect", () => {
      console.log("WebSocket connected")
      set({ isConnected: true })
    })

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected")
      set({ isConnected: false })
    })

    socket.on("notification", (notification: Notification) => {
      console.log("New notification received:", notification)
      get().addNotification(notification)
    })

    socket.on("grade_updated", (data: any) => {
      const notification: Notification = {
        id: `grade_${Date.now()}`,
        userId: data.studentId,
        title: "Grade Updated",
        message: `Your grade for "${data.assignmentTitle}" has been updated: ${data.grade}/${data.maxPoints}`,
        type: "grade",
        read: false,
        createdAt: new Date().toISOString(),
      }
      get().addNotification(notification)
    })

    socket.on("enrollment_decision", (data: any) => {
      const notification: Notification = {
        id: `enrollment_${Date.now()}`,
        userId: data.studentId,
        title: `Enrollment ${data.status === "approved" ? "Approved" : "Rejected"}`,
        message: `Your enrollment request for "${data.courseTitle}" has been ${data.status}.`,
        type: "enrollment",
        read: false,
        createdAt: new Date().toISOString(),
      }
      get().addNotification(notification)
    })

    socket.on("assignment_reminder", (data: any) => {
      const notification: Notification = {
        id: `assignment_${Date.now()}`,
        userId: data.studentId,
        title: "Assignment Due Soon",
        message: `"${data.assignmentTitle}" is due in ${data.hoursRemaining} hours.`,
        type: "assignment",
        read: false,
        createdAt: new Date().toISOString(),
      }
      get().addNotification(notification)
    })

    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep only latest 50
    }))
  },

  markAsRead: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))
