
import { Site } from "@/services/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getStatusColor } from "@/utils/formatting";
import { Link } from "react-router-dom";

interface SiteHeaderProps {
  site: Site;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  return (
    <>
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-normal text-gray-800 mb-3">{site.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(site.status || "Unknown")}>
              {site.status || "Unknown"}
            </Badge>
            {site.type && <Badge variant="secondary">{site.type}</Badge>}
          </div>
        </div>
      </div>
    </>
  );
}
