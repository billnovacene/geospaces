
import { format } from "date-fns";

// Format date
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
  } catch (e) {
    return dateString;
  }
};

// Get status color
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
