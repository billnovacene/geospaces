import { useEffect, useState } from "react";
import { Building } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Site } from "@/services/interfaces";
import { fetchDevicesCountForSite } from "@/services/device-sites";

interface SiteListItemProps {
  site: Site;
  isActive: boolean;
}

export function SiteListItem({ site, isActive }: SiteListItemProps) {
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  
  useEffect(() => {
    // Use the initial count while we fetch the accurate count
    const initialCount = typeof site.devices === 'number' ? site.devices : 0;
    setDeviceCount(initialCount);
    
    // Fetch the accurate device count from the API
    const fetchDeviceCount = async () => {
      try {
        console.log(`Fetching device count for site ${site.id}...`);
        const count = await fetchDevicesCountForSite(site.id);
        console.log(`Device count for site ${site.id}: ${count}`);
        setDeviceCount(count);
      } catch (error) {
        console.error(`Error fetching device count for site ${site.id}:`, error);
        // Keep the initial count if there's an error
      }
    };
    
    fetchDeviceCount();
  }, [site.id, site.devices]);

  return (
    <Link key={site.id} to={`/site/${site.id}`}>
      <div className={cn(
        "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
        isActive && "bg-[#F9F9FA] font-bold border-l-4 border-primary text-primary"
      )}>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-[#8E9196]" />
          <span className="text-sm font-medium text-gray-900">{site.name}</span>
        </div>
        <span className="text-sm text-[#8E9196]">
          {deviceCount !== null ? deviceCount : '...'} devices
        </span>
      </div>
    </Link>
  );
}
