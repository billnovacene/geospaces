
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
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
  
  // Define colors for different statuses
  const statusColors = {
    good: '#10B981',  // Green
    caution: '#F59E0B', // Amber
    warning: '#EF4444'  // Red
  };

  // Transform data to include color information
  const enhancedData = data.map(point => ({
    ...point,
    barColor: point.status === 'good' ? statusColors.good : 
              point.status === 'caution' ? statusColors.caution : statusColors.warning,
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
        <ChartContainer config={{}}>
          <BarChart 
            data={enhancedData} 
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
              domain={[0, 25]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10 }}
              width={25}
            />
            <Tooltip content={<ChartTooltipContent />} />
            
            <ReferenceLine y={20} stroke="#ddd" strokeDasharray="3 3" />
            <ReferenceLine y={15} stroke="#ddd" strokeDasharray="3 3" />
            <ReferenceLine y={10} stroke="#ddd" strokeDasharray="3 3" />
            <ReferenceLine y={5} stroke="#ddd" strokeDasharray="3 3" />
            
            <Bar 
              dataKey="avgTemp" 
              name="Average Temperature" 
              radius={[2, 2, 0, 0]}
              barSize={10}
            >
              {
                enhancedData.map((entry, index) => (
                  <rect 
                    key={`rect-${index}`} 
                    x={0} 
                    y={0} 
                    width={10} 
                    height={10} 
                    fill={entry.barColor} 
                    fillOpacity={0.9}
                  />
                ))
              }
            </Bar>
          </BarChart>
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
