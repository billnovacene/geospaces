
import React from "react";
import { ImportControls } from "./data-import/ImportControls";
import { ImportSummary } from "./data-import/ImportSummary";
import { ImportHistory } from "./data-import/ImportHistory";
import { useImportData } from "./data-import/useImportData";
import { DbTools } from "./data-import/DbTools";
import { Separator } from "@/components/ui/separator";

export const DataImportTab = () => {
  const {
    isImporting,
    importLogs,
    isLoadingLogs,
    lastImportStats,
    handleImport,
    fetchImportLogs
  } = useImportData();

  return (
    <div className="space-y-6">
      <ImportControls 
        isImporting={isImporting} 
        onImport={handleImport} 
      />
      
      {lastImportStats && <ImportSummary lastImportStats={lastImportStats} />}
      
      <ImportHistory 
        importLogs={importLogs} 
        isLoadingLogs={isLoadingLogs} 
        onRefresh={fetchImportLogs} 
      />
      
      <Separator className="my-6" />
      
      <DbTools />
    </div>
  );
};
