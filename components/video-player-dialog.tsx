"use client"

import type { VideoTutorial } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VideoPlayerDialogProps {
  video: VideoTutorial | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VideoPlayerDialog({ video, open, onOpenChange }: VideoPlayerDialogProps) {
  if (!video) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video src={video.videoUrl} controls className="w-full h-full">
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>

          {video.description && (
            <div className="text-sm text-muted-foreground">
              <p>{video.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
