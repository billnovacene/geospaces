
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesForZone } from "@/services/devices";

// Import all the refactored components
import { DeviceHeader } from "@/components/Device/DeviceHeader";
import { LiveDataTab } from "@/components/Device/LiveDataTab";
import { InfoTab } from "@/components/Device/InfoTab";
import { EventsTab } from "@/components/Device/EventsTab";
import { DeviceLoading } from "@/components/Device/DeviceLoading";
import { DeviceError } from "@/components/Device/DeviceError";
import { DeviceEmpty } from "@/components/Device/DeviceEmpty";
import { getLastReadTime } from "@/components/Device/DeviceUtils";

interface ZoneDevicesProps {
  zoneId: number;
}

export const ZoneDevices = ({ zoneId }: ZoneDevicesProps) => {
  const [activeTab, setActiveTab] = useState("liveData");

  const { data: devices, isLoading, error } = useQuery({
    queryKey: ["zone-devices-list", zoneId],
    queryFn: () => fetchDevicesForZone(zoneId),
    enabled: !!zoneId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(`Devices for zone ${zoneId}:`, devices);

  if (isLoading) {
    return <DeviceLoading zoneId={zoneId} />;
  }

  if (error || !devices || devices.length === 0) {
    if (error) {
      return <DeviceError zoneId={zoneId} error={error} />;
    } else {
      return <DeviceEmpty zoneId={zoneId} />;
    }
  }

  // Get the first device to display (we'll show one device at a time in this UI)
  const device = devices[0];
  
  // Get the formatted time for the last reading
  const formattedLastReadTime = getLastReadTime(device);

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <DeviceHeader device={device} />
      </CardHeader>
      
      <CardContent className="pb-4">
        <Tabs defaultValue="liveData" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-3 border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="liveData" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-2.5 text-base"
            >
              Live data
            </TabsTrigger>
            <TabsTrigger 
              value="info" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-2.5 text-base"
            >
              Info
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-2.5 text-base"
            >
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="liveData" className="m-0">
            <LiveDataTab device={device} formattedLastReadTime={formattedLastReadTime} />
          </TabsContent>
          
          <TabsContent value="info" className="m-0">
            <InfoTab device={device} />
          </TabsContent>
          
          <TabsContent value="events" className="m-0">
            <EventsTab device={device} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
