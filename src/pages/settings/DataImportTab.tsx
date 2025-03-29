
import React from "react";
import { ImportControls } from "./data-import/ImportControls";
import { ImportSummary } from "./data-import/ImportSummary";
import { ImportHistory } from "./data-import/ImportHistory";
import { useImportData } from "./data-import/useImportData";

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
    </div>
  );
};
