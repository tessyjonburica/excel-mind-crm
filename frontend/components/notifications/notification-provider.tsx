"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useWebSocketStore } from "@/lib/websocket-store"
import { ToastNotification } from "./toast-notification"

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, token, isAuthenticated } = useAuthStore()
  const { connect, disconnect, notifications } = useWebSocketStore()

  useEffect(() => {
    if (isAuthenticated && user && token) {
      connect(user.id, token)
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [isAuthenticated, user, token, connect, disconnect])

  return (
    <>
      {children}
      <ToastNotification />
    </>
  )
}
