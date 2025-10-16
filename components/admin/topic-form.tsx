"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DebateTopic } from "@/lib/types"
import { X } from "lucide-react"

interface TopicFormProps {
  topic?: DebateTopic
  onSubmit: (data: Omit<DebateTopic, "id" | "createdAt">) => void
  onCancel: () => void
}

export function TopicForm({ topic, onSubmit, onCancel }: TopicFormProps) {
  const [formData, setFormData] = useState({
    title: topic?.title || "",
    description: topic?.description || "",
    content: topic?.content || "",
    imageUrl: topic?.imageUrl || "",
    category: topic?.category || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề chủ đề *</Label>
        <Input
          id="title"
          required
          placeholder="Nhập tiêu đề chủ đề tranh luận"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả ngắn *</Label>
        <Textarea
          id="description"
          required
          placeholder="Mô tả ngắn gọn về chủ đề"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Nội dung chi tiết *</Label>
        <Textarea
          id="content"
          required
          placeholder="Nội dung chi tiết về chủ đề tranh luận"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Danh mục</Label>
        <Input
          id="category"
          placeholder="Ví dụ: Giáo dục, Công nghệ, Xã hội..."
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL hình ảnh</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
        {formData.imageUrl && (
          <div className="relative mt-2 h-40 w-full overflow-hidden rounded-lg border">
            <img src={formData.imageUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {topic ? "Cập nhật" : "Tạo chủ đề"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Hủy
        </Button>
      </div>
    </form>
  )
}
