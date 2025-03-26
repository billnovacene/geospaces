
import React from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Droplet } from "lucide-react";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { useParams, useLocation } from "react-router-dom";
import { DampMoldView } from "@/components/Dashboard/DampMold/DampMoldView";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const DampMoldDashboard = () => {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const location = useLocation();

  console.log("DampMoldDashboard params:", { siteId, zoneId });
  console.log("Current route:", location.pathname);

  // Summary stats for damp and mold conditions
  const summaryStats = [
    { value: "5", label: "Buildings Connected", type: "normal" },
    { value: "46", label: "Zones Monitored", type: "normal" },
    { value: "1", label: "Zones High Risk", type: "high-risk" },
    { value: "3", label: "Zones Caution", type: "caution" },
    { value: "42", label: "Total Zones Normal", type: "success" },
  ];

  return (
    <SidebarWrapper>
      <div className="flex-1 overflow-auto bg-[#F9FAFB] min-h-screen">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="mb-6">
            <div className="flex flex-col mb-2">
              <div className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                <span>Home</span>
                <span>/</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Damp & Mold</h1>
              <p className="text-sm text-gray-500">Damp & Mold</p>
            </div>
          </div>
          
          {/* Summary stats cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {summaryStats.map((stat, index) => (
              <Card key={index} className="border-t-4 border-t-blue-500 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </div>
                  {stat.type === "high-risk" && (
                    <div className="w-full h-1 bg-red-500 mt-2"></div>
                  )}
                  {stat.type === "caution" && (
                    <div className="w-full h-1 bg-amber-400 mt-2"></div>
                  )}
                  {stat.type === "success" && (
                    <div className="w-full h-1 bg-green-500 mt-2"></div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <DampMoldView />
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default DampMoldDashboard;
