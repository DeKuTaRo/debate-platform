"use client"

import type { DebateTopic } from "@/lib/types"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { adminStorageService } from "@/lib/admin-storage"

interface DeleteConfirmDialogProps {
  topic: DebateTopic | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTopicDeleted?: () => void
}

export function DeleteConfirmDialog({ topic, open, onOpenChange, onTopicDeleted }: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!topic) return

    setLoading(true)

    try {
      adminStorageService.deleteTopic(topic.id)
      onOpenChange(false)
      onTopicDeleted?.()
    } catch (error) {
      console.error("Error deleting topic:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa chủ đề</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa chủ đề <strong>"{topic?.title}"</strong>? Hành động này không thể hoàn tác và tất
            cả phản hồi liên quan sẽ bị mất.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa chủ đề
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
