export type UserRole = "student" | "lecturer" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  code: string
  credits: number
  lecturerId: string
  lecturer: User
  enrolledStudents: User[]
  assignments: Assignment[]
  createdAt: string
  updatedAt: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  courseId: string
  course: Course
  submissions: Submission[]
  maxPoints: number
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  assignmentId: string
  assignment: Assignment
  studentId: string
  student: User
  content: string
  fileUrl?: string
  grade?: number
  feedback?: string
  submittedAt: string
  gradedAt?: string
}

export interface Enrollment {
  id: string
  studentId: string
  student: User
  courseId: string
  course: Course
  status: "pending" | "approved" | "rejected"
  enrolledAt: string
  approvedAt?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "grade" | "enrollment" | "assignment" | "general"
  read: boolean
  createdAt: string
}
