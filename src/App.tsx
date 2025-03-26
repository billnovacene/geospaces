
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectDetail from "./pages/ProjectDetail";
import SiteDetail from "./pages/SiteDetail";
import ZoneDetail from "./pages/ZoneDetail";
import TempHumidityDashboard from "./pages/TempHumidityDashboard";
import DampMoldDashboard from "./pages/DampMoldDashboard";
import NotFound from "./pages/NotFound";
import React from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProjectDetail />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="/site" element={<Navigate to="/" replace />} />
            <Route path="/site/:siteId" element={<SiteDetail />} />
            <Route path="/zone/:zoneId" element={<ZoneDetail />} />
            
            {/* Global dashboards */}
            <Route path="/dashboard/temp-humidity" element={<TempHumidityDashboard />} />
            <Route path="/dashboard/damp-mold" element={<DampMoldDashboard />} />
            
            {/* Site-specific dashboards */}
            <Route path="/site/:siteId/dashboard/temp-humidity" element={<TempHumidityDashboard />} />
            <Route path="/site/:siteId/dashboard/damp-mold" element={<DampMoldDashboard />} />
            
            {/* Zone-specific dashboards */}
            <Route path="/zone/:zoneId/dashboard/temp-humidity" element={<TempHumidityDashboard />} />
            <Route path="/zone/:zoneId/dashboard/damp-mold" element={<DampMoldDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner position="top-right" />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
