
import { useQuery } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon, Thermometer, Droplets, LineChart, BarChart3, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/Dashboard/TempHumidity/StatCard";
import { TemperatureGuide } from "@/components/Dashboard/TempHumidity/TemperatureGuide";
import { MonthlyChart } from "@/components/Dashboard/TempHumidity/MonthlyChart";
import { DailyChart } from "@/components/Dashboard/TempHumidity/DailyChart";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8">
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
                  <Link to="/project/145">Zircon</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All zones</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-3xl font-normal text-gray-800 mb-6 flex items-center">
          <Thermometer className="mr-2 h-6 w-6 text-gray-700" />
          <span>Temperature & Humidity</span>
        </h1>

        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-10 w-20 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-4 w-16 mx-auto mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-[400px] col-span-2" />
              <Skeleton className="h-[400px]" />
            </div>
            <Skeleton className="h-[400px] mb-8" />
          </>
        ) : error ? (
          <div className="text-center p-8 border rounded-lg bg-red-50 text-red-800">
            <p>Error loading temperature and humidity data. Please try again later.</p>
          </div>
        ) : data ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                title="Avg Temp Work"
                value={data.stats.avgTemp}
                unit="°C"
                status={data.stats.status.avgTemp}
              />
              <StatCard
                title="Avg Temp Work"
                value={data.stats.avgTemp}
                unit="°C"
                status={data.stats.status.avgTemp}
              />
              <StatCard
                title="Avg RH% Work"
                value={Math.round(data.stats.avgHumidity)}
                unit="%"
                status={data.stats.status.avgHumidity}
              />
              <StatCard
                title="Min temp"
                value={data.stats.minTemp}
                unit="°C"
                status={data.stats.status.minTemp}
              />
              <StatCard
                title="Max Temp"
                value={data.stats.maxTemp}
                unit="°C"
                status={data.stats.status.maxTemp}
              />
            </div>

            {/* Temperature Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <TemperatureGuide />
            </div>

            {/* Monthly Overview */}
            <MonthlyChart data={data.monthly} />

            {/* Daily Overview */}
            <div className="mt-8">
              <DailyChart data={data.daily} />
            </div>
          </>
        ) : null}
      </div>
    </SidebarWrapper>
  );
}
