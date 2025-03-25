
import { Site } from "@/services/interfaces";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils/formatting";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon, Building2 } from "lucide-react";

interface SiteHeaderProps {
  site: Site;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <HomeIcon className="h-3.5 w-3.5" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#6CAE3E]" />
              <span>{site.name}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">{site.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(site.status || "Unknown")}>
              {site.status || "Unknown"}
            </Badge>
            {site.type && <Badge variant="secondary">{site.type}</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}
