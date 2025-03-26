
import React from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Droplet } from "lucide-react";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { useParams, useLocation } from "react-router-dom";
import { DampMoldView } from "@/components/Dashboard/DampMold/DampMoldView";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { SummaryStats } from "@/components/Dashboard/DampMold/SummaryStats";

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
              
              {/* Summary stats displayed via the new component */}
              <SummaryStats stats={summaryStats} />
            </div>
          </div>

          <DampMoldView />
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default DampMoldDashboard;
