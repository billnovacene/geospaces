
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function TemperatureGuide() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Temperature & Humidity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-sm font-medium">Statutory Temp</TableCell>
              <TableCell className="text-sm text-right">18°C-22°C</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm font-medium">Humidity</TableCell>
              <TableCell className="text-sm text-right">40%-60%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
