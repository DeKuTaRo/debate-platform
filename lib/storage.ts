import type { DebateResponse } from "./types"

const STORAGE_KEY = "debate_responses"

export const storageService = {
  getResponses: (): DebateResponse[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  addResponse: (response: Omit<DebateResponse, "id" | "createdAt">): DebateResponse => {
    const newResponse: DebateResponse = {
      ...response,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    const responses = storageService.getResponses()
    responses.push(newResponse)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses))
    return newResponse
  },

  getResponsesByTopic: (topicId: string): DebateResponse[] => {
    return storageService.getResponses().filter((r) => r.topicId === topicId)
  },

  clearResponses: () => {
    localStorage.removeItem(STORAGE_KEY)
  },
}
