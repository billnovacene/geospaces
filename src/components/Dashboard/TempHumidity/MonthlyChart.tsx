
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { sensorTypes, getSensorValueColor } from "@/utils/sensorThresholds";

interface MonthlyChartProps {
  data: MonthlyOverviewPoint[];
}

export function MonthlyChart({
  data
}: MonthlyChartProps) {
  const [month, setMonth] = useState("March");
  
  // Get the temperature thresholds from our config
  const temperatureConfig = sensorTypes.temperature;
  
  // Transform data to include color information based on our threshold system
  const enhancedData = data.map(point => {
    // Get the appropriate color for the temperature value
    const barColor = getSensorValueColor("temperature", point.avgTemp);
    
    return {
      ...point,
      barColor,
    };
  });

  return (
    <div className="w-full h-full flex flex-col">
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
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: temperatureConfig.colors[2] }}></div>
          <span className="text-xs">Good (17-22°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: temperatureConfig.colors[1] }}></div>
          <span className="text-xs">Cool/Warm (10-17°C, 22-30°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: temperatureConfig.colors[0] }}></div>
          <span className="text-xs">Too Cold/Hot (&lt;10°C, &gt;30°C)</span>
        </div>
      </div>
      
      <div className="w-full h-[300px] flex-grow">
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
              domain={[
                Math.min(temperatureConfig.minValue, Math.floor(Math.min(...data.map(d => d.minTemp)) - 2)),
                Math.max(temperatureConfig.maxValue, Math.ceil(Math.max(...data.map(d => d.maxTemp)) + 2))
              ]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10 }}
              width={25}
            />
            <Tooltip content={<ChartTooltipContent />} />
            
            {/* Add reference lines for temperature thresholds */}
            {temperatureConfig.thresholds.map((threshold, i) => (
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
              {enhancedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.barColor} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t mt-4">
        <div></div> {/* Empty div to push download button to the right */}
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

