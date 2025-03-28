
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/sites";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { SiteHeader } from "@/components/Site/SiteHeader";
import { SiteDetailsCard } from "@/components/Site/SiteDetailsCard";
import { SiteAdditionalInfoCard } from "@/components/Site/SiteAdditionalInfoCard";
import { SiteZonesTabs } from "@/components/Site/SiteZonesTabs";
import { SiteErrorState } from "@/components/Site/SiteErrorState";
import { SiteLoadingSkeleton } from "@/components/Site/SiteLoadingSkeleton";
import { GlobalNavigationHeader } from "@/components/Dashboard/Common/GlobalNavigationHeader";
import { useState } from "react";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const { data: site, isLoading, error, refetch } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });
  
  const handleDateChange = (date: Date) => {
    console.log("Date changed in Site Detail:", date);
    setCurrentDate(date);
    // Refresh data based on date if needed
    refetch();
  };

  if (error) {
    return (
      <SidebarWrapper>
        <SiteErrorState />
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper>
      {/* Global Navigation Header at the top */}
      <GlobalNavigationHeader 
        onDateChange={handleDateChange}
        initialDate={currentDate}
      />
      
      <div className="container mx-auto py-6 px-6">
        {isLoading ? (
          <SiteLoadingSkeleton />
        ) : site ? (
          <>
            <SiteHeader site={site} />
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <SiteDetailsCard site={site} calculatedDeviceCount={null} />
              <SiteAdditionalInfoCard site={site} />
            </div>
            
            <SiteZonesTabs siteId={site.id} />
          </>
        ) : (
          <SiteErrorState />
        )}
      </div>
    </SidebarWrapper>
  );
};

export default SiteDetail;
