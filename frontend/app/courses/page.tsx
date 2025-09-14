import { CoursesContent } from "@/components/courses/courses-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Courses - ExcelMind CRM",
  description: "Browse and manage courses",
}

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <CoursesContent />
    </DashboardLayout>
  )
}
