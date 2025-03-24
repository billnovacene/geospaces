
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProject, Project } from "@/services/api";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Monitor, ServerIcon } from "lucide-react";
import { format } from "date-fns";
import { SitesList } from "@/components/Dashboard/SitesList";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId || ""),
    enabled: !!projectId,
  });

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

  // Helper function to safely get description text
  const getDescriptionText = (description: any): string => {
    if (!description) return "No description provided";
    if (typeof description === 'object' && description.value) {
      return description.value;
    }
    return String(description);
  };

  if (error) {
    return (
      <SidebarWrapper>
        <div className="container mx-auto py-6">
          <Button variant="outline" size="sm" asChild className="mb-6">
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-destructive mb-2">Failed to load project</p>
                <p className="text-muted-foreground text-sm">Please try again later or check your connection</p>
              </div>
            </CardContent>
          </Card>
        </div>
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
          <div className="space-y-4">
            <Skeleton className="h-12 w-80" />
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
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
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Project ID</h3>
                    <p>{project?.id}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Customer ID</h3>
                    <p>{project?.customerId || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                    <p>{getDescriptionText(project?.description)}</p>
                  </div>
                  
                  <div className="pt-2 grid grid-cols-2 gap-4">
                    <Card className="bg-muted/40">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Sites</p>
                          <p className="text-2xl font-bold">{project?.sites || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Devices</p>
                          <p className="text-2xl font-bold">{project?.devices || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">BB101</h3>
                        <Badge variant={project?.bb101 ? "default" : "outline"}>
                          {project?.bb101 ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Trigger Device</h3>
                        <Badge variant={project?.triggerDevice ? "default" : "outline"}>
                          {project?.triggerDevice ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
                      <p>{project?.updatedAt ? formatDate(project.updatedAt) : "N/A"}</p>
                    </div>
                    
                    {project?.image && (
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Project Image</h3>
                        <div className="mt-2 border rounded-md p-2 inline-block">
                          <img 
                            src={project.image} 
                            alt={`${project.name} logo`} 
                            className="max-h-24 max-w-full object-contain" 
                          />
                        </div>
                      </div>
                    )}
                    
                    {Object.entries(project || {})
                      .filter(([key]) => !["id", "name", "createdAt", "updatedAt", "status", "customerId", 
                                          "description", "sites", "devices", "image", "bb101", 
                                          "triggerDevice", "notification"].includes(key))
                      .map(([key, value]) => (
                        <div key={key}>
                          <h3 className="font-medium text-sm text-muted-foreground mb-1">
                            {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <p>{typeof value === "object" ? JSON.stringify(value) : String(value)}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
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
