import { CourseDetailContent } from "@/components/courses/course-detail-content"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Metadata } from "next"

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Course Details - ExcelMind CRM",
  description: "View course details and syllabus",
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <DashboardLayout>
      <CourseDetailContent courseId={params.id} />
    </DashboardLayout>
  )
}
