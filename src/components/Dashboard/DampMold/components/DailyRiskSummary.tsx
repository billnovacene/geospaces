
import React from "react";
import { DewPointChart } from "../DewPointChart";

interface DailyRiskSummaryProps {
  data: any;
}

export function DailyRiskSummary({ data }: DailyRiskSummaryProps) {
  return (
    <div className="w-full space-y-8">
      <div className="relative w-full">
        <DewPointChart data={data} />
      </div>
    </div>
  );
}
