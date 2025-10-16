import type * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "support" | "oppose"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "border border-border bg-background text-foreground": variant === "outline",
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400": variant === "support",
          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400": variant === "oppose",
        },
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
