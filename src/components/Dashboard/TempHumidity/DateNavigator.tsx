
import React from "react";
import { ChartControls } from "./ChartControls";

interface DateNavigatorProps {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export function DateNavigator({ 
  selectedDate, 
  onPrevDay, 
  onNextDay 
}: DateNavigatorProps) {
  return (
    <ChartControls
      selectedDate={selectedDate}
      onPrevDay={onPrevDay}
      onNextDay={onNextDay}
    />
  );
}
