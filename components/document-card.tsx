"use client";

import type { Document } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface DocumentCardProps {
  document: Document;
  isAdmin?: boolean;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

export function DocumentCard({
  document,
  isAdmin,
  onEdit,
  onDelete,
}: DocumentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState<Document>(document);

  const handleSaveEdit = () => {
    onEdit?.(editedDocument);
    setIsEditing(false);
  };

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.title;
    link.click();
  };

  console.log("Rendering DocumentCard for:", document);
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  className="w-full border rounded p-1"
                  value={editedDocument.title}
                  onChange={(e) =>
                    setEditedDocument({
                      ...editedDocument,
                      title: e.target.value,
                    })
                  }
                />
              ) : (
                <CardTitle className="text-lg line-clamp-2">
                  {document.title}
                </CardTitle>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{document.fileType}</Badge>
                {document.fileSize && (
                  <span className="text-xs text-muted-foreground">
                    {document.fileSize}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {document.fileType === "PNG" ||
        document.fileType === "JPG" ||
        document.fileType === "JPEG" ||
        document.fileType === "GIF" ? (
          <img
            src={document.fileUrl}
            alt={document.title}
            className="w-full h-48 object-cover rounded"
          />
        ) : document.fileType === "MP4" || document.fileType === "MOV" ? (
          <video
            src={document.fileUrl}
            controls
            className="w-full h-48 object-cover rounded"
          />
        ) : (
          document.description && (
            <CardDescription className="line-clamp-3">
              {document.description}
            </CardDescription>
          )
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(document.createdAt).toLocaleDateString("vi-VN")}{" "}
          </div>

          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSaveEdit}>
                  Lưu
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="mr-1 h-4 w-4" />
                  Tải xuống
                </Button>
                {isAdmin && (
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
                      onClick={() => onDelete?.(document)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
