"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DebateTopic, DebateResponse } from "@/lib/types"
import { storageService } from "@/lib/storage"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { ThumbsUp, ThumbsDown, Mic, MicOff, Send, MessageSquare, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DebateModalProps {
  topic: DebateTopic | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onResponseAdded?: () => void
}

export function DebateModal({ topic, open, onOpenChange, onResponseAdded }: DebateModalProps) {
  const [position, setPosition] = useState<"support" | "oppose" | null>(null)
  const [content, setContent] = useState("")
  const [responses, setResponses] = useState<DebateResponse[]>([])
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
    useSpeechRecognition()

  useEffect(() => {
    if (topic && open) {
      loadResponses()
    }
  }, [topic, open])

  useEffect(() => {
    if (transcript) {
      setContent((prev) => prev + transcript)
      resetTranscript()
    }
  }, [transcript])

  const loadResponses = () => {
    if (topic) {
      const topicResponses = storageService.getResponsesByTopic(topic.id)
      setResponses(topicResponses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    }
  }

  const handleSubmit = () => {
    if (!topic || !position || !content.trim()) return

    storageService.addResponse({
      topicId: topic.id,
      position,
      content: content.trim(),
      isVoice: isListening,
    })

    setContent("")
    setPosition(null)
    loadResponses()
    onResponseAdded?.()
  }

  const handleClose = () => {
    setPosition(null)
    setContent("")
    if (isListening) {
      stopListening()
    }
    onOpenChange(false)
  }

  const supportCount = responses.filter((r) => r.position === "support").length
  const opposeCount = responses.filter((r) => r.position === "oppose").length

  if (!topic) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-hidden p-0 sm:w-full">
        <DialogHeader className="border-b p-4 pb-3 sm:p-6 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl text-balance leading-tight">{topic.title}</DialogTitle>
          <DialogDescription className="text-sm text-pretty">{topic.description}</DialogDescription>
          <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
            <Badge variant="support" className="text-xs">
              <ThumbsUp className="mr-1 h-3 w-3" />
              Ủng hộ: {supportCount}
            </Badge>
            <Badge variant="oppose" className="text-xs">
              <ThumbsDown className="mr-1 h-3 w-3" />
              Phản đối: {opposeCount}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="respond" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="mx-4 mt-4 sm:mx-6 grid w-auto grid-cols-2">
            <TabsTrigger value="respond" className="text-sm">
              Phản hồi
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              Lịch sử ({responses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="respond" className="flex-1 overflow-auto px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
                <h4 className="mb-2 font-medium text-sm sm:text-base">Nội dung chi tiết:</h4>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">{topic.content}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm">Lựa chọn của bạn *</Label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant={position === "support" ? "default" : "outline"}
                    className={
                      position === "support"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white h-11 sm:h-10"
                        : "border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 h-11 sm:h-10"
                    }
                    onClick={() => setPosition("support")}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Ủng hộ
                  </Button>
                  <Button
                    variant={position === "oppose" ? "default" : "outline"}
                    className={
                      position === "oppose"
                        ? "bg-rose-600 hover:bg-rose-700 text-white h-11 sm:h-10"
                        : "border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 h-11 sm:h-10"
                    }
                    onClick={() => setPosition("oppose")}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
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
                  className="resize-none text-sm"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{content.length} ký tự</p>
                  {isSupported ? (
                    <Button
                      type="button"
                      size="sm"
                      variant={isListening ? "destructive" : "outline"}
                      onClick={isListening ? stopListening : startListening}
                      className="h-9"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" />
                          <span className="hidden xs:inline">Dừng ghi âm</span>
                          <span className="xs:hidden">Dừng</span>
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          <span className="hidden xs:inline">Ghi âm</span>
                          <span className="xs:hidden">Ghi</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">Không hỗ trợ ghi âm</p>
                  )}
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                  </Alert>
                )}
                {isListening && (
                  <Alert>
                    <Mic className="h-4 w-4 animate-pulse" />
                    <AlertDescription className="text-xs sm:text-sm">
                      Đang lắng nghe... Hãy nói rõ ràng bằng tiếng Việt
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-hidden px-4 sm:px-6 pb-4 sm:pb-6">
            <ScrollArea className="h-[350px] sm:h-[400px] pr-2 sm:pr-4">
              {responses.length === 0 ? (
                <div className="flex h-[350px] sm:h-[400px] items-center justify-center text-center">
                  <div>
                    <MessageSquare className="mx-auto mb-2 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Chưa có phản hồi nào</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {responses.map((response) => (
                    <div key={response.id} className="rounded-lg border p-3 sm:p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Badge variant={response.position === "support" ? "support" : "oppose"} className="text-xs">
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
                      <p className="text-xs sm:text-sm text-pretty">{response.content}</p>
                      {response.isVoice && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Mic className="h-3 w-3" />
                          <span>Ghi âm</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t p-4 pt-3 sm:p-6 sm:pt-4 flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto bg-transparent">
            Đóng
          </Button>
          <Button onClick={handleSubmit} disabled={!position || !content.trim()} className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            Gửi phản hồi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
