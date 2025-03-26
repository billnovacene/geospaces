
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
  // Add gradient definitions for nicer-looking bars
  const gradientOffset = () => {
    return 0.5;
  };
  
  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={{}}>
        <BarChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset()} stopColor="#db4f6a" stopOpacity={0.9}/>
              <stop offset={gradientOffset()} stopColor="#ef4146" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset()} stopColor="#ebc651" stopOpacity={0.9}/>
              <stop offset={gradientOffset()} stopColor="#f59e0b" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset()} stopColor="#3cc774" stopOpacity={0.9}/>
              <stop offset={gradientOffset()} stopColor="#10b981" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset()} stopColor="#9ca3af" stopOpacity={0.7}/>
              <stop offset={gradientOffset()} stopColor="#d1d5db" stopOpacity={0.5}/>
            </linearGradient>
          </defs>
        
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
            radius={[4, 4, 0, 0]}
            barSize={12}
          >
            {data.map((entry, index) => {
              let fillUrl = "url(#colorSimulated)";
              
              // For real data points, use RAG gradient coloring
              if (entry.isReal?.temperature) {
                if (entry.barColor.includes("red")) {
                  fillUrl = "url(#colorRed)";
                } else if (entry.barColor.includes("amber")) {
                  fillUrl = "url(#colorAmber)";
                } else if (entry.barColor.includes("green")) {
                  fillUrl = "url(#colorGreen)";
                }
              }
              
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={fillUrl}
                  stroke={entry.isReal?.temperature ? entry.barColor : "#9ca3af"}
                  strokeWidth={1}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
