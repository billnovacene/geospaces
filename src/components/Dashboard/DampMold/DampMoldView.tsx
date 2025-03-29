
import React from "react";
import { DampMoldProvider } from "./context/DampMoldContext";
import { DampMoldContent } from "./components/DampMoldContent";

interface DampMoldViewProps {
  contextType?: "zone" | "site" | "all";
  contextId?: string | null;
  siteId?: string;
  zoneId?: string;
  activeFilter?: string | null;
  currentDate?: Date;
}

export function DampMoldViewInner({ 
  activeFilter = null,
  currentDate = new Date()
}: {
  activeFilter?: string | null;
  currentDate?: Date;
}) {
  return <DampMoldContent />;
}

export function DampMoldView({ 
  contextType: propsContextType, 
  contextId: propsContextId,
  siteId: propsSiteId,
  zoneId: propsZoneId,
  activeFilter = null,
  currentDate = new Date()
}: DampMoldViewProps) {
  return (
    <DampMoldProvider
      contextType={propsContextType}
      contextId={propsContextId}
      siteId={propsSiteId}
      zoneId={propsZoneId}
      activeFilter={activeFilter}
      currentDate={currentDate}
    >
      <DampMoldViewInner 
        activeFilter={activeFilter} 
        currentDate={currentDate} 
      />
    </DampMoldProvider>
  );
}

export default DampMoldView;
