"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SortOption, FilterYear, FilterCategory } from "@/lib/types"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  filterYear: FilterYear
  onYearChange: (value: FilterYear) => void
  availableYears: number[]
  filterCategory: FilterCategory
  onCategoryChange: (value: FilterCategory) => void
  availableCategories: string[]
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterYear,
  onYearChange,
  availableYears,
  filterCategory,
  onCategoryChange,
  availableCategories,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm chủ đề tranh luận..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Select value={filterCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterYear.toString()}
          onValueChange={(value) => onYearChange(value === "all" ? "all" : Number.parseInt(value))}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả năm</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                Năm {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
