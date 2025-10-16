"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { adminStorageService } from "@/lib/admin-storage"
import { storageService } from "@/lib/storage"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import type { DebateTopic, DebateResponse } from "@/lib/types"
import { ThumbsUp, ThumbsDown, Mic, MicOff, Send, MessageSquare, AlertCircle, ArrowLeft, Calendar } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.id as string

  const [topic, setTopic] = useState<DebateTopic | null>(null)
  const [loading, setLoading] = useState(true)
  const [position, setPosition] = useState<"support" | "oppose" | null>(null)
  const [content, setContent] = useState("")
  const [responses, setResponses] = useState<DebateResponse[]>([])
  const [submitting, setSubmitting] = useState(false)

  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
    useSpeechRecognition()

  useEffect(() => {
    loadTopic()
    loadResponses()
  }, [topicId])

  useEffect(() => {
    if (transcript) {
      setContent((prev) => prev + transcript)
      resetTranscript()
    }
  }, [transcript])

  const loadTopic = () => {
    setLoading(true)
    setTimeout(() => {
      const topics = adminStorageService.getTopics()
      const foundTopic = topics.find((t) => t.id === topicId)
      setTopic(foundTopic || null)
      setLoading(false)
    }, 300)
  }

  const loadResponses = () => {
    const topicResponses = storageService.getResponsesByTopic(topicId)
    setResponses(topicResponses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
  }

  const handleSubmit = async () => {
    if (!topic || !position || !content.trim()) return

    setSubmitting(true)
    try {
      storageService.addResponse({
        topicId: topic.id,
        position,
        content: content.trim(),
        isVoice: isListening,
      })

      setContent("")
      setPosition(null)
      if (isListening) {
        stopListening()
      }
      loadResponses()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center px-4">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Không tìm thấy chủ đề</p>
                <p className="text-sm text-muted-foreground mb-4">Chủ đề này có thể đã bị xóa hoặc không tồn tại</p>
                <Button onClick={() => router.push("/topics")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const supportCount = responses.filter((r) => r.position === "support").length
  const opposeCount = responses.filter((r) => r.position === "oppose").length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button variant="ghost" onClick={() => router.push("/topics")} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="space-y-4">
            {topic.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={topic.imageUrl || "/placeholder.svg"}
                  alt={topic.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {topic.category && <Badge variant="secondary">{topic.category}</Badge>}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {format(topic.createdAt, "dd/MM/yyyy", { locale: vi })}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-balance">{topic.title}</h1>
              <p className="text-lg text-muted-foreground text-pretty">{topic.description}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Badge variant="support" className="text-sm">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Ủng hộ: {supportCount}
                </Badge>
                <Badge variant="oppose" className="text-sm">
                  <ThumbsDown className="mr-1 h-4 w-4" />
                  Phản đối: {opposeCount}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-3 text-xl font-semibold">Nội dung chi tiết</h2>
              <p className="text-sm sm:text-base text-muted-foreground text-pretty leading-relaxed">{topic.content}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Chia sẻ quan điểm của bạn</h2>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm">Lựa chọn của bạn *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant={position === "support" ? "default" : "outline"}
                    className={
                      position === "support"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                        : "border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 h-12"
                    }
                    onClick={() => setPosition("support")}
                  >
                    <ThumbsUp className="mr-2 h-5 w-5" />
                    Ủng hộ
                  </Button>
                  <Button
                    variant={position === "oppose" ? "default" : "outline"}
                    className={
                      position === "oppose"
                        ? "bg-rose-600 hover:bg-rose-700 text-white h-12"
                        : "border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 h-12"
                    }
                    onClick={() => setPosition("oppose")}
                  >
                    <ThumbsDown className="mr-2 h-5 w-5" />
                    Phản đối
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="content" className="text-sm">
                  Lý do của bạn *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Chia sẻ quan điểm và lý do của bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{content.length} ký tự</p>
                  {isSupported ? (
                    <Button
                      type="button"
                      size="sm"
                      variant={isListening ? "destructive" : "outline"}
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" />
                          Dừng ghi âm
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Ghi âm
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}
                {isListening && (
                  <Alert>
                    <Mic className="h-4 w-4 animate-pulse" />
                    <AlertDescription className="text-sm">
                      Đang lắng nghe... Hãy nói rõ ràng bằng tiếng Việt
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!position || !content.trim() || submitting}
                className="w-full sm:w-auto"
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Đang gửi..." : "Gửi phản hồi"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch sử phản hồi ({responses.length})</h2>

            {responses.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center text-center">
                <div>
                  <MessageSquare className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Chưa có phản hồi nào</p>
                  <p className="text-xs text-muted-foreground">Hãy là người đầu tiên chia sẻ quan điểm</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {responses.map((response) => (
                    <div key={response.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Badge variant={response.position === "support" ? "support" : "oppose"}>
                          {response.position === "support" ? (
                            <>
                              <ThumbsUp className="mr-1 h-3 w-3" />
                              Ủng hộ
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="mr-1 h-3 w-3" />
                              Phản đối
                            </>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(response.createdAt, "dd/MM/yyyy HH:mm", { locale: vi })}
                        </span>
                      </div>
                      <p className="text-sm text-pretty leading-relaxed">{response.content}</p>
                      {response.isVoice && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Mic className="h-3 w-3" />
                          <span>Ghi âm</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
