import type { DebateTopic } from "./types"
import { mockTopics } from "./mock-data"

const ADMIN_TOPICS_KEY = "admin_debate_topics"
const ADMIN_PASSWORD_KEY = "admin_password"

// Default admin password (in production, this should be handled securely)
const DEFAULT_ADMIN_PASSWORD = "admin123"

export const adminStorageService = {
  // Authentication
  checkPassword: (password: string): boolean => {
    if (typeof window === "undefined") return false
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD
    return password === storedPassword
  },

  setPassword: (newPassword: string) => {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword)
  },

  // Topic management
  getTopics: (): DebateTopic[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(ADMIN_TOPICS_KEY)
    if (!data) {
      // Initialize with mock data
      adminStorageService.setTopics(mockTopics)
      return mockTopics
    }
    return JSON.parse(data).map((topic: any) => ({
      ...topic,
      createdAt: new Date(topic.createdAt),
    }))
  },

  setTopics: (topics: DebateTopic[]) => {
    localStorage.setItem(ADMIN_TOPICS_KEY, JSON.stringify(topics))
  },

  addTopic: (topic: Omit<DebateTopic, "id" | "createdAt">): DebateTopic => {
    const newTopic: DebateTopic = {
      ...topic,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    const topics = adminStorageService.getTopics()
    topics.push(newTopic)
    adminStorageService.setTopics(topics)
    return newTopic
  },

  updateTopic: (id: string, updates: Partial<DebateTopic>) => {
    const topics = adminStorageService.getTopics()
    const index = topics.findIndex((t) => t.id === id)
    if (index !== -1) {
      topics[index] = { ...topics[index], ...updates }
      adminStorageService.setTopics(topics)
    }
  },

  deleteTopic: (id: string) => {
    const topics = adminStorageService.getTopics().filter((t) => t.id !== id)
    adminStorageService.setTopics(topics)
  },
}
