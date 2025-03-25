
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Cloud, RefreshCw } from "lucide-react";
import { getSensorValueColor } from "@/utils/sensorThresholds";

type WeatherDataType = {
  temperature: number;
  condition: string;
  timestamp: string;
};

export function LiveDataMetrics() {
  const [weatherData, setWeatherData] = useState<WeatherDataType | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Function to generate weather data
    // In a real implementation, this would fetch from a weather API based on location
    const generateWeatherData = () => {
      const now = new Date();
      return {
        temperature: Math.round((10 + Math.random() * 15) * 10) / 10, // Outdoor temps are typically cooler
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        timestamp: now.toISOString()
      };
    };

    // Initial data
    setWeatherData(generateWeatherData());

    // Update data every 5 seconds if live mode is on
    let interval: number | null = null;
    if (isLive) {
      interval = window.setInterval(() => {
        setWeatherData(generateWeatherData());
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  if (!weatherData) return null;

  const tempColor = getSensorValueColor("temperature", weatherData.temperature);

  return (
    <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-2 pt-2 flex justify-between items-center">
          <span className="text-sm font-medium">Outside Temp</span>
          <Badge 
            variant={isLive ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? "LIVE" : "PAUSED"}
          </Badge>
        </div>
        
        <div className="px-2 py-3 flex-grow flex flex-col gap-3 items-center justify-center">
          <div className="flex items-center gap-2">
            <Thermometer size={18} style={{ color: tempColor }} />
            <span className="text-lg font-medium" style={{ color: tempColor }}>
              {weatherData.temperature}°C
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Cloud size={18} />
            <span className="text-sm">
              {weatherData.condition}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            {new Date(weatherData.timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-green-400" />
      </CardContent>
    </Card>
  );
}
