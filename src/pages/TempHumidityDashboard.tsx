
import { useQuery } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon, Thermometer, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/Dashboard/TempHumidity/StatCard";
import { TemperatureGuide } from "@/components/Dashboard/TempHumidity/TemperatureGuide";
import { MonthlyChart } from "@/components/Dashboard/TempHumidity/MonthlyChart";
import { DailyChart } from "@/components/Dashboard/TempHumidity/DailyChart";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function TempHumidityDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["temp-humidity-data"],
    queryFn: fetchTempHumidityData,
  });

  // Log data for debugging
  useEffect(() => {
    if (data) {
      console.log("Temperature and humidity data:", data);
    }
  }, [data]);

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <HomeIcon className="h-3.5 w-3.5" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/project/145">Project</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/site/145">Site</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/zone/145">Parent</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/zone/146">Zone</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All zones</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-normal text-gray-800 flex items-center">
            <Thermometer className="mr-2 h-6 w-6 text-gray-700" />
            <span>Temperature & Humidity</span>
          </h1>
          
          {!isLoading && !error && data && (
            <div className="grid grid-cols-5 gap-8">
              <StatCard
                title="Avg Temp Work"
                value={data.stats.avgTemp}
                unit="°C"
                status={data.stats.status.avgTemp}
                large
              />
              <StatCard
                title="Avg Temp Work"
                value={data.stats.avgTemp}
                unit="°C"
                status={data.stats.status.avgTemp}
                large
              />
              <StatCard
                title="Avg RH% Work"
                value={Math.round(data.stats.avgHumidity)}
                unit="RH%"
                status={data.stats.status.avgHumidity}
                large
              />
              <StatCard
                title="Min temp"
                value={data.stats.minTemp}
                unit="°C"
                status={data.stats.status.minTemp}
                large
              />
              <StatCard
                title="Max Temp"
                value={data.stats.maxTemp}
                unit="°C"
                status={data.stats.status.maxTemp}
                large
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <>
            <div className="grid gap-8 mb-8">
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
            </div>
          </>
        ) : error ? (
          <div className="text-center p-8 border rounded-lg bg-red-50 text-red-800">
            <p>Error loading temperature and humidity data. Please try again later.</p>
          </div>
        ) : data ? (
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
                <CardContent className="p-6">
                  <MonthlyChart data={data.monthly} />
                </CardContent>
              </Card>
            </div>

            {/* Daily Overview */}
            <div className="mb-8">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-1/3">
                        <h2 className="text-xl font-medium">Daily Overview</h2>
                        <p className="mt-4 text-sm text-gray-600">
                          Temps range from ~8°C early to ~22°C peak, with humidity near 47%.
                          The building warms quickly and stays fairly stable during working hours.
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="h-8">
                          1st March <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8">
                          Days <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-6">
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
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </SidebarWrapper>
  );
}
