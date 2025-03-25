
import { AlertCircle } from "lucide-react";

export function ErrorState() {
  return (
    <div className="text-center p-8 border rounded-lg bg-red-50 border-red-200">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <h3 className="text-lg font-medium text-red-800">API Connection Failed</h3>
        <p className="text-red-700 max-w-md">
          Unable to connect to the temperature data API. Please check your network connection and API credentials.
        </p>
        <p className="text-sm text-red-600 mt-2">
          The dashboard requires a valid API connection to display real-time temperature data.
        </p>
      </div>
    </div>
  );
}
