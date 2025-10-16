"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

interface AdminLoginProps {
  onLogin: (password: string) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError("Vui lòng nhập mật khẩu")
      return
    }
    onLogin(password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Đăng nhập Admin</CardTitle>
          <CardDescription>Nhập mật khẩu để truy cập trang quản trị</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu admin"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Mật khẩu mặc định: <code className="rounded bg-muted px-1 py-0.5">admin123</code>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
