
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  ComposedChart,
  Line,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MonthlyChartProps {
  data: MonthlyOverviewPoint[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
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
    },
    green: {
      label: "Good",
      color: "#10B981"
    },
    amber: {
      label: "Caution",
      color: "#F59E0B"
    },
    red: {
      label: "Warning",
      color: "#EF4444"
    }
  };
  
  // Transform data to include color information
  const enhancedData = data.map(point => ({
    ...point,
    bgColor: point.status === 'good' ? '#F2FCE2' : 
             point.status === 'caution' ? '#FEF7CD' : '#FFDEE2',
  }));

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Monthly Overview</CardTitle>
        <Button variant="outline" className="h-8">
          {month} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Lowest temps rarely dip below 8°C, highest near 22°C. Humidity remains
            about 47%, showing steady indoor conditions with minor fluctuations
            linked to weather or occupancy.
          </p>
        </div>
        
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ComposedChart 
              data={enhancedData} 
              margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                minTickGap={60}
              />
              <YAxis 
                domain={[0, 30]} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
              />
              <Legend />
              <ReferenceLine y={18} stroke="#F59E0B" strokeDasharray="3 3" />
              <ReferenceLine y={22} stroke="#EF4444" strokeDasharray="3 3" />
              
              <Area 
                type="monotone" 
                dataKey="minTemp" 
                fill="#F2FCE2"
                stroke="none"
                name="Range"
              />
              <Line 
                type="monotone" 
                dataKey="avgTemp" 
                stroke="#777777" 
                strokeWidth={2}
                dot={false}
                name="Avg Temp"
              />
              <Line 
                type="monotone" 
                dataKey="maxTemp" 
                stroke="#ea384c" 
                strokeWidth={2}
                dot={false}
                name="Max Temp"
              />
              <Line 
                type="monotone" 
                dataKey="minTemp" 
                stroke="#6F9CFF" 
                strokeWidth={2}
                dot={false}
                name="Min Temp"
              />
            </ComposedChart>
          </ChartContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between space-x-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-[#10B981] mr-1"></div>
            <span className="text-xs">Green</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-[#F59E0B] mr-1"></div>
            <span className="text-xs">Amber</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-[#EF4444] mr-1"></div>
            <span className="text-xs">Red</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
