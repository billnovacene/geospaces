
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface InfoTabProps {
  device: any;
}

export const InfoTab = ({ device }: InfoTabProps) => {
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return "Invalid data format";
      }
    }
    return String(value);
  };

  const deviceInfo = [
    { label: "Device ID", value: device.id },
    { label: "Model", value: device.modelId?.name || "Unknown" },
    { label: "MAC Address", value: device.macAddress },
    { label: "Serial Number", value: device.serialNumber },
    { label: "Firmware Version", value: device.firmwareVersion },
    { label: "Created At", value: device.createdAt },
    { label: "Last Updated", value: device.lastUpdated },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">Device Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deviceInfo.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="font-medium mt-1">{renderValue(item.value)}</div>
            </Card>
          ))}
        </div>
      </div>

      {device.tags && device.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {device.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {device.location && (
        <div>
          <h3 className="text-lg font-bold mb-4">Location</h3>
          <Card className="p-4">
            <pre className="text-xs overflow-auto max-h-48">
              {renderValue(device.location)}
            </pre>
          </Card>
        </div>
      )}

      {device.config && (
        <div>
          <h3 className="text-lg font-bold mb-4">Configuration</h3>
          <Card className="p-4">
            <pre className="text-xs overflow-auto max-h-48">
              {renderValue(device.config)}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
};
