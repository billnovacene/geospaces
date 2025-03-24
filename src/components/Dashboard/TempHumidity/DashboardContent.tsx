
import { Card, CardContent } from "@/components/ui/card";
import { TemperatureGuide } from "@/components/Dashboard/TempHumidity/TemperatureGuide";
import { MonthlyChart } from "@/components/Dashboard/TempHumidity/MonthlyChart";
import { DailyChart } from "@/components/Dashboard/TempHumidity/DailyChart";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";

interface DashboardContentProps {
  data: {
    daily: any[];
    monthly: MonthlyOverviewPoint[];
    stats: any;
  };
}

export function DashboardContent({ data }: DashboardContentProps) {
  // Calculate the min/max temperatures from monthly data
  const calculateMonthlyStats = () => {
    if (!data.monthly || data.monthly.length === 0) {
      return { minTemp: 0, maxTemp: 0 };
    }
    
    const minTemps = data.monthly.map(point => point.minTemp);
    const maxTemps = data.monthly.map(point => point.maxTemp);
    
    return {
      minTemp: Math.min(...minTemps).toFixed(1),
      maxTemp: Math.max(...maxTemps).toFixed(1)
    };
  };
  
  const { minTemp, maxTemp } = calculateMonthlyStats();
  
  // Calculate the daily min/max temperatures
  const calculateDailyStats = () => {
    if (!data.daily || data.daily.length === 0) {
      return { minTemp: 0, maxTemp: 0 };
    }
    
    const temps = data.daily.map(point => point.temperature);
    
    return {
      minTemp: Math.min(...temps).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1)
    };
  };
  
  const dailyStats = calculateDailyStats();

  return (
    <>
      {/* Temperature Guide */}
      <div className="mb-8">
        <Card className="shadow-sm border-0">
          <CardContent className="p-6">
            <TemperatureGuide />
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <div className="mb-8">
        <Card className="shadow-sm border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-4 gap-8 items-center">
              <div className="col-span-1">
                <h2 className="text-xl font-medium mb-4">Monthly Overview</h2>
                <p className="text-sm text-gray-600">
                  The last 30 days show peak temps around {maxTemp}°C with minimums
                  near {minTemp}°C. Early morning and late evening periods typically
                  show the largest temperature variations.
                </p>
              </div>
              <div className="col-span-3">
                <MonthlyChart data={data.monthly} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Overview */}
      <div className="mb-8">
        <Card className="shadow-sm border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-4 gap-8 items-center">
              <div className="col-span-1">
                <h2 className="text-xl font-medium mb-4">Daily Overview</h2>
                <p className="text-sm text-gray-600">
                  Today's temperatures range from {dailyStats.minTemp}°C to {dailyStats.maxTemp}°C.
                  The building warms quickly and stays fairly stable during working hours.
                </p>
              </div>
              
              <div className="col-span-3">
                <DailyChart data={data.daily} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
