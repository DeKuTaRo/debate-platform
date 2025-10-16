"use client";

import { useState } from "react";
import type { VideoTutorial } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Pencil, Trash2, Save, X } from "lucide-react";

interface VideoCardProps {
  video: VideoTutorial;
  isAdmin?: boolean;
  onEdit?: (video: VideoTutorial) => void;
  onDelete?: (video: VideoTutorial) => void;
  onPlay?: (video: VideoTutorial) => void;
}

export function VideoCard({
  video,
  isAdmin,
  onEdit,
  onDelete,
  onPlay,
}: VideoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVideo, setEditedVideo] = useState<VideoTutorial>(video);

  const handleSaveEdit = () => {
    onEdit?.(editedVideo);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-video bg-muted">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="lg"
            className="rounded-full"
            onClick={() => onPlay?.(video)}
          >
            <Play className="mr-2 h-5 w-5" />
            Xem video
          </Button>
        </div>
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        {isEditing ? (
          <input
            className="w-full border rounded p-1"
            value={editedVideo.title}
            onChange={(e) =>
              setEditedVideo({ ...editedVideo, title: e.target.value })
            }
          />
        ) : (
          <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
        )}
        {isEditing ? (
          <textarea
            className="w-full border rounded p-1 mt-2"
            value={editedVideo.description}
            onChange={(e) =>
              setEditedVideo({ ...editedVideo, description: e.target.value })
            }
          />
        ) : (
          video.description && (
            <CardDescription className="line-clamp-2">
              {video.description}
            </CardDescription>
          )
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {video.createdAt.toLocaleDateString("vi-VN")}
          </div>

          {isAdmin && (
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(video)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
