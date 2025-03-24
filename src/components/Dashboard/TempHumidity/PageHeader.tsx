
import { Thermometer } from "lucide-react";

export function PageHeader() {
  return (
    <h1 className="text-3xl font-normal text-gray-800 flex items-center">
      <Thermometer className="mr-2 h-6 w-6 text-gray-700" />
      <span>Temperature & Humidity</span>
    </h1>
  );
}
