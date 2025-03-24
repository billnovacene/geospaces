
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProject, fetchProjects } from "@/services/projects";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { SitesList } from "@/components/Dashboard/SitesList";
import { ProjectHeader } from "@/components/Project/ProjectHeader";
import { ProjectDetailsCard } from "@/components/Project/ProjectDetailsCard";
import { AdditionalInfoCard } from "@/components/Project/AdditionalInfoCard";
import { ProjectErrorState } from "@/components/Project/ProjectErrorState";
import { ProjectLoadingState } from "@/components/Project/ProjectLoadingState";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // If we're on the home page without a projectId, we'll display a project list
  // or a default view instead of trying to fetch a specific project
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => (projectId ? fetchProject(projectId) : null),
    enabled: !!projectId,
  });

  console.log("Project data in ProjectDetail:", project);

  if (error && projectId) {
    return (
      <SidebarWrapper>
        <ProjectErrorState />
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        {isLoading && projectId ? (
          <ProjectLoadingState />
        ) : (
          <>
            <ProjectHeader project={project || undefined} />
            
            {project ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <ProjectDetailsCard project={project} />
                  <AdditionalInfoCard project={project} />
                </div>
                
                {/* Sites List */}
                <SitesList projectId={project?.id} />
              </>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Welcome to the Project Dashboard</h2>
                  <p className="text-gray-600">
                    Select a site from the sidebar to view its details and zones.
                  </p>
                </div>
                
                {/* Show sites list even without a specific project */}
                <SitesList projectId={145} /> {/* Using default project ID */}
              </div>
            )}
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default ProjectDetail;
