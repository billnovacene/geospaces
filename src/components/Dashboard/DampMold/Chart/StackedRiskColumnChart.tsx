
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

interface DailyRiskData {
  day: string;
  Good: number;
  Caution: number;
  Alarm: number;
  total: number;
}

interface StackedRiskColumnChartProps {
  data: DailyRiskData[];
}

export function StackedRiskColumnChart({ data }: StackedRiskColumnChartProps) {
  // Convert data to percentage for stacked 100% view
  const percentageData = data.map(item => {
    const total = item.Good + item.Caution + item.Alarm;
    return {
      day: item.day,
      Good: (item.Good / total) * 100,
      Caution: (item.Caution / total) * 100,
      Alarm: (item.Alarm / total) * 100,
      total: 100 // Always 100%
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={percentageData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        stackOffset="expand"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          tickMargin={10}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          label={{ 
            value: "Risk Distribution (%)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 12, fill: "#6b7280" }
          }}
        />
        <Tooltip 
          formatter={(value: number | string, name) => {
            // Ensure value is treated as a number for toFixed
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return [`${numValue.toFixed(1)}%`, name];
          }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                  <p className="text-sm font-medium">{label}</p>
                  {payload.map((entry, index) => {
                    // Ensure value is treated as a number for toFixed
                    const numValue = typeof entry.value === 'string' ? parseFloat(entry.value) : entry.value;
                    return (
                      <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: {numValue.toFixed(1)}%
                      </p>
                    );
                  })}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
        />
        <Bar 
          dataKey="Good" 
          stackId="a" 
          fill="#10b981" 
          name="Good"
        />
        <Bar 
          dataKey="Caution" 
          stackId="a" 
          fill="#f97316" 
          name="Caution"
        />
        <Bar 
          dataKey="Alarm" 
          stackId="a" 
          fill="#ef4444" 
          name="Alarm" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
