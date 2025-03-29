
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileSpreadsheet, Database, Download, AlertCircle, Loader2 } from "lucide-react";
import { generateExampleData } from "@/services/generateExampleData";

export const DbTools: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateData = async () => {
    setIsGenerating(true);
    try {
      await generateExampleData();
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCsvTemplate = () => {
    // Example CSV with headers that match the expected format in the edge function
    const csvContent = `entity_type,id,name,customer_id,description,status,project_id,site_id,zone_id,parent_id,type,area,address,location_text,device_id,unit,sensor_id,timestamp,value,is_real
project,1,Example Project,101,Main customer project,Active,,,,,,,,,,,,,
site,1,Main Building,,Site description,Active,1,,,,,,"123 Main St, City",Location description,,,,,
zone,1,Ground Floor,,Ground floor common areas,Active,,1,,,,Floor,120,,,,,,
zone,2,First Floor,,First floor area,Active,,1,,,,Floor,100,,,,,,
zone,3,Kitchen,,Kitchen in ground floor,Active,,1,1,,,Room,25,,,,,,
device,1,Temp Sensor 1,,Temperature monitoring device,Active,1,1,1,,TempMon,,,,,,,,
device,2,Humidity Sensor 1,,Humidity monitoring device,Active,1,1,2,,HumidMon,,,,,,,,
sensor,temp1,Temperature Sensor 1,,,,,,,,,,,1,°C,,,,
sensor,hum1,Humidity Sensor 1,,,,,,,,,,,2,%,,,,
sensor_data,,,,,,,,,,,,,,,temp1,2023-10-01T12:00:00Z,22.5,1
sensor_data,,,,,,,,,,,,,,,temp1,2023-10-01T13:00:00Z,23.1,1
sensor_data,,,,,,,,,,,,,,,hum1,2023-10-01T12:00:00Z,55.2,1
sensor_data,,,,,,,,,,,,,,,hum1,2023-10-01T13:00:00Z,56.7,1`;

    // Create a download link for the CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'import-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Database Tools</CardTitle>
          <CardDescription>
            Tools to populate the database with example data and export templates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleGenerateData}
              disabled={isGenerating}
              variant="outline"
              className="w-full md:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Data...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Generate Example Data
                </>
              )}
            </Button>
            <Button 
              onClick={downloadCsvTemplate} 
              variant="outline"
              className="w-full md:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV Template
            </Button>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The CSV template follows the same format expected by the import function. 
              You can modify it and upload to Google Sheets, then make it public with the same 
              URL format as the current import sheet.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
