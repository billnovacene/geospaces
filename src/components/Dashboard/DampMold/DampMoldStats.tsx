
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, AlertCircle, ThermometerSun, CloudRain } from "lucide-react";

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
    <Card className="bg-gradient-to-br from-green-50 to-white border border-green-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-green-800 text-right">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-end">
            <div className="text-xs text-green-700 mb-1 font-medium">Avg. Humidity</div>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-green-800">{avgHumidity.toFixed(1)}%</span>
              <CloudRain className="h-4 w-4 text-green-600 ml-1.5" />
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xs text-green-700 mb-1 font-medium">Max Humidity</div>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-green-800">{maxHumidity.toFixed(1)}%</span>
              <Droplet className="h-4 w-4 text-green-600 ml-1.5" />
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xs text-green-700 mb-1 font-medium">Avg. Temperature</div>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-green-800">{avgTemp.toFixed(1)}°C</span>
              <ThermometerSun className="h-4 w-4 text-green-600 ml-1.5" />
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xs text-green-700 mb-1 font-medium">Risk Hours</div>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-green-800">{riskHours}h</span>
              <AlertCircle className="h-4 w-4 text-green-600 ml-1.5" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-green-100">
          <div className="text-xs text-green-700 text-right">
            {riskHours > 6 ? (
              <span className="text-red-600 font-medium">High risk conditions detected. Ventilation recommended.</span>
            ) : riskHours > 2 ? (
              <span className="text-amber-600 font-medium">Moderate risk conditions. Monitor closely.</span>
            ) : (
              <span className="text-green-600 font-medium">Conditions are currently within safe parameters.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
