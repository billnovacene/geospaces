
import { StatsData } from "@/services/interfaces/temp-humidity";
import { StatItem } from "@/components/Dashboard/Common/SummaryStats";
import { getTypeFromStatus, getStatusLabel } from "./statusUtils";

/**
 * Creates summary stats array from temperature and humidity data
 */
export function createSummaryStats(data: StatsData | undefined, isLoading: boolean): StatItem[] {
  if (isLoading || !data) {
    return [
      { value: "-", label: "Avg Temp", secondaryLabel: "Loading...", type: "neutral", key: "avgTemp" },
      { value: "-", label: "Min Temp", secondaryLabel: "Loading...", type: "neutral", key: "minTemp" },
      { value: "-", label: "Max Temp", secondaryLabel: "Loading...", type: "neutral", key: "maxTemp" },
      { value: "-", label: "Avg Humidity", secondaryLabel: "Loading...", type: "neutral", key: "avgHumidity" },
      { value: "-", label: "Sensors", secondaryLabel: "Loading...", type: "neutral", key: "sensors" }
    ];
  }
  
  // Real data
  return [
    { 
      value: data.avgTemp.toFixed(1) + "°C", 
      label: "Avg Temp", 
      secondaryLabel: getStatusLabel(data.status.avgTemp), 
      type: getTypeFromStatus(data.status.avgTemp), 
      key: "avgTemp" 
    },
    { 
      value: data.minTemp.toFixed(1) + "°C", 
      label: "Min Temp", 
      secondaryLabel: getStatusLabel(data.status.minTemp), 
      type: getTypeFromStatus(data.status.minTemp), 
      key: "minTemp" 
    },
    { 
      value: data.maxTemp.toFixed(1) + "°C", 
      label: "Max Temp", 
      secondaryLabel: getStatusLabel(data.status.maxTemp), 
      type: getTypeFromStatus(data.status.maxTemp), 
      key: "maxTemp" 
    },
    { 
      value: Math.round(data.avgHumidity) + "%", 
      label: "Avg Humidity", 
      secondaryLabel: getStatusLabel(data.status.avgHumidity), 
      type: getTypeFromStatus(data.status.avgHumidity), 
      key: "avgHumidity" 
    },
    { 
      value: data.activeSensors.toString(), 
      label: "Sensors", 
      secondaryLabel: "Active", 
      type: "normal", 
      key: "sensors" 
    }
  ];
}
