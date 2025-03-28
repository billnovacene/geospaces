
import React, { useState } from "react";
import { DewPointChart } from "../DewPointChart";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function DailyRiskSummary() {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    toast.info("Starting data import from Google Sheet", {
      description: "This process may take a few minutes to complete."
    });
    
    try {
      // Use the Supabase client to invoke the function instead of raw fetch
      const { data: result, error } = await supabase.functions.invoke('import-from-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (result.success) {
        toast.success("Data import completed successfully", {
          description: `Imported ${result.total_imported} total records.`
        });
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error("Data import failed", {
        description: err instanceof Error ? err.message : 'An unexpected error occurred during import'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full">
          <DewPointChart />
        </div>
        <div className="flex-shrink-0 ml-4">
          <Button
            onClick={handleImport}
            disabled={isImporting}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
