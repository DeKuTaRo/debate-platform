"use client";

import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Shield,
  History,
  LogOut,
  Menu,
  BookOpen,
  Bot,
  FileText,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useAdmin } from "@/contexts/admin-context";
import { TopicCreationDialog } from "@/components/admin/topic-creation-dialog";
import { CategoryManagementDialog } from "@/components/admin/category-management-dialog";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Header({ onTopicCreated }: { onTopicCreated?: () => void }) {
  const { isAdmin, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg sm:text-xl"
        >
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          <span>TRANH BIỆN</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-1 h-4 w-4" />
              Trang chủ
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/topics">
              <BookOpen className="mr-1 h-4 w-4" />
              Chủ đề
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/ai-debate">
              <Bot className="mr-1 h-4 w-4" />
              Tranh biện AI
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/history">
              <History className="mr-1 h-4 w-4" />
              Lịch sử
            </Link>
          </Button>

          {isAdmin && (
            <Button variant="ghost" asChild>
              <Link href="/documents">
                <FileText className="mr-1 h-4 w-4" />
                Tài liệu
              </Link>
            </Button>
          )}

          {isAdmin ? (
            <>
              <div className="ml-2 flex items-center gap-1">
                <CategoryManagementDialog />
                <TopicCreationDialog onTopicCreated={onTopicCreated} />
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="mr-1 h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="outline"
              asChild
              size="sm"
              className="ml-2 bg-transparent"
            >
              <Link href="/admin">
                <Shield className="mr-1 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <nav className="flex flex-col gap-4 mt-8">
              <SheetClose asChild>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/">Trang chủ</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/topics">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Chủ đề
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/ai-debate">
                    <Bot className="mr-2 h-4 w-4" />
                    Tranh biện AI
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/history">
                    <History className="mr-2 h-4 w-4" />
                    Lịch sử
                  </Link>
                </Button>
              </SheetClose>

              {isAdmin && (
                <SheetClose asChild>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/documents">
                      <FileText className="mr-2 h-4 w-4" />
                      Tài liệu
                    </Link>
                  </Button>
                </SheetClose>
              )}

              {isAdmin ? (
                <>
                  <div className="border-t pt-4 space-y-4">
                    <CategoryManagementDialog />
                    <TopicCreationDialog onTopicCreated={onTopicCreated} />
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full justify-start bg-transparent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </div>
                </>
              ) : (
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    asChild
                    className="justify-start bg-transparent"
                  >
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
