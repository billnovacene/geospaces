
import React from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Humidity, Droplet } from "lucide-react";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { useParams, useLocation } from "react-router-dom";
import { DampMoldView } from "@/components/Dashboard/DampMold/DampMoldView";
import { Separator } from "@/components/ui/separator";

const DampMoldDashboard = () => {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const location = useLocation();

  const contextType = zoneId ? "zone" : siteId ? "site" : "all";
  const contextId = zoneId || siteId || null;

  return (
    <SidebarWrapper>
      <DashboardSidebar />
      <div className="flex-1 overflow-auto bg-[#F9FAFB] min-h-screen">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-100">
                <Droplet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Damp & Mold Dashboard</h1>
                <p className="text-gray-500">
                  Monitor damp conditions and potential mold risk in your spaces
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <DampMoldView 
            contextType={contextType}
            contextId={contextId}
            siteId={siteId}
            zoneId={zoneId}
          />
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default DampMoldDashboard;
