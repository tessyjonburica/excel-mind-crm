import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - ExcelMind CRM",
  description: "Your ExcelMind CRM dashboard",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
