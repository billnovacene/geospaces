
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

interface ScatterChartConfigProps {
  chartData: any[];
  xAxisKey: string;
}

// Calculate a risk score based on temperature and humidity
const calculateRiskScore = (temperature: number, humidity: number): number => {
  // Basic algorithm: higher risk when temp is low and humidity is high
  // Risk increases exponentially as humidity exceeds 65% and temperature falls below 15°C
  let score = 0;
  
  // Humidity factor (higher humidity = higher risk)
  if (humidity > 75) {
    score += 3; // High risk
  } else if (humidity > 65) {
    score += 2; // Medium risk
  } else if (humidity > 55) {
    score += 1; // Low risk
  }
  
  // Temperature factor (lower temp with high humidity = higher risk)
  if (temperature < 12) {
    score += 3; // High risk
  } else if (temperature < 15) {
    score += 2; // Medium risk
  } else if (temperature < 18) {
    score += 1; // Low risk  
  }
  
  return score;
};

// Get the color based on risk score
const getRiskColor = (score: number): string => {
  if (score >= 4) return "#ef4444"; // Red - high risk
  if (score >= 2) return "#f97316"; // Amber - medium risk
  return "#10b981"; // Green - low risk
};

// Convert the chartData into scatter data format
const prepareScatterData = (data: any[], xAxisKey: string) => {
  return data.map(item => {
    const riskScore = calculateRiskScore(item.temperature, item.humidity);
    return {
      x: item[xAxisKey], // Time point (hour or day)
      y: item.humidity,  // Y-axis: humidity
      z: item.temperature, // Z-axis (size): temperature
      riskScore,
      temp: item.temperature,
      hum: item.humidity,
      color: getRiskColor(riskScore)
    };
  });
};

export function ScatterChartConfig({ 
  chartData, 
  xAxisKey 
}: ScatterChartConfigProps) {
  const scatterData = prepareScatterData(chartData, xAxisKey);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
        <XAxis 
          dataKey="x" 
          name={xAxisKey === "hour" ? "Hour" : "Day"}
          tick={{ fontSize: 12 }} 
          tickMargin={10}
        />
        <YAxis 
          dataKey="y" 
          name="Humidity"
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
              const riskLabels = ["Low Risk", "Moderate Risk", "High Risk"];
              const riskIndex = data.riskScore >= 4 ? 2 : data.riskScore >= 2 ? 1 : 0;
              
              return (
                <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
                  <p className="text-sm font-medium">{data.x}</p>
                  <p className="text-xs">Temperature: {data.temp}°C</p>
                  <p className="text-xs">Humidity: {data.hum}%</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: data.color }}>
                    {riskLabels[riskIndex]}
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
            { value: 'Low Risk', type: 'circle', color: '#10b981' },
            { value: 'Moderate Risk', type: 'circle', color: '#f97316' },
            { value: 'High Risk', type: 'circle', color: '#ef4444' }
          ]}
        />
        <ReferenceLine 
          y={75} 
          stroke="#ef4444" 
          strokeDasharray="3 3" 
          label={{ 
            value: "Humidity Risk Threshold", 
            position: "insideBottomRight", 
            fill: "#ef4444", 
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
