export interface DebateTopic {
  id: string
  title: string
  description: string
  content: string
  imageUrl?: string
  createdAt: Date
  category?: string
}

export interface DebateResponse {
  id: string
  topicId: string
  position: "support" | "oppose"
  content: string
  createdAt: Date
  isVoice?: boolean
}

export interface VideoTutorial {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  createdAt: Date
  duration?: string
}

export interface Document {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize?: string
  createdAt: Date
}

export type SortOption = "newest" | "oldest"
export type FilterYear = number | "all"
export type FilterCategory = string | "all"
