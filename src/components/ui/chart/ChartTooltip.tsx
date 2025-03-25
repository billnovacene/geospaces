
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { useChart } from "./ChartContext"
import { getPayloadConfigFromPayload } from "./utils"
import { TooltipIndicator } from "./TooltipIndicator"
import { TooltipItem } from "./TooltipItem"
import { TooltipLabel } from "./TooltipLabel"

export const ChartTooltip = RechartsPrimitive.Tooltip

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel && !hideLabel && (
          <TooltipLabel
            payload={payload}
            label={label}
            labelKey={labelKey}
            labelFormatter={labelFormatter}
            labelClassName={labelClassName}
            config={config}
          />
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => (
            <TooltipItem
              key={item.dataKey}
              item={item}
              index={index}
              formatter={formatter}
              hideIndicator={hideIndicator}
              indicator={indicator}
              color={color}
              nameKey={nameKey}
              config={config}
              nestLabel={nestLabel}
              hideLabel={hideLabel}
              label={label}
              labelKey={labelKey}
              labelFormatter={labelFormatter}
              labelClassName={labelClassName}
            />
          ))}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"
