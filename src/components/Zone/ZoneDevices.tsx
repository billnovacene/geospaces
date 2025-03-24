
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesForZone } from "@/services/devices";
import { Wifi } from "lucide-react";
import { ErrorDevicesState } from "@/components/Site/ErrorDevicesState";
import { EmptyDevicesState } from "@/components/Site/EmptyDevicesState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeviceTableRow } from "@/components/Site/DeviceTableRow";
import { prepareDeviceData, getSortedData } from "@/utils/deviceTableUtils";
import { TableColumnHeader } from "@/components/Site/TableColumnHeader";
import { DeviceCard } from "./DeviceCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DevicesTableSkeleton } from "@/components/Site/DevicesTableSkeleton";

interface ZoneDevicesProps {
  zoneId: number;
}

export const ZoneDevices = ({ zoneId }: ZoneDevicesProps) => {
  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [view, setView] = useState<"table" | "cards">("table");

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const { data: devices, isLoading, error } = useQuery({
    queryKey: ["zone-devices-list", zoneId],
    queryFn: () => fetchDevicesForZone(zoneId),
    enabled: !!zoneId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(`Devices for zone ${zoneId}:`, devices);

  // Prepare and sort device data
  const devicesData = prepareDeviceData(devices);
  const sortedDevicesData = getSortedData(devicesData, sortField, sortDirection);

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Devices in Zone
            <Badge variant="outline" className="ml-2">
              {devices?.length || 0}
            </Badge>
          </CardTitle>
          
          <Tabs value={view} onValueChange={(v) => setView(v as "table" | "cards")} className="w-auto">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DevicesTableSkeleton />
        ) : error ? (
          <ErrorDevicesState />
        ) : !devices || devices.length === 0 ? (
          <EmptyDevicesState />
        ) : (
          <div>
            {view === "table" ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableColumnHeader field="status" label="Status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="w-[80px]" />
                      <TableColumnHeader field="signal" label="Signal" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="w-[80px]" />
                      <TableColumnHeader field="name" label="Device Name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      <TableColumnHeader field="location" label="Location" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      <TableColumnHeader field="co2" label="Active Measure 1" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      <TableColumnHeader field="temperature" label="Active Measure 2" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      <TableColumnHeader field="humidity" label="Active Measure 3" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDevicesData.map((device) => (
                      <DeviceTableRow key={device.id} device={device} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
