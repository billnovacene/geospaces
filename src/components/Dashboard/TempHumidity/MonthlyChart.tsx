
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
interface MonthlyChartProps {
  data: MonthlyOverviewPoint[];
}
export function MonthlyChart({
  data
}: MonthlyChartProps) {
  const [month, setMonth] = useState("March");
  const chartConfig = {
    minTemp: {
      label: "Min Temp (°C)",
      color: "#D3E4FD"
    },
    maxTemp: {
      label: "Max Temp (°C)",
      color: "#ea384c"
    },
    avgTemp: {
      label: "Avg Temp (°C)",
      color: "#777777"
    }
  };

  // Transform data to include color information
  const enhancedData = data.map(point => ({
    ...point,
    fill: point.status === 'good' ? '#F2FCE2' : point.status === 'caution' ? '#FEF7CD' : '#FFDEE2'
  }));
  
  return (
    <div className="w-full h-full">
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" className="h-8">
          {month} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" className="h-8">
          Days <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-end gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[#10B981]"></div>
          <span className="text-xs">Green</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[#F59E0B]"></div>
          <span className="text-xs">Amber</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[#EF4444]"></div>
          <span className="text-xs">Red</span>
        </div>
      </div>
      
      <div className="w-full h-[300px]">
        <ChartContainer config={chartConfig}>
          <ComposedChart data={enhancedData} margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 10
          }}>
            <defs>
              {enhancedData.map((entry, index) => <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.fill} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={entry.fill} stopOpacity={0.2} />
                </linearGradient>)}
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{
              fontSize: 10
            }} padding={{
              left: 10,
              right: 10
            }} />
            <YAxis domain={[0, 30]} axisLine={false} tickLine={false} tick={{
              fontSize: 10
            }} />
            <Tooltip content={<ChartTooltipContent />} cursor={{
              stroke: '#ddd',
              strokeWidth: 1,
              strokeDasharray: '3 3'
            }} />
            
            {enhancedData.map((entry, index) => <Area key={`area-${index}`} type="monotone" dataKey="minTemp" stroke="none" fill={`url(#gradient-${index})`} activeDot={false} isAnimationActive={false} stackId={index} data={[entry]} />)}
            
            <Line type="monotone" dataKey="avgTemp" stroke="#777777" strokeWidth={2} dot={false} name="Avg Temp" isAnimationActive={true} />
            <Line type="monotone" dataKey="maxTemp" stroke="#ea384c" strokeWidth={2} dot={false} name="Max Temp" />
            <Line type="monotone" dataKey="minTemp" stroke="#6F9CFF" strokeWidth={2} dot={false} name="Min Temp" />
          </ComposedChart>
        </ChartContainer>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t mt-4">
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Download data
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download the monthly temperature data as CSV</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
