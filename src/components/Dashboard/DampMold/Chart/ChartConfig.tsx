
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

interface ChartConfigProps {
  chartData: any[];
  xAxisKey: string;
  description?: string;
}

export function ChartConfig({ 
  chartData, 
  xAxisKey, 
  description 
}: ChartConfigProps) {
  return (
    <div className="flex items-start space-x-6">
      {description && (
        <div className="w-1/4 text-sm text-gray-700">
          {description}
        </div>
      )}
      <div className={`${description ? 'w-3/4' : 'w-full'}`}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
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
      </div>
    </div>
  );
}
