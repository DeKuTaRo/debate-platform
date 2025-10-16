"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { adminStorageService } from "@/lib/admin-storage"
import { AdminLogin } from "@/components/admin/admin-login"
import { useAdmin } from "@/contexts/admin-context"

export default function AdminPage() {
  const { isAdmin, login } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router])

  const handleLogin = (password: string) => {
    if (adminStorageService.checkPassword(password)) {
      login()
      router.push("/")
    } else {
      alert("Mật khẩu không đúng!")
    }
  }

  if (isAdmin) {
    return null
  }

  return <AdminLogin onLogin={handleLogin} />
}
