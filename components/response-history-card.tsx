"use client"

import type { DebateResponse, DebateTopic } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Mic, Calendar } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ResponseHistoryCardProps {
  response: DebateResponse
  topic?: DebateTopic
}

export function ResponseHistoryCard({ response, topic }: ResponseHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            {topic && <CardTitle className="text-base">{topic.title}</CardTitle>}
            <div className="flex items-center gap-2">
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
              {response.isVoice && (
                <Badge variant="outline">
                  <Mic className="mr-1 h-3 w-3" />
                  Ghi âm
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(response.createdAt, "dd/MM/yyyy", { locale: vi })}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-foreground text-pretty">{response.content}</CardDescription>
      </CardContent>
    </Card>
  )
}
