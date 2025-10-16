"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from "lucide-react";
import { documentStorageService } from "@/lib/document-storage";

interface DocumentUploadDialogProps {
  onDocumentUploaded?: () => void;
}

export function DocumentUploadDialog({
  onDocumentUploaded,
}: DocumentUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      pdf: "PDF",
      doc: "Word",
      docx: "Word",
      xls: "Excel",
      xlsx: "Excel",
      ppt: "PowerPoint",
      pptx: "PowerPoint",
      txt: "Text",
      zip: "Archive",
      rar: "Archive",
      png: "PNG",
      jpg: "JPG",
      jpeg: "JPEG",
      gif: "GIF",
      mp4: "MP4",
      mov: "MOV",
    };
    return typeMap[ext || ""] || ext?.toUpperCase() || "File";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) return;

    setUploading(true);
    try {
      documentStorageService.addDocument({
        id: crypto.randomUUID(), // Thêm ID duy nhất cho tài liệu
        title,
        description,
        fileUrl,
        fileType: file ? getFileType(file.name) : "File",
        fileSize: file ? formatFileSize(file.size) : undefined,
        createdAt: new Date(), // Thêm ngày tạo
      });

      setTitle("");
      setDescription("");
      setFile(null);
      setFileUrl("");
      setOpen(false);
      onDocumentUploaded?.();
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Thêm tài liệu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm tài liệu tham khảo</DialogTitle>
          <DialogDescription>
            Tải lên tài liệu mới cho người dùng tham khảo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề tài liệu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả nội dung tài liệu"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Tải lên file *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="flex-1"
              />
              {file && <FileText className="h-5 w-5 text-primary" />}
            </div>
            {file && (
              <div className="mt-2">
                {file.type.startsWith("image/") ? (
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={fileUrl}
                    controls
                    className="w-full h-48 object-cover rounded"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Không thể preview file này
                  </p>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Hoặc nhập URL file bên dưới
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-url">URL file</Label>
            <Input
              id="file-url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              disabled={!!file}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={uploading || !title || !fileUrl}>
              {uploading ? "Đang tải..." : "Thêm tài liệu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
