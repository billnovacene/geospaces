
// This file re-exports all sidebar components for backward compatibility
import { SidebarWrapper } from "./SidebarWrapper";
import { DashboardSidebar } from "./DashboardSidebar";
import { SidebarSection } from "./SidebarSection";
import { SidebarZoneItem } from "./SidebarZoneItem";
import { SidebarDashboardItem } from "./SidebarDashboardItem";
import { ZonesHierarchy } from "./ZonesHierarchy";

// Export the wrapper as default for backward compatibility
export { SidebarWrapper };

// Export other components for direct usage
export {
  DashboardSidebar,
  SidebarSection,
  SidebarZoneItem as ZoneItem,
  SidebarDashboardItem as DashboardItem,
  ZonesHierarchy
};
