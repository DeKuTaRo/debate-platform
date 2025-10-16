"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SearchFilters } from "@/components/search-filters"
import { DebateCard } from "@/components/debate-card"
import { TopicEditDialog } from "@/components/admin/topic-edit-dialog"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { useAdmin } from "@/contexts/admin-context"
import { adminStorageService } from "@/lib/admin-storage"
import { storageService } from "@/lib/storage"
import type { DebateTopic, SortOption, FilterYear, FilterCategory } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function TopicsPage() {
  const { isAdmin } = useAdmin()
  const router = useRouter()

  const [topics, setTopics] = useState<DebateTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterYear, setFilterYear] = useState<FilterYear>(new Date().getFullYear())
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const [editingTopic, setEditingTopic] = useState<DebateTopic | null>(null)
  const [deletingTopic, setDeletingTopic] = useState<DebateTopic | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = () => {
    setLoading(true)
    setTimeout(() => {
      const loadedTopics = adminStorageService.getTopics()
      setTopics(loadedTopics)
      setLoading(false)
    }, 500)
  }

  const handleTopicCreated = () => {
    loadTopics()
  }

  const handleEditTopic = (topic: DebateTopic) => {
    setEditingTopic(topic)
    setEditDialogOpen(true)
  }

  const handleDeleteTopic = (topic: DebateTopic) => {
    setDeletingTopic(topic)
    setDeleteDialogOpen(true)
  }

  const handleTopicUpdated = () => {
    loadTopics()
    setRefreshKey((prev) => prev + 1)
  }

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = topics.map((topic) => topic.createdAt.getFullYear())
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a)
    return uniqueYears.filter((year) => year >= 2025)
  }, [topics])

  const availableCategories = useMemo(() => {
    const categories = topics.map((topic) => topic.category).filter((cat): cat is string => !!cat)
    return Array.from(new Set(categories)).sort()
  }, [topics])

  const filteredAndSortedTopics = useMemo(() => {
    let filtered = topics

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.description.toLowerCase().includes(query) ||
          topic.category?.toLowerCase().includes(query),
      )
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((topic) => topic.category === filterCategory)
    }

    if (filterYear !== "all") {
      filtered = filtered.filter((topic) => topic.createdAt.getFullYear() === filterYear)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
    })

    return sorted
  }, [topics, searchQuery, sortBy, filterYear, filterCategory])

  const getResponseCount = (topicId: string) => {
    return storageService.getResponsesByTopic(topicId).length
  }

  const handleTopicClick = (topic: DebateTopic) => {
    router.push(`/topics/${topic.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onTopicCreated={handleTopicCreated} />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">Chủ đề tranh luận</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Khám phá và tham gia tranh luận về các chủ đề hot nhất hiện nay
            </p>
          </div>

          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterYear={filterYear}
            onYearChange={setFilterYear}
            availableYears={availableYears}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            availableCategories={availableCategories}
          />

          {loading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-40 sm:h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedTopics.length === 0 ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center px-4">
                <p className="text-base sm:text-lg font-medium">Không tìm thấy chủ đề nào</p>
                <p className="text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Hiển thị {filteredAndSortedTopics.length} chủ đề
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedTopics.map((topic) => (
                  <DebateCard
                    key={`${topic.id}-${refreshKey}`}
                    topic={topic}
                    onClick={() => handleTopicClick(topic)}
                    responseCount={getResponseCount(topic.id)}
                    isAdmin={isAdmin}
                    onEdit={handleEditTopic}
                    onDelete={handleDeleteTopic}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <TopicEditDialog
        topic={editingTopic}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onTopicUpdated={handleTopicUpdated}
      />

      <DeleteConfirmDialog
        topic={deletingTopic}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onTopicDeleted={handleTopicUpdated}
      />
    </div>
  )
}
