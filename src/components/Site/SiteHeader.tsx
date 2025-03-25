
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
    <>
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <HomeIcon className="h-3.5 w-3.5" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{site.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-normal text-gray-800 mb-3 flex items-center">
            <Building2 className="h-7 w-7 mr-3 text-primary" />
            {site.name} Office Site Dashboard
          </h1>
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
