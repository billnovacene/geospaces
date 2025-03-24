
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/services/api";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { StatsCards } from "@/components/Dashboard/StatsCards";
import { ProjectsList } from "@/components/Dashboard/ProjectsList";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PlusCircle, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: projects = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Log when projects data changes
  useEffect(() => {
    console.log("Dashboard received projects data:", projects);
    console.log("Total projects in Dashboard:", projects.length);
  }, [projects]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log("Manual refresh triggered");
    await refetch();
    toast.success("Data refreshed successfully");
    setIsRefreshing(false);
  };

  // Simulate first-load animation
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SidebarWrapper>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className={`transition-opacity duration-500 ${isFirstLoad ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to Insight Nova Dashboard. Monitor your projects and activity.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing || isRefetching}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${(isRefreshing || isRefetching) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <StatsCards />
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <ProjectsList />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
