
import React from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from "recharts";

interface DewPointLineChartProps {
  chartData: any[];
  xAxisKey: string;
  isDarkMode?: boolean;
}

export function DewPointLineChart({ chartData, xAxisKey, isDarkMode = false }: DewPointLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
            if (name === "dewPointDelta") return [`${value}°C`, "Temperature Difference"];
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
            if (value === "dewPointDelta") return "Temperature Difference";
            return value;
          }}
          wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }}
        />
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
            fill: isDarkMode ? "#f87171" : "#ef4444", 
            fontSize: 12 
          }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
