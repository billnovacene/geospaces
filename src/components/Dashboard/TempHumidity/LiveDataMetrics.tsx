
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, RefreshCw } from "lucide-react";
import { getSensorValueColor } from "@/utils/sensorThresholds";

type LiveReadingType = {
  temperature: number;
  humidity: number;
  timestamp: string;
};

export function LiveDataMetrics() {
  const [liveData, setLiveData] = useState<LiveReadingType | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Function to generate random live data
    const generateLiveData = () => {
      const now = new Date();
      return {
        temperature: Math.round((15 + Math.random() * 10) * 10) / 10,
        humidity: Math.round(40 + Math.random() * 20),
        timestamp: now.toISOString()
      };
    };

    // Initial data
    setLiveData(generateLiveData());

    // Update data every 5 seconds if live mode is on
    let interval: number | null = null;
    if (isLive) {
      interval = window.setInterval(() => {
        setLiveData(generateLiveData());
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  if (!liveData) return null;

  const tempColor = getSensorValueColor("temperature", liveData.temperature);
  const humidityColor = getSensorValueColor("humidity", liveData.humidity);

  return (
    <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-2 pt-2 flex justify-between items-center">
          <span className="text-sm font-medium">Live Reading</span>
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
              {liveData.temperature}°C
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets size={18} style={{ color: humidityColor }} />
            <span className="text-lg font-medium" style={{ color: humidityColor }}>
              {liveData.humidity}%
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            {new Date(liveData.timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-green-400" />
      </CardContent>
    </Card>
  );
}
