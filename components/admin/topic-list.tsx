"use client"

import type { DebateTopic } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface TopicListProps {
  topics: DebateTopic[]
  onEdit: (topic: DebateTopic) => void
  onDelete: (id: string) => void
}

export function TopicList({ topics, onEdit, onDelete }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Chưa có chủ đề nào. Hãy tạo chủ đề đầu tiên!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Card key={topic.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  {topic.category && <Badge variant="secondary">{topic.category}</Badge>}
                </div>
                <CardDescription>{topic.description}</CardDescription>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(topic.createdAt, "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(topic)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(topic.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {topic.imageUrl && (
            <CardContent>
              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                <img
                  src={topic.imageUrl || "/placeholder.svg"}
                  alt={topic.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
