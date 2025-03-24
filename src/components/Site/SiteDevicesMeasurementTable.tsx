
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteDevices } from "@/services/devices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { TableColumnHeader } from "./TableColumnHeader";
import { DeviceTableRow } from "./DeviceTableRow";
import { prepareDeviceData, getSortedData } from "@/utils/deviceTableUtils";

interface SiteDevicesMeasurementTableProps {
  siteId: number;
}

export const SiteDevicesMeasurementTable = ({ siteId }: SiteDevicesMeasurementTableProps) => {
  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
    queryKey: ["site-devices", siteId],
    queryFn: () => fetchSiteDevices(siteId),
    enabled: !!siteId,
    staleTime: 5 * 60 * 1000,
  });

  // Prepare and sort device data
  const devicesData = prepareDeviceData(devices);
  const sortedDevicesData = getSortedData(devicesData, sortField, sortDirection);

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Devices Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2 text-yellow-500" />
            <p>Error loading devices. Please try again later.</p>
          </div>
        ) : sortedDevicesData.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">No devices with sensor data found for this site</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead className="w-[80px]">Signal</TableHead>
                  <TableColumnHeader 
                    field="name"
                    label="Device Name"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableColumnHeader 
                    field="location"
                    label="Location"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableColumnHeader 
                    field="co2"
                    label="Active Measure 1"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableColumnHeader 
                    field="temperature"
                    label="Active Measure 2"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableColumnHeader 
                    field="humidity"
                    label="Active Measure 3"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDevicesData.map((device) => (
                  <DeviceTableRow key={device.id} device={device} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
