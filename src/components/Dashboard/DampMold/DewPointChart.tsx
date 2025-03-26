
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DewPointChartProps {
  data: any;
}

export function DewPointChart({ data }: DewPointChartProps) {
  const [selectedRange, setSelectedRange] = useState("day");
  const [chartType, setChartType] = useState("line");
  
  // Generate mock dew point analysis data
  const generateDewPointData = () => {
    // Generate 24 hours of data for a day view
    if (selectedRange === "day") {
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const surfaceTemp = 18 + Math.sin(i / 6) * 5;
        const dewPoint = surfaceTemp - (5 + Math.sin(i / 8) * 3);
        const riskFactor = Math.max(0, 10 - (surfaceTemp - dewPoint));
        
        return {
          hour: `${hour}:00`,
          surfaceTemperature: parseFloat(surfaceTemp.toFixed(1)),
          dewPoint: parseFloat(dewPoint.toFixed(1)),
          dewPointDelta: parseFloat((surfaceTemp - dewPoint).toFixed(1)),
          riskFactor: parseFloat(riskFactor.toFixed(1))
        };
      });
    }
    
    // Generate 7 days of data for week view
    if (selectedRange === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day, i) => {
        const surfaceTemp = 19 + Math.sin(i / 3) * 3;
        const dewPoint = surfaceTemp - (6 + Math.cos(i / 2) * 2);
        const riskFactor = Math.max(0, 10 - (surfaceTemp - dewPoint));
        
        return {
          day,
          surfaceTemperature: parseFloat(surfaceTemp.toFixed(1)),
          dewPoint: parseFloat(dewPoint.toFixed(1)),
          dewPointDelta: parseFloat((surfaceTemp - dewPoint).toFixed(1)),
          riskFactor: parseFloat(riskFactor.toFixed(1))
        };
      });
    }
    
    // Generate 30 days of data for month view
    return Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      const surfaceTemp = 18 + Math.sin(i / 7) * 4;
      const dewPoint = surfaceTemp - (5.5 + Math.sin(i / 10) * 3.5);
      const riskFactor = Math.max(0, 10 - (surfaceTemp - dewPoint));
      
      return {
        day: `Day ${day}`,
        surfaceTemperature: parseFloat(surfaceTemp.toFixed(1)),
        dewPoint: parseFloat(dewPoint.toFixed(1)),
        dewPointDelta: parseFloat((surfaceTemp - dewPoint).toFixed(1)),
        riskFactor: parseFloat(riskFactor.toFixed(1))
      };
    });
  };
  
  const chartData = data?.dewPointData || generateDewPointData();
  
  // Configure x-axis based on selected time range
  const getXAxisKey = () => {
    if (selectedRange === "day") return "hour";
    return "day";
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Dew Point Analysis</CardTitle>
        <div className="flex items-center space-x-4">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
          
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
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div className="pb-4">
          <p className="text-sm text-gray-500">
            Dew point analysis shows the relationship between surface temperature and dew point temperature.
            When these values are close, condensation risk increases significantly.
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
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
                domain={[0, 30]} 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={{ 
                  value: "Temperature (°C)", 
                  angle: -90, 
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: 12, fill: "#6b7280" }
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "surfaceTemperature") return [`${value}°C`, "Surface Temp"];
                  if (name === "dewPoint") return [`${value}°C`, "Dew Point"];
                  if (name === "dewPointDelta") return [`${value}°C`, "Temperature Difference"];
                  if (name === "riskFactor") return [`${value}`, "Condensation Risk Factor"];
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line 
                type="monotone" 
                dataKey="surfaceTemperature" 
                name="surfaceTemperature"
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="dewPoint" 
                name="dewPoint"
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="dewPointDelta" 
                name="dewPointDelta"
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
              <ReferenceLine 
                y={3} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Risk Threshold", 
                  position: "insideBottomRight", 
                  fill: "#ef4444", 
                  fontSize: 12 
                }} 
              />
            </LineChart>
          ) : (
            <AreaChart
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
                domain={[0, 30]} 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={{ 
                  value: "Temperature (°C)", 
                  angle: -90, 
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: 12, fill: "#6b7280" }
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "surfaceTemperature") return [`${value}°C`, "Surface Temp"];
                  if (name === "dewPoint") return [`${value}°C`, "Dew Point"];
                  if (name === "riskFactor") return [`${value}`, "Condensation Risk Factor"];
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area 
                type="monotone" 
                dataKey="surfaceTemperature" 
                name="surfaceTemperature"
                stroke="#f97316" 
                fill="#f97316" 
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="dewPoint" 
                name="dewPoint"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="riskFactor" 
                name="riskFactor"
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.3}
              />
              <ReferenceLine 
                y={3} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Risk Threshold", 
                  position: "insideBottomRight", 
                  fill: "#ef4444", 
                  fontSize: 12 
                }} 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
