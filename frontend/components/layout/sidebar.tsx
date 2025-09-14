"use client"

import { motion } from "framer-motion"
import { Home, BookOpen, FileText, Users, BarChart3, Brain, GraduationCap, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore()
  const pathname = usePathname()

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["student", "lecturer", "admin"],
    },
    {
      name: "Courses",
      href: "/courses",
      icon: BookOpen,
      roles: ["student", "lecturer", "admin"],
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: FileText,
      roles: ["student", "lecturer"],
    },
    {
      name: "AI Assistant",
      href: "/ai-assistant",
      icon: Brain,
      roles: ["student", "lecturer", "admin"],
    },
    {
      name: "Students",
      href: "/students",
      icon: GraduationCap,
      roles: ["lecturer", "admin"],
    },
    {
      name: "Enrollments",
      href: "/enrollments",
      icon: UserCheck,
      roles: ["admin"],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: ["admin"],
    },
    {
      name: "User Management",
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
  ]

  const filteredItems = navigationItems.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar text-sidebar-foreground md:relative md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-2 px-3">
              {filteredItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href} onClick={onClose}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="text-xs text-muted-foreground">ExcelMind CRM v1.0</div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
