
import React from 'react';
import { SpecificZoneView } from "@/components/Dashboard/TempHumidity/SpecificZoneView";

interface SpecificZoneHandlerProps {
  siteId: string;
  zoneId: string;
}

/**
 * Handles the special case for site 471 - zone 12658
 */
export function SpecificZoneHandler({ siteId, zoneId }: SpecificZoneHandlerProps) {
  return (
    <SpecificZoneView 
      siteId={siteId} 
      zoneId={zoneId} 
      contextName={`Zone ${zoneId} (Site ${siteId})`}
    />
  );
}
