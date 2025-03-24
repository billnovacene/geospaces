
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SiteStatusBadgeProps {
  status: string;
}

export function SiteStatusBadge({ status }: SiteStatusBadgeProps) {
  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-green-100 text-green-800",
          icon: null
        };
      case "warning":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
        };
      case "inactive":
        return {
          color: "bg-red-100 text-red-800",
          icon: null
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: null
        };
    }
  };

  const statusInfo = getStatusInfo(status || "Unknown");

  return (
    <Badge variant="outline" className={statusInfo.color}>
      {statusInfo.icon}
      {status || "Unknown"}
    </Badge>
  );
}
