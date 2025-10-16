"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, User, Send, ThumbsUp, ThumbsDown, Loader2, Sparkles, RotateCcw } from "lucide-react"
import { adminStorageService } from "@/lib/admin-storage"
import type { DebateTopic } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIDebatePage() {
  const [topics, setTopics] = useState<DebateTopic[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string>("")
  const [customTopic, setCustomTopic] = useState("")
  const [position, setPosition] = useState<"support" | "oppose" | null>(null)
  const [currentMessage, setCurrentMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [debateStarted, setDebateStarted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadedTopics = adminStorageService.getTopics()
    setTopics(loadedTopics)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getTopicTitle = () => {
    if (customTopic) return customTopic
    const topic = topics.find((t) => t.id === selectedTopicId)
    return topic?.title || ""
  }

  const handleStartDebate = async () => {
    if (!position || (!selectedTopicId && !customTopic)) return

    setDebateStarted(true)
    setMessages([])

    const topic = getTopicTitle()
    const oppositePosition = position === "support" ? "phản đối" : "ủng hộ"

    const initialMessage: Message = {
      role: "assistant",
      content: `Xin chào! Tôi sẽ đóng vai trò ${oppositePosition} chủ đề "${topic}". Hãy bắt đầu cuộc tranh luận bằng cách chia sẻ quan điểm của bạn.`,
    }

    setMessages([initialMessage])
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: getTopicTitle(),
          position,
          userMessage: currentMessage,
          conversationHistory: messages,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setDebateStarted(false)
    setMessages([])
    setCurrentMessage("")
    setPosition(null)
    setSelectedTopicId("")
    setCustomTopic("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              Tranh biện với AI
            </h1>
            <p className="text-muted-foreground">
              Luyện tập kỹ năng tranh luận với trí tuệ nhân tạo. AI sẽ đóng vai trò đối lập với bạn.
            </p>
          </div>

          {!debateStarted ? (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label>Chọn chủ đề tranh luận</Label>
                  <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn một chủ đề có sẵn" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="custom-topic">Nhập chủ đề tùy chỉnh</Label>
                  <Input
                    id="custom-topic"
                    placeholder="VD: Công nghệ AI có nên được quản lý chặt chẽ không?"
                    value={customTopic}
                    onChange={(e) => {
                      setCustomTopic(e.target.value)
                      if (e.target.value) setSelectedTopicId("")
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Chọn vị trí của bạn</Label>
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
                  <p className="text-xs text-muted-foreground">
                    AI sẽ tự động đóng vai trò đối lập với vị trí bạn chọn
                  </p>
                </div>

                <Button
                  onClick={handleStartDebate}
                  disabled={!position || (!selectedTopicId && !customTopic)}
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Bắt đầu tranh luận
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Chủ đề: {getTopicTitle()}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={position === "support" ? "support" : "oppose"}>
                          {position === "support" ? (
                            <>
                              <ThumbsUp className="mr-1 h-3 w-3" />
                              Bạn: Ủng hộ
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="mr-1 h-3 w-3" />
                              Bạn: Phản đối
                            </>
                          )}
                        </Badge>
                        <Badge variant={position === "support" ? "oppose" : "support"}>
                          {position === "support" ? (
                            <>
                              <ThumbsDown className="mr-1 h-3 w-3" />
                              AI: Phản đối
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="mr-1 h-3 w-3" />
                              AI: Ủng hộ
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Bắt đầu lại
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                              <Bot className="h-5 w-5 text-primary-foreground" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.role === "user" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Bot className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Nhập lập luận của bạn..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        rows={3}
                        className="resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isLoading}
                        size="icon"
                        className="h-auto"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Nhấn Enter để gửi, Shift + Enter để xuống dòng</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
