
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";

interface MonthlyTemperatureChartProps {
  data: Array<MonthlyOverviewPoint & { barColor: string }>;
  yAxisMin: number;
  yAxisMax: number;
  relevantThresholds: number[];
}

export function MonthlyTemperatureChart({
  data,
  yAxisMin,
  yAxisMax,
  relevantThresholds
}: MonthlyTemperatureChartProps) {
  return (
    <div className="w-full h-[300px] flex-grow">
      <ChartContainer config={{}}>
        <BarChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10 }}
            height={25}
          />
          <YAxis 
            domain={[yAxisMin, yAxisMax]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10 }}
            width={25}
          />
          <Tooltip content={<ChartTooltipContent />} />
          
          {relevantThresholds.map((threshold, i) => (
            <ReferenceLine 
              key={`threshold-${i}`}
              y={threshold} 
              stroke="#ddd" 
              strokeDasharray="3 3" 
            />
          ))}
          
          <Bar 
            dataKey="avgTemp" 
            name="Average Temperature" 
            radius={[2, 2, 0, 0]}
            barSize={10}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.barColor} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
