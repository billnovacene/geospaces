
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/services/api";

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

  // Helper function to safely get numeric values
  const getNumericValue = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  console.log("Project details in card:", project);
  console.log("Devices count in card:", project?.devices);

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
                <p className="text-2xl font-bold">{getNumericValue(project?.devices)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
