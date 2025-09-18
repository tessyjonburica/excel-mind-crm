import { useAuthStore } from "./auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

class ApiClient {
  private getAuthHeaders() {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const isFormData = options.body instanceof FormData

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = "/login"
      }
      throw new Error(`API Error: ${response.status}`)
    }

    const contentLength = response.headers.get("content-length")
    if (response.status === 204 || contentLength === "0") {
      // @ts-expect-error allow void
      return undefined
    }
    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: { email: string; password: string; name: string; role: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Course endpoints
  async getCourses() {
    return this.request("/courses")
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`)
  }

  // Assignment endpoints
  async getAssignments() {
    return this.request("/assignments")
  }

  async submitAssignment(assignmentId: string, data: FormData) {
    return this.request(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: data,
      headers: {
        ...this.getAuthHeaders(),
      },
    })
  }

  async submitAssignmentWithFile(assignmentId: string, data: FormData) {
    return this.request(`/assignments/${assignmentId}/submit/file`, {
      method: "POST",
      body: data,
      headers: {
        ...this.getAuthHeaders(),
      },
    })
  }

  // Transcript endpoint
  async downloadTranscript(studentId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/transcript/${studentId}/pdf`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to download transcript")
    }

    return response.blob()
  }

  // AI endpoints
  async getCourseRecommendations(data: {
    interests: string[]
    currentCourses: string[]
    academicLevel: string
    careerGoals: string[]
  }) {
    return this.request("/ai/recommend", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async generateSyllabus(data: {
    topic: string
    level: string
    duration: number | string
    learningObjectives: string[]
  }) {
    return this.request("/ai/syllabus", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async chatWithAI(message: string) {
    return this.request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }
}

export const apiClient = new ApiClient()
