
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchSites } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Cpu, WifiOff, Thermometer, Droplets, Wind, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDevicesCountForSite } from "@/services/devices";

export function StatsCards() {
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // State for aggregated stats
  const [stats, setStats] = useState({
    totalSites: 0,
    totalDevices: 0,
    offlineDevices: 0,
    averageTemp: null,
    averageHumidity: null,
    averageCO2: null,
    motionEvents: 0,
    tempData: [] as any[],
    humidityData: [] as any[],
    co2Data: [] as any[],
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
      const tempData = days.map((day, i) => ({ 
        name: day, 
        value: 21 + Math.random() * 4 
      }));
      
      const humidityData = days.map((day, i) => ({ 
        name: day, 
        value: 40 + Math.random() * 15 
      }));
      
      const co2Data = days.map((day, i) => ({ 
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

  // Define the stat cards
  const mainStats = [
    {
      title: "Total Sites",
      value: stats.totalSites,
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      description: "Facilities being monitored",
    },
    {
      title: "Total Devices",
      value: stats.totalDevices,
      icon: Cpu,
      color: "bg-green-50 text-green-600",
      description: "Connected IoT sensors",
    },
    {
      title: "Offline Devices",
      value: stats.offlineDevices,
      icon: WifiOff,
      color: "bg-amber-50 text-amber-600",
      description: "Requires attention",
    },
    {
      title: "Team Members",
      value: "5",
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      description: "Active users",
    },
  ];

  // Environmental metrics
  const envMetrics = [
    {
      title: "Avg. Temperature",
      value: stats.averageTemp !== null ? `${stats.averageTemp}°C` : "-",
      icon: Thermometer,
      color: "bg-orange-50 text-orange-600",
      data: stats.tempData,
      unit: "°C",
    },
    {
      title: "Avg. Humidity",
      value: stats.averageHumidity !== null ? `${stats.averageHumidity}%` : "-",
      icon: Droplets,
      color: "bg-blue-50 text-blue-600",
      data: stats.humidityData,
      unit: "%",
    },
    {
      title: "Avg. CO2",
      value: stats.averageCO2 !== null ? `${stats.averageCO2} ppm` : "-",
      icon: Wind,
      color: "bg-emerald-50 text-emerald-600",
      data: stats.co2Data,
      unit: "ppm",
    },
  ];

  const isLoading = isLoadingProjects || isLoadingSites;

  return (
    <div className="space-y-8">
      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <Card key={index} className="dashboard-card card-hover shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">{stat.description}</span>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-24" /> : stat.value}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Environmental metrics with small charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {envMetrics.map((metric, index) => (
          <Card key={index} className="dashboard-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 px-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${metric.color} p-2 rounded-lg`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{metric.title}</h3>
                    <p className="text-2xl font-bold">
                      {isLoading ? <Skeleton className="h-8 w-20" /> : metric.value}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mini chart */}
              <div className="h-28 mt-2">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metric.data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        hide={true}
                        domain={['dataMin - 5', 'dataMax + 5']} 
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${typeof value === 'number' ? value.toFixed(1) : value} ${metric.unit}`, metric.title]}
                        contentStyle={{ fontSize: '12px' }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill={metric.color.includes('blue') ? '#3b82f6' : 
                              metric.color.includes('orange') ? '#f97316' : 
                              '#10b981'} 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
