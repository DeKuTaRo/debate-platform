"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { ResponseHistoryCard } from "@/components/response-history-card"
import { storageService } from "@/lib/storage"
import { adminStorageService } from "@/lib/admin-storage"
import type { DebateResponse, DebateTopic } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Trash2, Filter, ThumbsUp, ThumbsDown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function HistoryPage() {
  const [responses, setResponses] = useState<DebateResponse[]>([])
  const [topics, setTopics] = useState<DebateTopic[]>([])
  const [filterPosition, setFilterPosition] = useState<"all" | "support" | "oppose">("all")
  const [filterVoice, setFilterVoice] = useState<"all" | "voice" | "text">("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allResponses = storageService.getResponses()
    const allTopics = adminStorageService.getTopics()
    setResponses(allResponses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    setTopics(allTopics)
  }

  const filteredResponses = useMemo(() => {
    let filtered = responses

    if (filterPosition !== "all") {
      filtered = filtered.filter((r) => r.position === filterPosition)
    }

    if (filterVoice === "voice") {
      filtered = filtered.filter((r) => r.isVoice)
    } else if (filterVoice === "text") {
      filtered = filtered.filter((r) => !r.isVoice)
    }

    return filtered
  }, [responses, filterPosition, filterVoice])

  const getTopicById = (topicId: string) => {
    return topics.find((t) => t.id === topicId)
  }

  const handleClearHistory = () => {
    storageService.clearResponses()
    loadData()
  }

  const supportCount = responses.filter((r) => r.position === "support").length
  const opposeCount = responses.filter((r) => r.position === "oppose").length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-3xl font-bold">Lịch sử phản hồi</h1>
            <p className="text-muted-foreground sm:text-base">Xem lại tất cả các phản hồi tranh luận của bạn</p>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-3">
            <div className="rounded-lg border bg-card p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Tổng phản hồi</span>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xl sm:text-2xl font-bold">{responses.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Ủng hộ</span>
                <ThumbsUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-xl sm:text-2xl font-bold text-emerald-600">{supportCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Phản đối</span>
                <ThumbsDown className="h-4 w-4 text-rose-600" />
              </div>
              <p className="mt-2 text-xl sm:text-2xl font-bold text-rose-600">{opposeCount}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bộ lọc:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterPosition} onValueChange={(value: any) => setFilterPosition(value)}>
                <SelectTrigger className="w-full xs:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="support">Ủng hộ</SelectItem>
                  <SelectItem value="oppose">Phản đối</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterVoice} onValueChange={(value: any) => setFilterVoice(value)}>
                <SelectTrigger className="w-full xs:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="voice">Ghi âm</SelectItem>
                  <SelectItem value="text">Văn bản</SelectItem>
                </SelectContent>
              </Select>

              {responses.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full xs:w-auto h-10">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa tất cả
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[95vw] max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg">Xác nhận xóa</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        Bạn có chắc chắn muốn xóa tất cả lịch sử phản hồi? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearHistory} className="w-full sm:w-auto">
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {filteredResponses.length === 0 ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center px-4">
                <MessageSquare className="mx-auto mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                <p className="text-base sm:text-lg font-medium">Chưa có phản hồi nào</p>
                <p className="text-sm text-muted-foreground">
                  {responses.length === 0
                    ? "Hãy tham gia tranh luận để xem lịch sử tại đây"
                    : "Không có phản hồi nào phù hợp với bộ lọc"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Hiển thị {filteredResponses.length} phản hồi</p>
              {filteredResponses.map((response) => (
                <ResponseHistoryCard key={response.id} response={response} topic={getTopicById(response.topicId)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
