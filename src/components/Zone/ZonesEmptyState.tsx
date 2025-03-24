
import React from "react";

interface ZonesEmptyStateProps {
  siteId?: number;
  searchTerm: string;
}

export function ZonesEmptyState({ siteId, searchTerm }: ZonesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      {!siteId ? (
        <>
          <p className="text-lg font-medium mb-2">No site selected</p>
          <p className="text-muted-foreground text-sm">
            Select a site to view its zones
          </p>
        </>
      ) : (
        <>
          <p className="text-lg font-medium mb-2">No zones found</p>
          <p className="text-muted-foreground text-sm">
            {searchTerm ? "Try a different search term" : "This site doesn't have any zones yet"}
          </p>
        </>
      )}
    </div>
  );
}
