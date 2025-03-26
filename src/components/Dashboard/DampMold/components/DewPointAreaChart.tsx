
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
}

export function DewPointAreaChart({ chartData, xAxisKey }: DewPointAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
        <XAxis 
          dataKey={xAxisKey} 
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
    </ResponsiveContainer>
  );
}
