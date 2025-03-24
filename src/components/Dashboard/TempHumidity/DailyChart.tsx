
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine,
} from "recharts";
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { subDays, format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DailyChartProps {
  data: DailyOverviewPoint[];
}

export function DailyChart({ data }: DailyChartProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const formatTime = (time: string) => {
    return time;
  };
  
  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };
  
  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };
  
  // Transform data to include color information
  const enhancedData = data.map(point => ({
    ...point,
    barColor: point.status === 'good' ? '#10B981' : 
              point.status === 'caution' ? '#F59E0B' : '#EF4444',
  }));

  return (
    <div className="w-full h-full">
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" className="h-8">
          {format(selectedDate, "d MMMM")}
        </Button>
        <Button variant="outline" className="h-8">
          Days
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
              dataKey="time" 
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
              dataKey="temperature" 
              name="Temperature" 
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
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextDay}
            disabled={format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          06:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 18:00
        </div>
      </div>
    </div>
  );
}
