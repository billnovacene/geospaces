
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
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#f3f4f6"} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12, fill: isDarkMode ? "#e5e7eb" : "#6b7280" }} 
          tickMargin={10}
        />
        <YAxis 
          domain={[0, 30]} 
          tick={{ fontSize: 12, fill: isDarkMode ? "#e5e7eb" : "#6b7280" }}
          tickMargin={10}
          label={{ 
            value: "Temperature (°C)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 12, fill: isDarkMode ? "#e5e7eb" : "#6b7280" }
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
            color: isDarkMode ? "#e5e7eb" : "#374151",
            boxShadow: isDarkMode ? "0 10px 15px -3px rgba(0, 0, 0, 0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
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
        <Line 
          type="monotone" 
          dataKey="surfaceTemperature" 
          name="surfaceTemperature"
          strokeWidth={2}
          stroke="#f97316" 
          dot={{ stroke: '#f97316', strokeWidth: 2, r: 4, fill: isDarkMode ? '#1f2937' : '#fff' }}
          activeDot={{ stroke: '#f97316', strokeWidth: 2, r: 6, fill: isDarkMode ? '#f97316' : '#fff' }}
        />
        <Line 
          type="monotone" 
          dataKey="dewPoint" 
          name="dewPoint"
          strokeWidth={2}
          stroke="#60a5fa" 
          dot={{ stroke: '#60a5fa', strokeWidth: 2, r: 4, fill: isDarkMode ? '#1f2937' : '#fff' }}
          activeDot={{ stroke: '#60a5fa', strokeWidth: 2, r: 6, fill: isDarkMode ? '#60a5fa' : '#fff' }}
        />
        <Line 
          type="monotone" 
          dataKey="riskFactor" 
          name="riskFactor"
          strokeWidth={2}
          stroke="#ef4444" 
          dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4, fill: isDarkMode ? '#1f2937' : '#fff' }}
          activeDot={{ stroke: '#ef4444', strokeWidth: 2, r: 6, fill: isDarkMode ? '#ef4444' : '#fff' }}
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
