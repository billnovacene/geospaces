
import React from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from "recharts";

interface DewPointAreaChartProps {
  chartData: any[];
  xAxisKey: string;
  isDarkMode?: boolean;
}

export function DewPointAreaChart({ chartData, xAxisKey, isDarkMode = false }: DewPointAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#f1f1f1"} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }} 
          tickMargin={10}
        />
        <YAxis 
          domain={[0, 30]} 
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }}
          tickMargin={10}
          label={{ 
            value: "Temperature (°C)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 12, fill: isDarkMode ? "#ccc" : "#6b7280" }
          }}
        />
        <Tooltip 
          formatter={(value, name) => {
            if (name === "surfaceTemperature") return [`${value}°C`, "Surface Temp"];
            if (name === "dewPoint") return [`${value}°C`, "Dew Point"];
            if (name === "riskFactor") return [`${value}`, "Condensation Risk Factor"];
            return [value, name];
          }}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={{ strokeDasharray: '3 3' }}
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
            if (value === "surfaceTemperature") return "Surface Temperature";
            if (value === "dewPoint") return "Dew Point";
            if (value === "riskFactor") return "Risk Factor";
            return value;
          }}
          wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }}
        />
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
            fill: isDarkMode ? "#f87171" : "#ef4444", 
            fontSize: 12 
          }} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
