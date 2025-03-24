
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Users, Clock, Activity } from "lucide-react";

export function StatsCards() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Calculate some stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status?.toLowerCase() === "active").length;
  const recentProjects = projects
    .filter(p => {
      // Projects created in the last 30 days
      const creationDate = new Date(p.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return creationDate > thirtyDaysAgo;
    })
    .length;

  const statCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderOpen,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: Activity,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Recent Projects",
      value: recentProjects,
      icon: Clock,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Team Members",
      value: "5",
      icon: Users,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="dashboard-card card-hover overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`${stat.color} p-4 rounded-full`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
