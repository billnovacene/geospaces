
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/api";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { SiteHeader } from "@/components/Site/SiteHeader";
import { SiteDetailsCard } from "@/components/Site/SiteDetailsCard";
import { SiteAdditionalInfoCard } from "@/components/Site/SiteAdditionalInfoCard";
import { SiteZonesTabs } from "@/components/Site/SiteZonesTabs";
import { SiteLoadingSkeleton } from "@/components/Site/SiteLoadingSkeleton";
import { SiteErrorState } from "@/components/Site/SiteErrorState";
import { siteDevicesCache } from "@/services/sites";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  
  const { data: site, isLoading, error } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  console.log("Site data in SiteDetail:", site);
  console.log("Cached device count for this site:", site?.id ? siteDevicesCache[site.id] : "No cache");

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        {isLoading ? (
          <SiteLoadingSkeleton />
        ) : error || !site ? (
          <SiteErrorState />
        ) : (
          <>
            <SiteHeader site={site} />

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <SiteDetailsCard site={site} />
              <SiteAdditionalInfoCard site={site} />
            </div>

            {/* Zones Tabs */}
            <SiteZonesTabs siteId={site.id} />
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default SiteDetail;
