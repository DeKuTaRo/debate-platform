"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Video } from "lucide-react"
import { videoStorageService } from "@/lib/video-storage"

interface VideoUploadDialogProps {
  onVideoUploaded?: () => void
}

export function VideoUploadDialog({ onVideoUploaded }: VideoUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [duration, setDuration] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !videoUrl) return

    setUploading(true)
    try {
      videoStorageService.saveVideo({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
      })

      setTitle("")
      setDescription("")
      setVideoFile(null)
      setVideoUrl("")
      setThumbnailUrl("")
      setDuration("")
      setOpen(false)
      onVideoUploaded?.()
    } catch (error) {
      console.error("Error uploading video:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Thêm video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm video hướng dẫn</DialogTitle>
          <DialogDescription>Tải lên video hướng dẫn mới cho người dùng</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề video"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả nội dung video"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-file">Tải lên video *</Label>
            <div className="flex items-center gap-2">
              <Input id="video-file" type="file" accept="video/*" onChange={handleVideoFileChange} className="flex-1" />
              {videoFile && <Video className="h-5 w-5 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">Hoặc nhập URL video bên dưới</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-url">URL video</Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              disabled={!!videoFile}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">URL ảnh thumbnail</Label>
            <Input
              id="thumbnail"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Thời lượng</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="VD: 10:30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={uploading || !title || !videoUrl}>
              {uploading ? "Đang tải..." : "Thêm video"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
