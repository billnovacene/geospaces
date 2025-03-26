
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, AlertCircle, ThermometerSun, Humidity } from "lucide-react";

interface DampMoldStatsProps {
  data: any;
}

export function DampMoldStats({ data }: DampMoldStatsProps) {
  // Extract relevant data or use defaults
  const avgHumidity = data?.stats?.averageHumidity || 65.3;
  const maxHumidity = data?.stats?.maxHumidity || 82.7;
  const avgTemp = data?.stats?.averageTemperature || 18.4;
  const riskHours = data?.riskHours || 4.5;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Avg. Humidity</div>
            <div className="flex items-center">
              <Humidity className="h-4 w-4 text-blue-500 mr-1.5" />
              <span className="text-lg font-semibold">{avgHumidity.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Max Humidity</div>
            <div className="flex items-center">
              <Droplet className="h-4 w-4 text-blue-700 mr-1.5" />
              <span className="text-lg font-semibold">{maxHumidity.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Avg. Temperature</div>
            <div className="flex items-center">
              <ThermometerSun className="h-4 w-4 text-orange-500 mr-1.5" />
              <span className="text-lg font-semibold">{avgTemp.toFixed(1)}°C</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Risk Hours</div>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-1.5" />
              <span className="text-lg font-semibold">{riskHours}h</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {riskHours > 6 ? (
              <span className="text-red-600 font-medium">High risk conditions detected. Ventilation recommended.</span>
            ) : riskHours > 2 ? (
              <span className="text-yellow-600 font-medium">Moderate risk conditions. Monitor closely.</span>
            ) : (
              <span className="text-green-600 font-medium">Conditions are currently within safe parameters.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
