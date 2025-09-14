import { useAuthStore } from "./auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

class ApiClient {
  private getAuthHeaders() {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
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
}

export const apiClient = new ApiClient()
