
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-light transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary-foreground hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30",
        secondary:
          "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700/80",
        destructive:
          "border-transparent bg-destructive/10 text-destructive-foreground hover:bg-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground dark:hover:bg-destructive/30",
        outline: "text-foreground dark:text-white dark:border-gray-700",
        success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
