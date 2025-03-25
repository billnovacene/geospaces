
import { Zone } from "@/services/interfaces";

interface ZoneCustomFieldsDisplayProps {
  zone: Zone;
}

export const ZoneCustomFieldsDisplay = ({ zone }: ZoneCustomFieldsDisplayProps) => {
  if (!zone.fields || zone.fields.length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium text-sm text-muted-foreground mb-1">Custom Fields</h3>
      <div className="border rounded-lg p-3">
        <pre className="text-xs overflow-auto max-h-48">
          {JSON.stringify(zone.fields, null, 2)}
        </pre>
      </div>
    </div>
  );
};
