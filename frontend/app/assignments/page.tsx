import { AssignmentsContent } from "@/components/assignments/assignments-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assignments - ExcelMind CRM",
  description: "View and manage assignments",
}

export default function AssignmentsPage() {
  return (
    <DashboardLayout>
      <AssignmentsContent />
    </DashboardLayout>
  )
}
