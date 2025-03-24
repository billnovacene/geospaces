
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "./DeviceUtils";

interface EventsTabProps {
  device: any;
}

export const EventsTab = ({ device }: EventsTabProps) => {
  // In a real application, we would fetch events for this device
  // For now, we'll create mock data based on the device info
  const mockEvents = [
    {
      id: 1,
      type: "CONNECTION",
      severity: "INFO",
      timestamp: device.lastUpdated || device.createdAt,
      message: "Device connection established",
      details: { status: "Connected", deviceId: device.id }
    },
    {
      id: 2,
      type: "READING",
      severity: "INFO",
      timestamp: device.createdAt,
      message: "Initial device reading recorded",
      details: { deviceId: device.id }
    }
  ];

  const [events] = useState(mockEvents);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const renderEventDetails = (details: any): string => {
    if (!details) return "";
    
    try {
      return typeof details === "object" 
        ? JSON.stringify(details, null, 2)
        : String(details);
    } catch (e) {
      return "Invalid details format";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Device Events</h3>
        <Button variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground">
          <p>No events recorded for this device.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                  <span className="font-medium">{event.type}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(event.timestamp)}, {formatTime(event.timestamp)}
                </div>
              </div>
              <p className="mb-3">{event.message}</p>
              {event.details && (
                <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-48">
                  {renderEventDetails(event.details)}
                </pre>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
