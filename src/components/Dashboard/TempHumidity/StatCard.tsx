import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  status: 'good' | 'caution' | 'warning';
  description?: string;
  large?: boolean;
}
export function StatCard({
  title,
  value,
  unit,
  status,
  description,
  large
}: StatCardProps) {
  const getStatusColor = (status: 'good' | 'caution' | 'warning') => {
    switch (status) {
      case 'good':
        return 'text-green-500';
      case 'caution':
        return 'text-amber-500';
      case 'warning':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  const getStatusText = (status: 'good' | 'caution' | 'warning') => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'caution':
        return 'Caution';
      case 'warning':
        return 'Warning';
      default:
        return 'Unknown';
    }
  };
  return <Card className="overflow-hidden border-0 h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-[5px] mx-[5px] flex-grow flex flex-col justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <span className="text-center font-medium">{value}</span>
              {unit && <span className="font-thin text-left text-sm">{unit}</span>}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{title}</div>
            
            <div className={cn("mt-3 text-sm font-medium", getStatusColor(status))}>
              {getStatusText(status)}
            </div>
          </div>
        </div>
        <div className={cn("h-1 w-full rounded-none", status === 'good' ? "bg-green-500" : status === 'caution' ? "bg-amber-500" : "bg-red-500")} />
      </CardContent>
    </Card>;
}