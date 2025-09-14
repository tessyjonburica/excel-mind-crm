"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCircle, FileText, GraduationCap, X } from "lucide-react"
import { useWebSocketStore } from "@/lib/websocket-store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ToastNotification() {
  const { notifications, markAsRead } = useWebSocketStore()
  const { toast } = useToast()

  // Show toast for new notifications
  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.read)
    if (unreadNotifications.length > 0) {
      const latestNotification = unreadNotifications[0]

      // Show toast notification
      toast({
        title: latestNotification.title,
        description: latestNotification.message,
        duration: 5000,
      })

      // Auto-mark as read after showing toast
      setTimeout(() => {
        markAsRead(latestNotification.id)
      }, 1000)
    }
  }, [notifications, toast, markAsRead])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "grade":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "enrollment":
        return <GraduationCap className="h-5 w-5 text-blue-500" />
      case "assignment":
        return <FileText className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const recentUnreadNotifications = notifications.filter((n) => !n.read).slice(0, 3)

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {recentUnreadNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="w-80 shadow-lg border-l-4 border-l-primary bg-card/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 h-6 w-6 p-0"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
