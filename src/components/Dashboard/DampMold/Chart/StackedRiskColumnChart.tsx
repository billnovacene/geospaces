
import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";

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
  const { activeTheme } = useTheme();
  const isDarkMode = activeTheme === "dark";
  const [chartData, setChartData] = useState<DailyRiskData[]>([]);
  
  // Generate sample data if none is provided
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      // Generate default sample data
      const sampleData: DailyRiskData[] = [
        { day: 'Mon', Good: 70, Caution: 20, Alarm: 10, total: 100 },
        { day: 'Tue', Good: 60, Caution: 30, Alarm: 10, total: 100 },
        { day: 'Wed', Good: 40, Caution: 40, Alarm: 20, total: 100 },
        { day: 'Thu', Good: 30, Caution: 50, Alarm: 20, total: 100 },
        { day: 'Fri', Good: 50, Caution: 30, Alarm: 20, total: 100 },
        { day: 'Sat', Good: 80, Caution: 15, Alarm: 5, total: 100 },
        { day: 'Sun', Good: 90, Caution: 8, Alarm: 2, total: 100 },
      ];
      setChartData(sampleData);
    }
  }, [data]);
  
  // Convert data to percentage for stacked 100% view
  const percentageData = chartData.map(item => {
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
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#f1f1f1"} />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }}
          tickMargin={10}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`}
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }}
          tickMargin={10}
          label={{ 
            value: "Risk Distribution (%)", 
            angle: -90, 
            position: "insideLeft",
            style: { 
              textAnchor: "middle", 
              fontSize: 12, 
              fill: isDarkMode ? "#ccc" : "#6b7280" 
            }
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
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 border shadow-md rounded-md`}>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{label}</p>
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
          wrapperStyle={{ color: isDarkMode ? "#ccc" : "#333" }}
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
