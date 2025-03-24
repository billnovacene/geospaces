
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "@/services/projects";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SitesList } from "@/components/Dashboard/SitesList";
import { ProjectHeader } from "@/components/Project/ProjectHeader";
import { ProjectDetailsCard } from "@/components/Project/ProjectDetailsCard";
import { AdditionalInfoCard } from "@/components/Project/AdditionalInfoCard";
import { ProjectErrorState } from "@/components/Project/ProjectErrorState";
import { ProjectLoadingState } from "@/components/Project/ProjectLoadingState";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId || ""),
    enabled: !!projectId,
  });

  console.log("Project data in ProjectDetail:", project); // Enhanced debug log

  if (error) {
    return (
      <SidebarWrapper>
        <ProjectErrorState />
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <a href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </a>
        </Button>
        
        {isLoading ? (
          <ProjectLoadingState />
        ) : (
          <>
            <ProjectHeader project={project!} />
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <ProjectDetailsCard project={project!} />
              <AdditionalInfoCard project={project!} />
            </div>
            
            {/* Sites List */}
            <SitesList projectId={project?.id} />
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default ProjectDetail;
