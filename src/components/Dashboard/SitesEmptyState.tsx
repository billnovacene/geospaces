
interface SitesEmptyStateProps {
  noProject?: boolean;
  searchTerm?: string;
}

export function SitesEmptyState({ noProject, searchTerm }: SitesEmptyStateProps) {
  if (noProject) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-lg font-medium mb-2">No project selected</p>
        <p className="text-muted-foreground text-sm">
          Select a project to view its sites
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      <p className="text-lg font-medium mb-2">No sites found</p>
      <p className="text-muted-foreground text-sm">
        {searchTerm ? "Try a different search term" : "This project doesn't have any sites yet"}
      </p>
    </div>
  );
}
