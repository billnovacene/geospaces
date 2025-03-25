
import * as React from "react"

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  )
}

export interface TooltipIndicatorProps {
  indicatorType: "line" | "dot" | "dashed"
  color: string
  nestLabel?: boolean
}

export interface TooltipLabelProps {
  payload: any[]
  label?: React.ReactNode
  labelKey?: string
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode
  labelClassName?: string
  config: ChartConfig
}

export interface TooltipItemProps {
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
