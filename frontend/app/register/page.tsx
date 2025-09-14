import { AuthForm } from "@/components/auth/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register - ExcelMind CRM",
  description: "Create your ExcelMind CRM account",
}

export default function RegisterPage() {
  return <AuthForm mode="register" />
}
