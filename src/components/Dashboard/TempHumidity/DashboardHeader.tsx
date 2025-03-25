
import { BreadcrumbNav } from "@/components/Dashboard/TempHumidity/BreadcrumbNav";
import { PageHeader } from "@/components/Dashboard/TempHumidity/PageHeader";
import { ReactNode } from "react";

interface DashboardHeaderProps {
  customTitle: string;
  badges: ReactNode;
}

export function DashboardHeader({ customTitle, badges }: DashboardHeaderProps) {
  return (
    <>
      <div className="mb-4">
        <BreadcrumbNav />
      </div>

      <div className="flex items-center justify-between mb-6">
        <PageHeader customTitle={customTitle} />
        {badges}
      </div>
    </>
  );
}
