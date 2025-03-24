
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Mock data generator for charts
const generateMockData = (baseValue: number, hours: number = 12) => {
  return Array.from({ length: hours }, (_, i) => ({
    hour: `${(i * 2).toString().padStart(2, '0')}.00`,
    value: baseValue + Math.random() * (baseValue * 0.5) - (baseValue * 0.25),
  }));
};

interface DeviceChartProps {
  temperatureSensor?: any;
  co2Sensor?: any;
}

export const DeviceChart = ({ temperatureSensor, co2Sensor }: DeviceChartProps) => {
  // Mock data for charts
  const mockCO2Data = generateMockData(450);
  const mockTempData = generateMockData(22);

  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-6">
        <Button variant="outline" size="sm">
          Day <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
        <Button variant="outline" size="sm">
          Month <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
        <Button variant="outline" size="sm">
          Year <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="flex gap-3 mb-4">
        {co2Sensor && (
          <div className="bg-purple-100 text-purple-800 hover:bg-purple-100 px-3 py-1 rounded-md inline-flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
            CO2 <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        )}
        
        {temperatureSensor && (
          <div className="bg-teal-100 text-teal-800 hover:bg-teal-100 px-3 py-1 rounded-md inline-flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded-sm mr-2"></div>
            Temperature <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockCO2Data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9c5ee8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9c5ee8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeeee" />
            <XAxis dataKey="hour" stroke="#999" fontSize={12} />
            <YAxis 
              stroke="#999" 
              fontSize={12} 
              domain={[300, 700]}
              orientation="right"
              tickCount={5}
              tickFormatter={(value) => `${value}`} 
              yAxisId="left"
            />
            <YAxis 
              stroke="#999" 
              fontSize={12} 
              domain={[18, 22]}
              orientation="right"
              tickCount={5}
              tickFormatter={(value) => `${value}`} 
              yAxisId="right"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#9c5ee8" 
              fillOpacity={1} 
              fill="url(#colorCO2)" 
              strokeWidth={2}
              yAxisId="left"
            />
            <Bar 
              dataKey="value" 
              fill="#2dd4bf" 
              radius={[4, 4, 0, 0]}
              yAxisId="right"
              barSize={20}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
