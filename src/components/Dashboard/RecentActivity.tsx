
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export function RecentActivity() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Create fake activity data based on projects
  const activities = projects
    .slice(0, 5)
    .map(project => ({
      id: project.id,
      projectName: project.name,
      action: "Project created",
      timestamp: project.created_at,
      user: "Admin User",
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-full max-w-[250px]" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No recent activity to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-10 w-10 flex items-center justify-center font-semibold">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                    <span className="font-semibold">{activity.projectName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
