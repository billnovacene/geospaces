
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/services/api";
import { format } from "date-fns";

interface AdditionalInfoCardProps {
  project: Project;
}

export const AdditionalInfoCard = ({ project }: AdditionalInfoCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  return (
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
  );
};
