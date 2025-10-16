"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  login: () => void
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_SESSION_KEY = "admin_session"

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if admin session exists
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (session === "true") {
      setIsAdmin(true)
    }
  }, [])

  const login = () => {
    setIsAdmin(true)
    localStorage.setItem(ADMIN_SESSION_KEY, "true")
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }

  return <AdminContext.Provider value={{ isAdmin, login, logout }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
