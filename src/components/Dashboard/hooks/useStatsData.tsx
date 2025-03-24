
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchSites } from "@/services/api";

// Define the types for our stats data
export interface StatsData {
  totalSites: number;
  totalDevices: number;
  offlineDevices: number;
  averageTemp: number | null;
  averageHumidity: number | null;
  averageCO2: number | null;
  motionEvents: number;
  tempData: Array<{ name: string; value: number }>;
  humidityData: Array<{ name: string; value: number }>;
  co2Data: Array<{ name: string; value: number }>;
}

export function useStatsData() {
  // Query for projects data
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // State for aggregated stats
  const [stats, setStats] = useState<StatsData>({
    totalSites: 0,
    totalDevices: 0,
    offlineDevices: 0,
    averageTemp: null,
    averageHumidity: null,
    averageCO2: null,
    motionEvents: 0,
    tempData: [],
    humidityData: [],
    co2Data: [],
  });

  // We'll need all sites data to calculate metrics
  const { data: allSites = [], isLoading: isLoadingSites } = useQuery({
    queryKey: ["all-sites"],
    queryFn: async () => {
      // Get all projects, then fetch sites for each project
      const allProjectSites = [];
      for (const project of projects) {
        const sites = await fetchSites(project.id);
        allProjectSites.push(...sites);
      }
      return allProjectSites;
    },
    enabled: projects.length > 0,
  });

  // Calculate derived statistics
  useEffect(() => {
    const calculateStats = async () => {
      if (allSites.length === 0) return;

      let totalDevicesCount = 0;
      let offlineDevicesCount = 0;

      // For each site, count devices
      for (const site of allSites) {
        if (site.devices) {
          const deviceCount = typeof site.devices === 'number' ? site.devices : parseInt(String(site.devices), 10) || 0;
          totalDevicesCount += deviceCount;
        }
      }

      // For demo purposes, set offline devices to approximately 10% of total
      offlineDevicesCount = Math.floor(totalDevicesCount * 0.1);

      // Sample data for environmental metrics (in a real app, this would come from API)
      // Generate random but realistic sample data for last 7 days
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const tempData = days.map((day) => ({ 
        name: day, 
        value: 21 + Math.random() * 4 
      }));
      
      const humidityData = days.map((day) => ({ 
        name: day, 
        value: 40 + Math.random() * 15 
      }));
      
      const co2Data = days.map((day) => ({ 
        name: day, 
        value: 400 + Math.random() * 200 
      }));

      // Calculate averages
      const avgTemp = Number((tempData.reduce((acc, item) => acc + item.value, 0) / tempData.length).toFixed(1));
      const avgHumidity = Number((humidityData.reduce((acc, item) => acc + item.value, 0) / humidityData.length).toFixed(1));
      const avgCO2 = Number((co2Data.reduce((acc, item) => acc + item.value, 0) / co2Data.length).toFixed(0));

      setStats({
        totalSites: allSites.length,
        totalDevices: totalDevicesCount,
        offlineDevices: offlineDevicesCount,
        averageTemp: avgTemp,
        averageHumidity: avgHumidity,
        averageCO2: avgCO2,
        motionEvents: Math.floor(Math.random() * 120),
        tempData,
        humidityData,
        co2Data,
      });
    };

    calculateStats();
  }, [allSites]);

  const isLoading = isLoadingProjects || isLoadingSites;

  return { stats, isLoading };
}
