
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/services/api";
import { projectDevicesCache } from "@/services/projects";

interface ProjectDetailsCardProps {
  project: Project;
}

export const ProjectDetailsCard = ({ project }: ProjectDetailsCardProps) => {
  // Helper function to safely get description text
  const getDescriptionText = (description: any): string => {
    if (!description) return "No description provided";
    if (typeof description === 'object' && description.value) {
      return description.value;
    }
    return String(description);
  };

  // Helper function to safely get numeric values with improved cache lookup
  const getNumericValue = (value: any, fieldName?: string): number => {
    // For devices field specifically, always check cache first if project ID exists
    if (fieldName === 'devices' && project?.id) {
      const cachedValue = projectDevicesCache[project.id];
      if (cachedValue !== undefined && cachedValue > 0) {
        console.log(`Using cached device count in card: ${cachedValue}`);
        return cachedValue;
      }
    }
    
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // For devices specifically, we prioritize the cached value
  const deviceCount = project?.id && projectDevicesCache[project.id] !== undefined
    ? projectDevicesCache[project.id]
    : getNumericValue(project?.devices);

  console.log("Project details in card:", project);
  // Log both the direct value and cached value for debugging
  console.log("Devices count directly from project:", project?.devices);
  console.log("Cached devices count:", project?.id ? projectDevicesCache[project.id] : undefined);
  console.log("Final device count to display:", deviceCount);

  return (
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
                <p className="text-2xl font-bold">{getNumericValue(project?.sites)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Devices</p>
                <p className="text-2xl font-bold">{deviceCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
