"use client"

import type React from "react"

import type { DebateTopic } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Image from "next/image"

interface DebateCardProps {
  topic: DebateTopic
  onClick: () => void
  responseCount?: number
  isAdmin?: boolean
  onEdit?: (topic: DebateTopic) => void
  onDelete?: (topic: DebateTopic) => void
}

export function DebateCard({ topic, onClick, responseCount = 0, isAdmin = false, onEdit, onDelete }: DebateCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(topic)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(topic)
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      {topic.imageUrl && (
        <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-muted">
          <Image
            src={topic.imageUrl || "/placeholder.svg"}
            alt={topic.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg leading-tight text-balance">{topic.title}</CardTitle>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {topic.category && (
              <Badge variant="secondary" className="text-xs">
                {topic.category}
              </Badge>
            )}
            {isAdmin && (
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 sm:h-8 sm:w-8"
                  onClick={handleEdit}
                  title="Chỉnh sửa"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <CardDescription className="text-sm text-pretty">{topic.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{format(topic.createdAt, "dd/MM/yyyy", { locale: vi })}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{responseCount} phản hồi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
