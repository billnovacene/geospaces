import React from "react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  ZAxis,
  Cell
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";
import { calculateMoldRiskScore, assessMoldRisk } from "@/services/damp-mold/risk-assessment";

interface ScatterChartConfigProps {
  chartData: any[];
  xAxisKey: string;
}

// Get the color based on risk assessment
const getRiskColor = (riskLevel: string): string => {
  switch(riskLevel) {
    case 'Alarm': return "#ef4444"; // Red - high risk
    case 'Caution': return "#f97316"; // Amber - medium risk
    default: return "#10b981"; // Green - low risk
  }
};

// Convert the chartData into scatter data format
const prepareScatterData = (data: any[], xAxisKey: string) => {
  return data.map(item => {
    const riskLevel = assessMoldRisk(item.temperature, item.humidity);
    const riskScore = calculateMoldRiskScore(item.temperature, item.humidity);
    
    return {
      x: item[xAxisKey], // Time point (hour or day)
      y: item.humidity,  // Y-axis: humidity
      z: item.temperature, // Z-axis (size): temperature
      riskScore,
      riskLevel,
      temp: item.temperature,
      hum: item.humidity,
      color: getRiskColor(riskLevel)
    };
  });
};

export function ScatterChartConfig({ 
  chartData, 
  xAxisKey 
}: ScatterChartConfigProps) {
  const scatterData = prepareScatterData(chartData, xAxisKey);
  const { activeTheme } = useTheme();
  const isDarkMode = activeTheme === "dark";
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#f1f1f1"} />
        <XAxis 
          dataKey="x" 
          name={xAxisKey === "hour" ? "Hour" : "Day"}
          tick={{ fontSize: 12, fill: isDarkMode ? "#ccc" : "#666" }} 
          tickMargin={10}
        />
        <YAxis 
          dataKey="y" 
          name="Humidity"
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
        <ZAxis 
          dataKey="z" 
          range={[50, 400]} 
          name="Temperature" 
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name) => {
            if (name === "Humidity") return [`${value}%`, name];
            if (name === "Temperature") return [`${value}°C`, name];
            if (name === "Hour" || name === "Day") return [value, name];
            return [value, name];
          }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'} p-2 border shadow-sm rounded-md`}>
                  <p className="text-sm font-medium">{data.x}</p>
                  <p className="text-xs">Temperature: {data.temp}°C</p>
                  <p className="text-xs">Humidity: {data.hum}%</p>
                  <p className="text-xs">Risk Score: {data.riskScore}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: data.color }}>
                    {data.riskLevel}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          payload={[
            { value: 'Good (<60% RH)', type: 'circle', color: '#10b981' },
            { value: 'Caution (60-69% RH)', type: 'circle', color: '#f97316' },
            { value: 'Alarm (≥70% RH or 60%+ with <16°C)', type: 'circle', color: '#ef4444' }
          ]}
          wrapperStyle={{ color: isDarkMode ? "#ccc" : "#333" }}
        />
        {/* High humidity threshold line at 70% */}
        <ReferenceLine 
          y={70} 
          stroke="#ef4444" 
          strokeDasharray="3 3" 
          label={{ 
            value: "Alarm Threshold (70%)", 
            position: "insideBottomRight", 
            fill: isDarkMode ? "#f87171" : "#ef4444", 
            fontSize: 12 
          }} 
        />
        {/* Caution humidity threshold line at 60% */}
        <ReferenceLine 
          y={60} 
          stroke="#f97316" 
          strokeDasharray="3 3" 
          label={{ 
            value: "Caution Threshold (60%)", 
            position: "insideTopRight", 
            fill: isDarkMode ? "#fb923c" : "#f97316", 
            fontSize: 12 
          }} 
        />
        <Scatter name="Measurements" data={scatterData} fill="#8884d8">
          {scatterData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
