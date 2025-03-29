
import React from "react";
import { TempHumidityStats } from "@/components/Dashboard/TempHumidity/TempHumidityStats";
import { StatsData } from "@/services/interfaces/temp-humidity";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsSectionProps {
  stats?: StatsData; // Make stats optional to match the interface
  isLoading: boolean;
  loadingStage?: 'initial' | 'daily' | 'stats' | 'monthly' | 'complete';
}

export function DashboardStatsSection({ 
  stats, 
  isLoading, 
  loadingStage = 'complete' 
}: DashboardStatsSectionProps) {
  // Create default stats if not provided
  const defaultStats: StatsData = {
    avgTemp: 0,
    minTemp: 0,
    maxTemp: 0,
    avgHumidity: 0,
    activeSensors: 0,
    status: {
      avgTemp: 'good',
      minTemp: 'good',
      maxTemp: 'good',
      avgHumidity: 'good'
    }
  };

  // Loading state with skeleton
  if (isLoading || !stats || loadingStage === 'initial' || loadingStage === 'daily') {
    return (
      <div className="space-y-4 mb-6">
        <Skeleton className="h-[150px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      <TempHumidityStats stats={stats || defaultStats} isLoading={loadingStage !== 'complete'} />
    </div>
  );
}
