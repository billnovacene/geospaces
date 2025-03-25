
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DailyOverviewPoint } from "@/services/temp-humidity";

interface TemperatureBarChartProps {
  data: Array<DailyOverviewPoint & { barColor: string; label: string }>;
  yAxisMin: number;
  yAxisMax: number;
  relevantThresholds: number[];
}

export function TemperatureBarChart({ 
  data, 
  yAxisMin, 
  yAxisMax, 
  relevantThresholds 
}: TemperatureBarChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={{}}>
        <BarChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
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
          <Tooltip 
            content={
              <ChartTooltipContent 
                labelFormatter={(label) => `Time: ${label}`} 
                formatter={(value, name, item) => {
                  const entry = item.payload;
                  const dataType = entry.isReal?.temperature ? 'Real data' : 'Simulated data';
                  return [
                    `${value}°C`,
                    `${name} (${dataType})`
                  ];
                }}
              />
            } 
          />
          
          {relevantThresholds.map((threshold, i) => (
            <ReferenceLine 
              key={`threshold-${i}`}
              y={threshold} 
              stroke="#ddd" 
              strokeDasharray="3 3" 
            />
          ))}
          
          <Bar 
            dataKey="temperature" 
            name="Temperature" 
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
