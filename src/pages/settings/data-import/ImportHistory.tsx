
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImportHistoryProps {
  importLogs: any[];
  isLoadingLogs: boolean;
  onRefresh: () => void;
}

export const ImportHistory: React.FC<ImportHistoryProps> = ({ 
  importLogs, 
  isLoadingLogs, 
  onRefresh 
}) => {
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get badge for import status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 text-white">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">Import History</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoadingLogs}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingLogs ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importLogs.length > 0 ? (
                  importLogs.map((log) => {
                    // Calculate duration
                    let duration = 'N/A';
                    if (log.finished_at && log.started_at) {
                      const start = new Date(log.started_at);
                      const end = new Date(log.finished_at);
                      const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
                      duration = `${diff} seconds`;
                    }
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell>{formatDate(log.started_at)}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell>{log.rows_imported}</TableCell>
                        <TableCell>{duration}</TableCell>
                        <TableCell>
                          {log.status === 'failed' && log.error_message ? (
                            <span className="text-red-500 text-xs">{log.error_message}</span>
                          ) : (
                            <span className="text-xs">
                              {log.status === 'processing' ? 'In progress...' : 'Completed successfully'}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {isLoadingLogs ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Loading import history...
                        </div>
                      ) : (
                        'No import history found. Run your first import to see results here.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
