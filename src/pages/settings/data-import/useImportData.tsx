
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImportLog {
  id: string;
  source: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  rows_imported: number;
  error_message: string | null;
  metadata: any;
}

export const useImportData = () => {
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

  return {
    isImporting,
    importLogs,
    isLoadingLogs,
    lastImportStats,
    handleImport,
    fetchImportLogs
  };
};
