
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StatItem } from "@/components/Dashboard/Common/SummaryStats";

export function useDampMoldStats(siteId?: string, zoneId?: string) {
  return useQuery({
    queryKey: ['damp-mold-stats', siteId, zoneId],
    queryFn: async () => {
      try {
        // Fetch total number of sites
        const { data: sites, error: sitesError } = await supabase
          .from('sites')
          .select('id, is_removed')
          .filter('is_removed', 'eq', false);
          
        if (sitesError) throw sitesError;
        
        // Fetch total number of zones
        const { data: zones, error: zonesError } = await supabase
          .from('zones')
          .select('id, is_removed, status')
          .filter('is_removed', 'eq', false);
          
        if (zonesError) throw zonesError;
        
        // Get count of zones with devices
        const { data: zonesWithDevices, error: devicesError } = await supabase
          .from('devices')
          .select('zone_id')
          .filter('is_removed', 'eq', false)
          .not('zone_id', 'is', null);
          
        if (devicesError) throw devicesError;
        
        // Get unique zone IDs with devices
        const uniqueZonesWithDevices = [...new Set(zonesWithDevices.map(device => device.zone_id))];
        
        // Create stats for the dashboard
        const stats: StatItem[] = [
          {
            value: sites.length.toString(),
            label: "Buildings",
            secondaryLabel: "Connected",
            type: "normal",
            key: "buildings"
          },
          {
            value: zones.length.toString(),
            label: "Zones",
            secondaryLabel: "Monitored", 
            type: "normal",
            key: "zones"
          },
          {
            value: "1", // Hardcoded for now until we have actual risk assessment logic
            label: "Zones",
            secondaryLabel: "High Risk",
            type: "high-risk",
            key: "high-risk"
          },
          {
            value: "3", // Hardcoded for now until we have actual risk assessment logic
            label: "Zones",
            secondaryLabel: "Caution",
            type: "caution",
            key: "caution"
          },
          {
            value: (zones.length - 4).toString(), // Subtracting high risk and caution zones
            label: "Zones",
            secondaryLabel: "Normal",
            type: "success",
            key: "normal"
          }
        ];
        
        return {
          stats,
          siteCount: sites.length,
          zoneCount: zones.length,
          zonesWithDevicesCount: uniqueZonesWithDevices.length
        };
      } catch (err) {
        console.error('Failed to fetch damp mold stats:', err);
        toast.error("Failed to fetch dashboard statistics", {
          description: err instanceof Error ? err.message : "Unknown error"
        });
        throw err;
      }
    },
  });
}
