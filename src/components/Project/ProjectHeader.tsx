
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/services/api";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">{project?.name}</h1>
        <div className="flex items-center mt-2 text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Created on {formatDate(project?.createdAt || "")}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {project?.notification !== undefined && (
          <Badge variant="outline" className={project.notification ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
            Notifications: {project.notification ? "Enabled" : "Disabled"}
          </Badge>
        )}
        <Badge variant="outline" className={getStatusColor(project?.status || "")}>
          {project?.status || "Unknown"}
        </Badge>
      </div>
    </div>
  );
};
