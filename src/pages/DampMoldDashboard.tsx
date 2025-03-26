
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
          {/* Header section with title and stats */}
          <div className="mb-6">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Damp & Mold</h1>
                <p className="text-sm text-gray-500">Damp & Mold</p>
              </div>
              
              {/* Summary stats cards in a row */}
              <div className="hidden md:flex space-x-4">
                {summaryStats.map((stat, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {stat.label.split(' ').map((word, i) => (
                        <span key={i} className="block leading-tight">{word}</span>
                      ))}
                    </div>
                    {stat.type === "high-risk" && (
                      <div className="w-full h-1 bg-red-500"></div>
                    )}
                    {stat.type === "caution" && (
                      <div className="w-full h-1 bg-amber-400"></div>
                    )}
                    {stat.type === "success" && (
                      <div className="w-full h-1 bg-green-500"></div>
                    )}
                    {stat.type === "normal" && (
                      <div className="w-full h-1 bg-blue-500"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile view for stats - only show on small screens */}
          <div className="grid grid-cols-5 gap-4 mb-8 md:hidden mx-auto w-3/4">
            {summaryStats.map((stat, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <div className="text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mb-1 flex flex-col">
                  {stat.label.split(' ').map((word, i) => (
                    <span key={i}>{word}</span>
                  ))}
                </div>
                {stat.type === "high-risk" && (
                  <div className="w-16 h-1 bg-red-500"></div>
                )}
                {stat.type === "caution" && (
                  <div className="w-16 h-1 bg-amber-400"></div>
                )}
                {stat.type === "success" && (
                  <div className="w-16 h-1 bg-green-500"></div>
                )}
                {stat.type === "normal" && (
                  <div className="w-16 h-1 bg-blue-500"></div>
                )}
              </div>
            ))}
          </div>

          <DampMoldView />
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default DampMoldDashboard;
