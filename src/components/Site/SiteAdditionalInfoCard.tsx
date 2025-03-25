
import { useState } from "react";
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatting";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Clock, Save, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  ResponsiveContainer,
  Tooltip 
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface SiteAdditionalInfoCardProps {
  site: Site;
}

type OperatingHoursFormValues = {
  startTime: string;
  endTime: string;
};

export function SiteAdditionalInfoCard({ site }: SiteAdditionalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [statusData, setStatusData] = useState(() => {
    // Generate 30 days of uptime data (mostly up with occasional blips)
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      status: Math.random() > 0.15 ? 100 : Math.floor(Math.random() * 80 + 10)
    }));
  });

  // Extract operating hours from site data
  const operatingHoursField = site.fields?.find(field => 
    field.energyCalculationField
  )?.energyCalculationField;

  // Create the form
  const form = useForm<OperatingHoursFormValues>({
    defaultValues: {
      startTime: operatingHoursField ? 
        new Date(operatingHoursField.operatingHoursStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
        "08:00",
      endTime: operatingHoursField ? 
        new Date(operatingHoursField.operatingHoursEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
        "18:00"
    }
  });

  const onSubmit = (data: OperatingHoursFormValues) => {
    // In a real app, this would call an API to update the data
    console.log("Submitting operating hours:", data);
    toast.success("Operating hours updated successfully");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
            <span className="text-xs text-gray-400">{formatDate(site.updatedAt)}</span>
          </div>
          
          {/* Status Chart */}
          <div className="mt-2 border rounded-md">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="bg-[#6CAE3E] hover:bg-[#5A972F]">
                    Fully Operational
                  </Badge>
                  <span className="text-xs text-muted-foreground">100.00% in the last 30 days</span>
                </div>
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div className="p-3 h-14">
              <ChartContainer 
                config={{
                  status: {
                    color: "#6CAE3E"
                  }
                }}
                className="h-full"
              >
                <ResponsiveContainer>
                  <AreaChart data={statusData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6CAE3E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6CAE3E" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" hide={true} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="status" 
                      stroke="#6CAE3E" 
                      fillOpacity={1} 
                      fill="url(#colorStatus)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
        
        {site.isEnabledScheduler !== undefined && (
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Scheduler</h3>
            <Badge variant={site.isEnabledScheduler ? "default" : "outline"} className="bg-[#6CAE3E] hover:bg-[#5A972F]">
              {site.isEnabledScheduler ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        )}
        
        {site.isEnabledCondition !== undefined && (
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Condition</h3>
            <Badge variant={site.isEnabledCondition ? "default" : "outline"} className="bg-[#6CAE3E] hover:bg-[#5A972F]">
              {site.isEnabledCondition ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        )}
        
        {/* Operating Hours - Now Editable */}
        <div className="border rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm text-muted-foreground">Operating Hours</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="h-7 px-2 text-xs"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
          
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="h-8" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="h-8" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="w-full bg-[#6CAE3E] hover:bg-[#5A972F]"
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Save Operating Hours
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-[#6CAE3E]" />
              <span>
                {form.getValues("startTime")} - {form.getValues("endTime")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
