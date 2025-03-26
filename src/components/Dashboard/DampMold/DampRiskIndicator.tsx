
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropletIcon } from "lucide-react";

interface DampRiskIndicatorProps {
  data: any;
}

export function DampRiskIndicator({ data }: DampRiskIndicatorProps) {
  // Calculate a risk score based on temperature and humidity
  // This is a simplified model - real-world calculations would be more complex
  const riskScore = data?.riskScore || 32; // Mock value if no data
  
  // Determine risk level and styling based on score
  let riskLevel = "Low";
  let riskColor = "bg-green-500";
  let textColor = "text-green-700";
  
  if (riskScore > 70) {
    riskLevel = "Severe";
    riskColor = "bg-red-500";
    textColor = "text-red-700";
  } else if (riskScore > 50) {
    riskLevel = "High";
    riskColor = "bg-orange-400";
    textColor = "text-orange-700";
  } else if (riskScore > 30) {
    riskLevel = "Moderate";
    riskColor = "bg-yellow-400";
    textColor = "text-yellow-700";
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Damp Risk Level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 rounded-full border-8 border-gray-100 mb-3">
            <div 
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ 
                background: `conic-gradient(${riskColor} ${riskScore}%, #f3f4f6 0)` 
              }}
            >
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <DropletIcon className={`h-10 w-10 ${textColor}`} />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${textColor}`}>
              {riskLevel}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {riskScore}% risk factor
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-600">
            Based on temperature, humidity, and dew point measurements
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
