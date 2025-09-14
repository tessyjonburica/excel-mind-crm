import { AIAssistantContent } from "@/components/ai-assistant/ai-assistant-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Assistant - ExcelMind CRM",
  description: "Get AI-powered recommendations and assistance",
}

export default function AIAssistantPage() {
  return (
    <DashboardLayout>
      <AIAssistantContent />
    </DashboardLayout>
  )
}
