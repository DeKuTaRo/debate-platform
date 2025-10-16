"use client"

import type React from "react"
import type { DebateTopic } from "@/lib/types"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"
import { adminStorageService } from "@/lib/admin-storage"
import { categoryStorageService } from "@/lib/category-storage"

interface TopicEditDialogProps {
  topic: DebateTopic | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTopicUpdated?: () => void
}

export function TopicEditDialog({ topic, open, onOpenChange, onTopicUpdated }: TopicEditDialogProps) {
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

  // Update form data when topic changes
  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title,
        description: topic.description,
        content: topic.content,
        category: topic.category || "",
        imageUrl: topic.imageUrl || "",
      })
      setImagePreview(topic.imageUrl || "")
    }
  }, [topic])

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
    if (!topic) return

    setLoading(true)

    try {
      adminStorageService.updateTopic(topic.id, {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl || "/debate-topic.jpg",
      })

      onOpenChange(false)
      onTopicUpdated?.()
    } catch (error) {
      console.error("Error updating topic:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chủ đề</DialogTitle>
          <DialogDescription>Cập nhật thông tin cho chủ đề tranh luận</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              placeholder="Nhập tiêu đề chủ đề..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">
              Danh mục <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">
              Mô tả ngắn <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-description"
              placeholder="Mô tả ngắn gọn về chủ đề..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">
              Nội dung chi tiết <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-content"
              placeholder="Nội dung chi tiết về chủ đề tranh luận..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <div className="space-y-2">
              {imagePreview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  id="edit-imageUrl"
                  type="url"
                  placeholder="Hoặc nhập URL hình ảnh..."
                  value={formData.imageUrl && !imagePreview ? formData.imageUrl : ""}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value })
                    setImagePreview("")
                  }}
                />
                <Button type="button" variant="outline" size="icon" asChild>
                  <label htmlFor="edit-image-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <input
                      id="edit-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Tải lên hình ảnh mới hoặc nhập URL để thay đổi.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
