"use client"

import { useState, useEffect } from "react"
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
import { FolderOpen, Plus, Trash2, Pencil, X, Check } from "lucide-react"
import { categoryStorageService, type Category } from "@/lib/category-storage"
import { Badge } from "@/components/ui/badge"

export function CategoryManagementDialog() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const loadCategories = () => {
    setCategories(categoryStorageService.getCategories())
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    categoryStorageService.addCategory(newCategoryName.trim())
    setNewCategoryName("")
    loadCategories()
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      categoryStorageService.deleteCategory(id)
      loadCategories()
    }
  }

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const handleSaveEdit = () => {
    if (!editingName.trim() || !editingId) return
    categoryStorageService.updateCategory(editingId, editingName.trim())
    setEditingId(null)
    setEditingName("")
    loadCategories()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <FolderOpen className="h-4 w-4" />
          Quản lý danh mục
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quản lý danh mục</DialogTitle>
          <DialogDescription>Thêm, sửa hoặc xóa các danh mục chủ đề tranh luận</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new category */}
          <div className="space-y-2">
            <Label htmlFor="new-category">Thêm danh mục mới</Label>
            <div className="flex gap-2">
              <Input
                id="new-category"
                placeholder="Nhập tên danh mục..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
              />
              <Button type="button" onClick={handleAddCategory} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-2">
            <Label>Danh sách danh mục ({categories.length})</Label>
            <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-md border p-3">
              {categories.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">Chưa có danh mục nào</p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between gap-2 rounded-md border bg-card p-2"
                  >
                    {editingId === category.id ? (
                      <>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSaveEdit()
                            }
                            if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                          }}
                          className="h-8"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={handleSaveEdit}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Badge variant="secondary" className="text-sm">
                          {category.name}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleStartEdit(category)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
