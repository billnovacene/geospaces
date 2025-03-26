
import React from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Droplet } from "lucide-react";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { useParams, useLocation } from "react-router-dom";
import { DampMoldView } from "@/components/Dashboard/DampMold/DampMoldView";
import { Separator } from "@/components/ui/separator";

const DampMoldDashboard = () => {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const location = useLocation();

  console.log("DampMoldDashboard params:", { siteId, zoneId });
  console.log("Current route:", location.pathname);

  return (
    <SidebarWrapper>
      <div className="flex-1 overflow-auto bg-[#F9FAFB] min-h-screen">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <DampMoldView />
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default DampMoldDashboard;
