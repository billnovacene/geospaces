
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, FileSpreadsheet, Check, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface ImportLog {
  id: string;
  source: string;
  started_at: string;
  finished_at: string | null;
  status: 'processing' | 'completed' | 'failed';
  rows_imported: number;
  error_message: string | null;
  metadata: any;
}

export const DataImportTab = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importLogs, setImportLogs] = useState<ImportLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [lastImportStats, setLastImportStats] = useState<any>(null);
  
  // Fetch import logs
  const fetchImportLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('import_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setImportLogs(data || []);
      
      // Set stats from the latest completed import
      const lastCompleted = data?.find(log => log.status === 'completed');
      if (lastCompleted && lastCompleted.metadata) {
        setLastImportStats(lastCompleted.metadata);
      }
    } catch (err) {
      console.error("Error fetching import logs:", err);
      toast.error("Failed to load import history");
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  // Load logs on component mount
  useEffect(() => {
    fetchImportLogs();
  }, []);
  
  // Start import process
  const handleImport = async () => {
    setIsImporting(true);
    toast.info("Starting data import from Google Sheet", {
      description: "This process may take a few minutes to complete."
    });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-from-sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }
      
      if (result.success) {
        toast.success("Data import completed successfully", {
          description: `Imported ${result.total_imported} total records.`
        });
        
        // Refresh logs to show the new import
        fetchImportLogs();
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error("Data import failed", {
        description: err.message || 'An unexpected error occurred during import'
      });
    } finally {
      setIsImporting(false);
    }
  };
  
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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Data Import</h3>
          <p className="text-sm text-muted-foreground">
            Import data from Google Sheets into the application database.
          </p>
        </div>
        <Button
          onClick={handleImport}
          disabled={isImporting}
          variant="outline"
          className="min-w-[120px]"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Import Now
            </>
          )}
        </Button>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Data Source</AlertTitle>
        <AlertDescription>
          Data will be imported from the Google Sheet at: 
          <a 
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vTtyaaD9UIdtuhO9BW1q6Mb4-26_jsidDU73HB1DE4Y8FE1tKSQxIAkLasrc3bT-0mvDy4ejjgTPJm1/pub?output=csv" 
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline ml-1"
          >
            View Source Sheet
          </a>
        </AlertDescription>
      </Alert>
      
      {lastImportStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Last Import Summary</CardTitle>
            <CardDescription>
              Overview of the data imported in the last successful import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="text-2xl font-bold">{lastImportStats.projects_count || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Sites</span>
                <span className="text-2xl font-bold">{lastImportStats.sites_count || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Zones</span>
                <span className="text-2xl font-bold">{lastImportStats.zones_count || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Devices</span>
                <span className="text-2xl font-bold">{lastImportStats.devices_count || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Sensors</span>
                <span className="text-2xl font-bold">{lastImportStats.sensors_count || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Sensor Data Points</span>
                <span className="text-2xl font-bold">{lastImportStats.sensor_data_count || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">Import History</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchImportLogs}
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
    </div>
  );
};
