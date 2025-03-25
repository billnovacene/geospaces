
import * as React from "react"
import { ContentProps } from "recharts/types/component/Tooltip"
import { useChart } from "./hooks"
import { TooltipLabel } from "./TooltipLabel"
import { TooltipItem } from "./TooltipItem"

interface ChartTooltipContentProps
  extends Omit<ContentProps, "content" | "contentStyle"> {
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode
  formatter?: (value: any, name: string, item: any, index: number, payload: any) => React.ReactNode
  className?: string
  labelClassName?: string
  labelKey?: string
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nestLabel?: boolean
  hideLabel?: boolean
  nameKey?: string
}

export const ChartTooltipContent = ({
  className,
  labelClassName,
  payload = [],
  labelFormatter,
  formatter,
  active,
  label,
  labelKey,
  hideIndicator = false,
  indicator = "line",
  nestLabel = false,
  hideLabel = false,
  nameKey,
  ...props
}: ChartTooltipContentProps) => {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={className}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        borderRadius: "var(--radius)",
        padding: "0.5rem 0.75rem",
        boxShadow:
          "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 1px -1px rgb(0 0 0 / 0.1)",
        textAlign: "left",
        outline: "none",
        zIndex: 1000,
        minWidth: "10rem",
      }}
      {...props}
    >
      {!hideLabel && (
        <TooltipLabel
          payload={payload}
          label={label}
          labelKey={labelKey}
          labelFormatter={labelFormatter}
          labelClassName={labelClassName}
          config={config}
        />
      )}
      <ul className="flex flex-col gap-2.5 pt-1.5">
        {payload.map((item, index) => (
          <TooltipItem
            key={index}
            item={item}
            index={index}
            formatter={formatter}
            hideIndicator={hideIndicator}
            indicator={indicator}
            config={config}
            nestLabel={nestLabel}
            nameKey={nameKey}
          />
        ))}
      </ul>
    </div>
  )
}
