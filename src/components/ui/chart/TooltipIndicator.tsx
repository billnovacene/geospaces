
import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipIndicatorProps {
  indicatorType: "line" | "dot" | "dashed"
  color: string
  nestLabel?: boolean
}

export const TooltipIndicator = ({
  indicatorType,
  color,
  nestLabel,
}: TooltipIndicatorProps) => {
  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
        {
          "h-2.5 w-2.5": indicatorType === "dot",
          "w-1": indicatorType === "line",
          "w-0 border-[1.5px] border-dashed bg-transparent":
            indicatorType === "dashed",
          "my-0.5": nestLabel && indicatorType === "dashed",
        }
      )}
      style={
        {
          "--color-bg": color,
          "--color-border": color,
        } as React.CSSProperties
      }
    />
  )
}
