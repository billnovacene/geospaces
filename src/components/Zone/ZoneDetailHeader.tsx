
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Zone } from "@/services/interfaces";
import { getStatusColor } from "@/utils/formatting";
import { Link } from "react-router-dom";

interface ZoneDetailHeaderProps {
  zone: Zone;
}

export const ZoneDetailHeader = ({ zone }: ZoneDetailHeaderProps) => {
  return (
    <>
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link to={`/site/${zone.siteId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Site
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-normal text-gray-800 mb-3">{zone.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(zone.status || "Unknown")}>
              {zone.status || "Unknown"}
            </Badge>
            {zone.type && <Badge variant="secondary">{zone.type}</Badge>}
          </div>
        </div>
      </div>
    </>
  );
};
