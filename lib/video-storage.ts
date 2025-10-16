import type { VideoTutorial } from "./types"

const STORAGE_KEY = "debate_videos"

export const videoStorageService = {
  getVideos(): VideoTutorial[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const videos = JSON.parse(stored)
    return videos.map((v: any) => ({
      ...v,
      createdAt: new Date(v.createdAt),
    }))
  },

  saveVideo(video: Omit<VideoTutorial, "id" | "createdAt">): VideoTutorial {
    const videos = this.getVideos()
    const newVideo: VideoTutorial = {
      ...video,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    videos.push(newVideo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
    return newVideo
  },

  updateVideo(id: string, updates: Partial<VideoTutorial>): void {
    const videos = this.getVideos()
    const index = videos.findIndex((v) => v.id === id)
    if (index !== -1) {
      videos[index] = { ...videos[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
    }
  },

  deleteVideo(id: string): void {
    const videos = this.getVideos()
    const filtered = videos.filter((v) => v.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },
}
