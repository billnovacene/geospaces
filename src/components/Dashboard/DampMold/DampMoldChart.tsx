
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  Area
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface DampMoldChartProps {
  data: any;
}

export function DampMoldChart({ data }: DampMoldChartProps) {
  const [selectedRange, setSelectedRange] = useState("day");
  
  // Generate mock data if real data is not available
  const generateMockData = () => {
    // Generate 24 hours of data for a day view
    if (selectedRange === "day") {
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        // Create more realistic patterns
        const baseHumidity = 55 + Math.sin(i / 3) * 15;
        const baseTemp = 18 + Math.sin(i / 6) * 5;
        const randomFactor = Math.random() * 5;
        
        return {
          hour: `${hour}:00`,
          humidity: Math.round(baseHumidity + randomFactor),
          temperature: parseFloat((baseTemp + randomFactor / 2).toFixed(1)),
          dewPoint: parseFloat((baseTemp - 5 + Math.sin(i / 4) * 2).toFixed(1)),
          riskZone: hour >= 1 && hour <= 6 ? 1 : 0 // Risk zone during night hours
        };
      });
    }
    
    // Generate 7 days of data for week view
    if (selectedRange === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day, i) => {
        return {
          day,
          humidity: Math.round(60 + Math.sin(i / 2) * 15),
          temperature: parseFloat((19 + Math.sin(i / 3) * 3).toFixed(1)),
          dewPoint: parseFloat((14 + Math.sin(i / 2) * 2).toFixed(1)),
          riskZone: i >= 3 && i <= 5 ? 1 : 0 // Risk zone on weekend
        };
      });
    }
    
    // Generate 30 days of data for month view
    return Array.from({ length: 30 }, (_, i) => {
      return {
        day: `Day ${i + 1}`,
        humidity: Math.round(55 + Math.sin(i / 5) * 20),
        temperature: parseFloat((18 + Math.sin(i / 7) * 4).toFixed(1)),
        dewPoint: parseFloat((13 + Math.sin(i / 6) * 3).toFixed(1)),
        riskZone: i >= 10 && i <= 15 ? 1 : 0 // Risk zone in middle of month
      };
    });
  };
  
  const chartData = data?.dampMoldData || generateMockData();
  
  // Configure x-axis based on selected time range
  const getXAxisKey = () => {
    if (selectedRange === "day") return "hour";
    return "day";
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Damp Conditions Analysis</CardTitle>
        <div className="flex space-x-2">
          <Badge 
            variant={selectedRange === "day" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedRange("day")}
          >
            Day
          </Badge>
          <Badge 
            variant={selectedRange === "week" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedRange("week")}
          >
            Week
          </Badge>
          <Badge 
            variant={selectedRange === "month" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedRange("month")}
          >
            Month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis 
              dataKey={getXAxisKey()} 
              tick={{ fontSize: 12 }} 
              tickMargin={10}
            />
            <YAxis 
              yAxisId="left"
              domain={[0, 100]} 
              tick={{ fontSize: 12 }}
              tickMargin={10}
              label={{ 
                value: "Humidity (%)", 
                angle: -90, 
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: 12, fill: "#6b7280" }
              }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 30]} 
              tick={{ fontSize: 12 }}
              tickMargin={10}
              label={{ 
                value: "Temperature (°C)", 
                angle: 90, 
                position: "insideRight",
                style: { textAnchor: "middle", fontSize: 12, fill: "#6b7280" }
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "humidity") return [`${value}%`, "Humidity"];
                if (name === "temperature") return [`${value}°C`, "Temperature"];
                if (name === "dewPoint") return [`${value}°C`, "Dew Point"];
                return [value, name];
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => {
                if (value === "humidity") return "Humidity (%)";
                if (value === "temperature") return "Temperature (°C)";
                if (value === "dewPoint") return "Dew Point (°C)";
                if (value === "riskZone") return "Risk Zone";
                return value;
              }}
            />
            <Area
              yAxisId="right"
              dataKey="riskZone"
              fill="rgba(239, 68, 68, 0.2)"
              stroke="none"
              name="riskZone"
            />
            <Bar 
              yAxisId="left" 
              dataKey="humidity" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              barSize={20}
              name="humidity"
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="temperature" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="temperature"
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="dewPoint" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="dewPoint"
            />
            {/* Reference line for critical humidity level */}
            <ReferenceLine 
              yAxisId="left" 
              y={75} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              label={{ 
                value: "Risk Threshold", 
                position: "insideBottomRight", 
                fill: "#ef4444", 
                fontSize: 12 
              }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
