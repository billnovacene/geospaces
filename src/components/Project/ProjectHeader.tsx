
import { Project } from "@/services/interfaces";
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
import { HomeIcon } from "lucide-react";

interface ProjectHeaderProps {
  project?: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  // If no project is provided, show a default header
  if (!project) {
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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-normal text-gray-800 mb-3">Project Dashboard</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </>
    );
  }

  // The original component logic with project data
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
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-normal text-gray-800 mb-3">{project.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(project.status || "Unknown")}>
              {project.status || "Unknown"}
            </Badge>
            {project.type && <Badge variant="secondary">{project.type}</Badge>}
          </div>
        </div>
      </div>
    </>
  );
}
