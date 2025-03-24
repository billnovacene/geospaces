
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { subDays, format, addDays } from "date-fns";

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
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Daily Overview</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevDay}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(selectedDate, "d MMMM")}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextDay}
            disabled={format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Temps range from ~8°C early to ~22°C peak, with humidity near 47%.
            The building warms quickly and stays fairly stable during working hours.
          </p>
        </div>
        
        <div className="h-[300px]">
          <ChartContainer config={{}}>
            <BarChart 
              data={enhancedData} 
              margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTime}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
                height={30}
              />
              <YAxis 
                domain={[0, 25]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={25}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
              />
              <ReferenceLine y={20} stroke="#ddd" strokeDasharray="3 3" />
              <ReferenceLine y={15} stroke="#ddd" strokeDasharray="3 3" />
              <ReferenceLine y={10} stroke="#ddd" strokeDasharray="3 3" />
              <ReferenceLine y={5} stroke="#ddd" strokeDasharray="3 3" />
              
              {/* Use Bar with fill based on status */}
              <Bar 
                dataKey="temperature" 
                radius={[2, 2, 0, 0]}
                barSize={16}
                fill="#D3D3D3"
                name="Temperature"
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
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">06:00</div>
          <div className="text-xs text-muted-foreground">12:00</div>
          <div className="text-xs text-muted-foreground">18:00</div>
          <div className="text-xs text-muted-foreground">Now</div>
        </div>
      </CardContent>
    </Card>
  );
}
