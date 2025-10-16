export interface Category {
  id: string
  name: string
  createdAt: Date
}

const CATEGORIES_KEY = "debate_categories"

const defaultCategories: Category[] = [
  { id: "1", name: "Công nghệ", createdAt: new Date() },
  { id: "2", name: "Giáo dục", createdAt: new Date() },
  { id: "3", name: "Xã hội", createdAt: new Date() },
  { id: "4", name: "Kinh tế", createdAt: new Date() },
  { id: "5", name: "Môi trường", createdAt: new Date() },
  { id: "6", name: "Sức khỏe", createdAt: new Date() },
  { id: "7", name: "Chính trị", createdAt: new Date() },
  { id: "8", name: "Văn hóa", createdAt: new Date() },
]

class CategoryStorageService {
  getCategories(): Category[] {
    if (typeof window === "undefined") return defaultCategories

    const stored = localStorage.getItem(CATEGORIES_KEY)
    if (!stored) {
      // Initialize with default categories
      this.saveCategories(defaultCategories)
      return defaultCategories
    }

    const categories = JSON.parse(stored)
    return categories.map((cat: Category) => ({
      ...cat,
      createdAt: new Date(cat.createdAt),
    }))
  }

  private saveCategories(categories: Category[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  }

  addCategory(name: string): void {
    const categories = this.getCategories()
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
    }
    categories.push(newCategory)
    this.saveCategories(categories)
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((cat) => cat.id !== id)
    this.saveCategories(categories)
  }

  updateCategory(id: string, name: string): void {
    const categories = this.getCategories().map((cat) => (cat.id === id ? { ...cat, name } : cat))
    this.saveCategories(categories)
  }
}

export const categoryStorageService = new CategoryStorageService()
