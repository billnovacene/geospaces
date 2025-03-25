
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChartConfig } from "./ChartContext"
import { getPayloadConfigFromPayload } from "./utils"
import { TooltipIndicator } from "./TooltipIndicator"
import { TooltipLabel } from "./TooltipLabel"

interface TooltipItemProps {
  item: any
  index: number
  formatter?: (value: any, name: string, item: any, index: number, payload: any) => React.ReactNode
  hideIndicator?: boolean
  indicator: "line" | "dot" | "dashed"
  color?: string
  nameKey?: string
  config: ChartConfig
  nestLabel?: boolean
  hideLabel?: boolean
  label?: React.ReactNode
  labelKey?: string
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode
  labelClassName?: string
}

export const TooltipItem = ({
  item,
  index,
  formatter,
  hideIndicator,
  indicator,
  color,
  nameKey,
  config,
  nestLabel,
  hideLabel,
  label,
  labelKey,
  labelFormatter,
  labelClassName,
}: TooltipItemProps) => {
  const key = `${nameKey || item.name || item.dataKey || "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const indicatorColor = color || item.payload.fill || item.color

  // If a formatter is provided, render using the formatter
  if (formatter && item?.value !== undefined && item.name) {
    return (
      <div className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center"
      )}>
        {formatter(item.value, item.name, item, index, item.payload)}
      </div>
    )
  }

  return (
    <div className={cn(
      "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
      indicator === "dot" && "items-center"
    )}>
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        !hideIndicator && (
          <TooltipIndicator 
            indicatorType={indicator} 
            color={indicatorColor}
            nestLabel={nestLabel} 
          />
        )
      )}
      <div
        className={cn(
          "flex flex-1 justify-between leading-none",
          nestLabel ? "items-end" : "items-center"
        )}
      >
        <div className="grid gap-1.5">
          {nestLabel && !hideLabel && (
            <TooltipLabel
              payload={[item]}
              label={label}
              labelKey={labelKey}
              labelFormatter={labelFormatter}
              labelClassName={labelClassName}
              config={config}
            />
          )}
          <span className="text-muted-foreground">
            {itemConfig?.label || item.name}
          </span>
        </div>
        {item.value && (
          <span className="font-mono font-medium tabular-nums text-foreground">
            {item.value.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )
}
