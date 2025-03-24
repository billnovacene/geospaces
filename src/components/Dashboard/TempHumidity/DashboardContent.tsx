
import { Card, CardContent } from "@/components/ui/card";
import { TemperatureGuide } from "@/components/Dashboard/TempHumidity/TemperatureGuide";
import { MonthlyChart } from "@/components/Dashboard/TempHumidity/MonthlyChart";
import { DailyChart } from "@/components/Dashboard/TempHumidity/DailyChart";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface DashboardContentProps {
  data: {
    daily: any[];
    monthly: any[];
  };
}

export function DashboardContent({ data }: DashboardContentProps) {
  return (
    <>
      {/* Temperature Guide */}
      <div className="mb-8">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <TemperatureGuide />
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <div className="mb-8">
        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-4 gap-8">
              <div className="col-span-1 flex flex-col justify-end">
                <h2 className="text-xl font-medium mb-4">Monthly Overview</h2>
                <p className="text-sm text-gray-600">
                  The last 30 days show peak temps around 21-23°C with minimums
                  near 8-9°C. Early morning and late evening periods typically
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
        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-4 gap-8">
              <div className="col-span-1 flex flex-col justify-end">
                <h2 className="text-xl font-medium mb-4">Daily Overview</h2>
                <p className="text-sm text-gray-600">
                  Temps range from ~8°C early to ~22°C peak, with humidity near 47%.
                  The building warms quickly and stays fairly stable during working hours.
                </p>
              </div>
              
              <div className="col-span-3">
                <div className="flex justify-end gap-2 mb-4">
                  <Button variant="outline" className="h-8">
                    1st March <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="h-8">
                    Days <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-end gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-[#10B981]"></div>
                    <span className="text-xs">Green</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-[#F59E0B]"></div>
                    <span className="text-xs">Amber</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-[#EF4444]"></div>
                    <span className="text-xs">Red</span>
                  </div>
                </div>
                
                <DailyChart data={data.daily} />
                
                <div className="flex justify-between items-center pt-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4 mr-1" /> 15th Dec
                    </Button>
                    <Button variant="outline" size="sm">
                      16th Dec <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    06:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 18:00
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
