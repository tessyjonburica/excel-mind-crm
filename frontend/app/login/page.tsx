import { AuthForm } from "@/components/auth/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - ExcelMind CRM",
  description: "Sign in to your ExcelMind CRM account",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
