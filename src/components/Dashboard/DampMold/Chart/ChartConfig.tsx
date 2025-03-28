
import React from "react";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  Area,
  ResponsiveContainer
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";

interface ChartConfigProps {
  chartData: any[];
  xAxisKey: string;
  description?: string;
}

export function ChartConfig({ 
  chartData, 
  xAxisKey 
}: ChartConfigProps) {
  const { activeTheme } = useTheme();
  const isDarkMode = activeTheme === "dark";

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
      <ComposedChart
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#f1f1f1"} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }} 
          tickMargin={10}
        />
        <YAxis 
          yAxisId="left"
          domain={[0, 100]} 
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }}
          tickMargin={10}
          label={{ 
            value: "Humidity (%)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 12, fill: isDarkMode ? "#ccc" : "#6b7280" }
          }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 30]} 
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }}
          tickMargin={10}
          label={{ 
            value: "Temperature (°C)", 
            angle: 90, 
            position: "insideRight",
            style: { textAnchor: "middle", fontSize: 12, fill: isDarkMode ? "#ccc" : "#6b7280" }
          }}
        />
        <Tooltip 
          formatter={(value, name) => {
            if (name === "humidity") return [`${value}%`, "Humidity"];
            if (name === "temperature") return [`${value}°C`, "Temperature"];
            if (name === "dewPoint") return [`${value}°C`, "Dew Point"];
            return [value, name];
          }}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={{ strokeDasharray: '3 3', strokeWidth: 2 }}
          contentStyle={{
            backgroundColor: isDarkMode ? "#1f2937" : "#fff",
            border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
            color: isDarkMode ? "#e5e7eb" : "#374151"
          }}
          labelStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }}
          itemStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }}
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
          wrapperStyle={{ color: isDarkMode ? "#ccc" : "#333" }}
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
        <ReferenceLine 
          yAxisId="left" 
          y={75} 
          stroke="#ef4444" 
          strokeDasharray="3 3" 
          label={{ 
            value: "Risk Threshold", 
            position: "insideBottomRight", 
            fill: isDarkMode ? "#f87171" : "#ef4444", 
            fontSize: 12 
          }} 
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
