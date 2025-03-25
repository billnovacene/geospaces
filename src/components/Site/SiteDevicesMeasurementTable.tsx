
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteDevices } from "@/services/devices";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6 pb-3 border-b">
        <h2 className="text-xl font-medium">Devices Measurements</h2>
      </div>
      <div className="p-6">
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
      </div>
    </div>
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
