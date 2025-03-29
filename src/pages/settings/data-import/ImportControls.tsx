
import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ImportControlsProps {
  isImporting: boolean;
  onImport: () => Promise<void>;
}

export const ImportControls: React.FC<ImportControlsProps> = ({ 
  isImporting, 
  onImport 
}) => {
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
          onClick={onImport}
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
    </div>
  );
};
