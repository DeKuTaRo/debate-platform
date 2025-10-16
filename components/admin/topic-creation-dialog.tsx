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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, Loader2 } from "lucide-react"
import { adminStorageService } from "@/lib/admin-storage"
import { categoryStorageService } from "@/lib/category-storage"

interface TopicCreationDialogProps {
  onTopicCreated?: () => void
}

export function TopicCreationDialog({ onTopicCreated }: TopicCreationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    imageUrl: "",
  })

  const categories = categoryStorageService.getCategories()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setImagePreview(base64String)
      setFormData({ ...formData, imageUrl: base64String })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      adminStorageService.addTopic({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl || "/debate-topic.jpg",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "",
        imageUrl: "",
      })
      setImagePreview("")

      setOpen(false)
      onTopicCreated?.()
    } catch (error) {
      console.error("Error creating topic:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tạo chủ đề mới</span>
          <span className="sm:hidden">Tạo mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Tạo chủ đề tranh luận mới</DialogTitle>
          <DialogDescription className="text-sm">Nhập thông tin cho chủ đề tranh luận mới của bạn</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề chủ đề..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">
              Danh mục <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Chọn danh mục..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name} className="text-sm">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Mô tả ngắn <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn gọn về chủ đề..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm">
              Nội dung chi tiết <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Nội dung chi tiết về chủ đề tranh luận..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Hình ảnh</Label>
            <div className="space-y-2">
              {imagePreview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex flex-col xs:flex-row gap-2">
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="Hoặc nhập URL hình ảnh..."
                  value={formData.imageUrl && !imagePreview ? formData.imageUrl : ""}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value })
                    setImagePreview("")
                  }}
                  className="text-sm"
                />
                <Button type="button" variant="outline" size="icon" asChild className="shrink-0 bg-transparent">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tải lên hình ảnh hoặc nhập URL. Để trống để sử dụng hình ảnh mặc định.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full xs:w-auto">
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="w-full xs:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo chủ đề
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
