
import { AreaChart } from "lucide-react";

interface PageHeaderProps {
  customTitle?: string;
}

export function PageHeader({ customTitle }: PageHeaderProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="rounded-lg bg-primary/10 p-2">
        <AreaChart className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold">
        {customTitle || "Temperature & Humidity Dashboard"}
      </h1>
    </div>
  );
}
