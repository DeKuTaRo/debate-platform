"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { VideoCard } from "@/components/video-card"
import { VideoPlayerDialog } from "@/components/video-player-dialog"
import { VideoUploadDialog } from "@/components/admin/video-upload-dialog"
import { useAdmin } from "@/contexts/admin-context"
import { videoStorageService } from "@/lib/video-storage"
import type { VideoTutorial } from "@/lib/types"
import { BookOpen, Bot, History, ArrowRight, Video } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { isAdmin } = useAdmin()
  const [videos, setVideos] = useState<VideoTutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = () => {
    setLoading(true)
    setTimeout(() => {
      const loadedVideos = videoStorageService.getVideos()
      setVideos(loadedVideos)
      setLoading(false)
    }, 300)
  }

  const handleVideoUploaded = () => {
    loadVideos()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">Nâng cao khả năng tranh biện</h1>
            <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Phát triển kỹ năng tranh luận, tư duy phản biện và giao tiếp hiệu quả thông qua các chủ đề thực tế
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            <Link href="/topics" className="group">
              <div className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors h-full">
                <BookOpen className="h-10 w-10 mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Chủ đề tranh luận</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Khám phá các chủ đề hot và chia sẻ quan điểm của bạn
                </p>
                <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                  Xem thêm <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href="/ai-debate" className="group">
              <div className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors h-full">
                <Bot className="h-10 w-10 mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Tranh biện với AI</h3>
                <p className="text-sm text-muted-foreground mb-4">Luyện tập kỹ năng tranh luận với trí tuệ nhân tạo</p>
                <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                  Bắt đầu <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href="/history" className="group">
              <div className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors h-full">
                <History className="h-10 w-10 mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Lịch sử phản hồi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Xem lại các phản hồi và theo dõi tiến trình của bạn
                </p>
                <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                  Xem lịch sử <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* Video Tutorials Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <Video className="h-6 w-6 sm:h-7 sm:w-7" />
                  Video hướng dẫn
                </h2>
                <p className="text-sm text-muted-foreground">
                  Học cách tranh biện hiệu quả qua các video hướng dẫn chi tiết
                </p>
              </div>
              {isAdmin && <VideoUploadDialog onVideoUploaded={handleVideoUploaded} />}
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center px-4">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-base font-medium">Chưa có video hướng dẫn</p>
                  <p className="text-sm text-muted-foreground">
                    {isAdmin ? "Thêm video đầu tiên để bắt đầu" : "Video sẽ được cập nhật sớm"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} isAdmin={isAdmin} onPlay={setSelectedVideo} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <VideoPlayerDialog
        video={selectedVideo}
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      />

      <footer className="mt-12 sm:mt-16 border-t bg-muted/30 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Nền tảng Tranh Biện. Phát triển kỹ năng tranh luận của bạn.</p>
        </div>
      </footer>
    </div>
  )
}
