
import { Site } from "@/services/interfaces";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils/formatting";

interface SiteHeaderProps {
  site: Site;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 mt-4">
      <div>
        <h1 className="text-3xl font-normal text-gray-800 dark:text-gray-200 mb-3 flex items-center">
          {site.name}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(site.status || "Unknown")}>
            {site.status || "Unknown"}
          </Badge>
          {site.type && <Badge variant="secondary">{site.type}</Badge>}
        </div>
      </div>
    </div>
  );
}
