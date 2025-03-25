
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine,
  Cell,
  Legend,
} from "recharts";
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { subDays, format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { sensorTypes, getSensorValueColor } from "@/utils/sensorThresholds";
import { Badge } from "@/components/ui/badge";
import { TooltipWrapper } from "@/components/UI/TooltipWrapper";

interface DailyChartProps {
  data: DailyOverviewPoint[];
  isMockData?: boolean;
}

export function DailyChart({ data, isMockData = false }: DailyChartProps) {
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
  
  const temperatureConfig = sensorTypes.temperature;
  
  // Count real data points
  const realDataPointsCount = data.filter(point => point.isReal?.temperature).length;
  const totalDataPoints = data.length;
  const hasRealData = realDataPointsCount > 0;
  
  const enhancedData = data.map(point => {
    const barColor = point.isReal?.temperature 
      ? getSensorValueColor("temperature", point.temperature)
      : "#E5E7EB"; // Gray for simulated data
    
    return {
      ...point,
      barColor,
      // Create a label for the tooltip
      label: point.isReal?.temperature ? "Real data" : "Simulated data"
    };
  });

  const actualMinTemp = Math.min(...data.map(d => d.temperature));
  const actualMaxTemp = Math.max(...data.map(d => d.temperature));
  
  const yAxisMin = Math.floor(actualMinTemp - 2);
  const yAxisMax = Math.ceil(actualMaxTemp + 2);

  // Filter out the thresholds we want to display
  const relevantThresholds = temperatureConfig.thresholds
    .filter(threshold => threshold >= yAxisMin && threshold <= yAxisMax)
    .filter(threshold => threshold !== 28); // Exclude 28°C threshold

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {hasRealData ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {realDataPointsCount} real data points
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Using simulated data
            </Badge>
          )}
          
          <TooltipWrapper content="Data shown is from sensors, some hours may use simulated values when sensor readings are unavailable">
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipWrapper>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="h-8">
            {format(selectedDate, "d MMMM")}
          </Button>
          <Button variant="outline" className="h-8">
            Hours
          </Button>
        </div>
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
        {!hasRealData && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-gray-200"></div>
            <span className="text-xs">Simulated data</span>
          </div>
        )}
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
                    return [
                      `${value}°C${entry.isReal?.temperature ? '' : ' (simulated)'}`,
                      name
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
              {enhancedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.barColor} />
              ))}
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
      </div>
    </div>
  );
}
