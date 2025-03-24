
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteDevices } from "@/services/devices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { TableColumnHeader } from "./TableColumnHeader";
import { DeviceTableRow } from "./DeviceTableRow";
import { DevicesTableSkeleton } from "./DevicesTableSkeleton";
import { EmptyDevicesState } from "./EmptyDevicesState";
import { ErrorDevicesState } from "./ErrorDevicesState";
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
          <DevicesTableSkeleton />
        ) : error ? (
          <ErrorDevicesState />
        ) : sortedDevicesData.length === 0 ? (
          <EmptyDevicesState />
        ) : (
          <DevicesMeasurementTable 
            sortedDevicesData={sortedDevicesData} 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface DevicesMeasurementTableProps {
  sortedDevicesData: any[];
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const DevicesMeasurementTable = ({ 
  sortedDevicesData, 
  sortField, 
  sortDirection, 
  onSort 
}: DevicesMeasurementTableProps) => {
  return (
    <div className="rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableColumnHeader field="status" label="Status" sortField={sortField} sortDirection={sortDirection} onSort={onSort} className="w-[80px]" />
            <TableColumnHeader field="signal" label="Signal" sortField={sortField} sortDirection={sortDirection} onSort={onSort} className="w-[80px]" />
            <TableColumnHeader field="name" label="Device Name" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
            <TableColumnHeader field="location" label="Location" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
            <TableColumnHeader field="co2" label="Active Sensor 1" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
            <TableColumnHeader field="temperature" label="Active Sensor 2" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
            <TableColumnHeader field="humidity" label="Active Sensor 3" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDevicesData.map((device) => (
            <DeviceTableRow key={device.id} device={device} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
