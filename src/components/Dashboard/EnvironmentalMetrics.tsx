
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer, Droplets, Wind } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Props for the metric card component
interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  data: Array<{ name: string; value: number }>;
  unit: string;
  isLoading: boolean;
}

// Individual metric card component
const MetricCard = ({ title, value, icon: Icon, color, data, unit, isLoading }: MetricCardProps) => {
  return (
    <Card className="dashboard-card shadow-sm hover:shadow-md transition-all">
      <CardContent className="pt-6 px-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${color} p-2 rounded-lg`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-20" /> : value}
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
              <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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
                  formatter={(value: any) => [`${typeof value === 'number' ? value.toFixed(1) : value} ${unit}`, title]}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill={color.includes('blue') ? '#3b82f6' : 
                        color.includes('orange') ? '#f97316' : 
                        '#10b981'} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Props for the environmental metrics component
interface EnvironmentalMetricsProps {
  averageTemp: number | null;
  averageHumidity: number | null;
  averageCO2: number | null;
  tempData: Array<{ name: string; value: number }>;
  humidityData: Array<{ name: string; value: number }>;
  co2Data: Array<{ name: string; value: number }>;
  isLoading: boolean;
}

export function EnvironmentalMetrics({ 
  averageTemp, 
  averageHumidity, 
  averageCO2, 
  tempData, 
  humidityData, 
  co2Data, 
  isLoading 
}: EnvironmentalMetricsProps) {
  // Define the metrics data
  const metricsData = [
    {
      title: "Avg. Temperature",
      value: averageTemp !== null ? `${averageTemp}°C` : "-",
      icon: Thermometer,
      color: "bg-orange-50 text-orange-600",
      data: tempData,
      unit: "°C",
    },
    {
      title: "Avg. Humidity",
      value: averageHumidity !== null ? `${averageHumidity}%` : "-",
      icon: Droplets,
      color: "bg-blue-50 text-blue-600",
      data: humidityData,
      unit: "%",
    },
    {
      title: "Avg. CO2",
      value: averageCO2 !== null ? `${averageCO2} ppm` : "-",
      icon: Wind,
      color: "bg-emerald-50 text-emerald-600",
      data: co2Data,
      unit: "ppm",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metricsData.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
          data={metric.data}
          unit={metric.unit}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
