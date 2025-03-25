
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ErrorState() {
  const { zoneId, siteId } = useParams<{ zoneId: string; siteId: string }>();
  
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="text-center p-8 border rounded-lg bg-red-50 border-red-200">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <h3 className="text-lg font-medium text-red-800">API Connection Failed</h3>
        
        {zoneId ? (
          <>
            <p className="text-red-700 max-w-md">
              Unable to retrieve temperature data for zone ID {zoneId}.
            </p>
            <p className="text-sm text-red-600 mt-2">
              This zone may not have any temperature sensors, or there was an error connecting to the API.
            </p>
          </>
        ) : siteId ? (
          <>
            <p className="text-red-700 max-w-md">
              Unable to retrieve temperature data for site ID {siteId}.
            </p>
            <p className="text-sm text-red-600 mt-2">
              This site may not have any temperature sensors configured, or there was an error connecting to the API.
            </p>
          </>
        ) : (
          <>
            <p className="text-red-700 max-w-md">
              Unable to connect to the temperature data API. Please check your network connection and API credentials.
            </p>
            <p className="text-sm text-red-600 mt-2">
              The dashboard requires a valid API connection to display real-time temperature data.
            </p>
          </>
        )}
        
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-xs text-red-500 font-medium">Troubleshooting Steps:</p>
          <ul className="text-xs text-red-500 list-disc text-left pl-4">
            <li>Verify that the {zoneId ? "zone" : siteId ? "site" : "location"} has temperature or humidity sensors</li>
            <li>Check if the API is accessible</li>
            <li>Ensure the sensors are reporting data</li>
            <li>Confirm you have permission to view this data</li>
          </ul>
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4 bg-white text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleRetry}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Retry Connection
        </Button>
      </div>
    </div>
  );
}
