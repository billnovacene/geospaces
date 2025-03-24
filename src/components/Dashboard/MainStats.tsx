
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Cpu, WifiOff, Users } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  description: string;
  isLoading: boolean;
}

// Individual stat card component
const StatCard = ({ title, value, icon: Icon, color, description, isLoading }: StatCardProps) => {
  return (
    <Card className="dashboard-card card-hover shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <span className="text-sm font-medium text-muted-foreground">{description}</span>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-24" /> : value}
          </h3>
          <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Props for the main stats component
interface MainStatsProps {
  totalSites: number;
  totalDevices: number;
  offlineDevices: number;
  isLoading: boolean;
}

export function MainStats({ totalSites, totalDevices, offlineDevices, isLoading }: MainStatsProps) {
  // Define the stat cards data
  const statsData = [
    {
      title: "Total Sites",
      value: totalSites,
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      description: "Facilities being monitored",
    },
    {
      title: "Total Devices",
      value: totalDevices,
      icon: Cpu,
      color: "bg-green-50 text-green-600",
      description: "Connected IoT sensors",
    },
    {
      title: "Offline Devices",
      value: offlineDevices,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          description={stat.description}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
