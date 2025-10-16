"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { DocumentCard } from "@/components/document-card";
import { DocumentUploadDialog } from "@/components/admin/document-upload-dialog";
import { useAdmin } from "@/contexts/admin-context";
import { documentStorageService } from "@/lib/document-storage";
import type { Document } from "@/lib/types";
import { FileText, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
      return;
    }
    loadDocuments();
  }, [isAdmin, router]);

  const loadDocuments = () => {
    setLoading(true);
    setTimeout(() => {
      const loadedDocuments = documentStorageService.getDocuments();
      setDocuments(loadedDocuments);
      setLoading(false);
    }, 300);
  };

  const handleDocumentUploaded = () => {
    loadDocuments();
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.fileType.toLowerCase().includes(query)
    );
  });

  const handleEditDocument = (updatedDocument: Document) => {
    documentStorageService.editDocument(updatedDocument);
    loadDocuments();
  };

  const handleDeleteDocument = (documentId: string) => {
    documentStorageService.deleteDocument(documentId);
    loadDocuments();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
                <FileText className="h-7 w-7 sm:h-8 sm:w-8" />
                Tài liệu tham khảo
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Quản lý tài liệu học tập và tham khảo cho người dùng
              </p>
            </div>
            <DocumentUploadDialog onDocumentUploaded={handleDocumentUploaded} />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center px-4">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-base font-medium">
                  {searchQuery ? "Không tìm thấy tài liệu" : "Chưa có tài liệu"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Thử tìm kiếm với từ khóa khác"
                    : "Thêm tài liệu đầu tiên để bắt đầu"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Hiển thị {filteredDocuments.length} tài liệu
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    isAdmin={isAdmin}
                    onEdit={(doc) => handleEditDocument(doc)}
                    onDelete={(doc) => handleDeleteDocument(doc.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
