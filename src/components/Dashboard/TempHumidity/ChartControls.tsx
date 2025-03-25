
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChartControlsProps {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export function ChartControls({ 
  selectedDate, 
  onPrevDay, 
  onNextDay 
}: ChartControlsProps) {
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  
  return (
    <div className="flex items-center justify-between mt-4 mb-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onPrevDay}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous Day
      </Button>
      
      <span className="font-medium">
        {format(selectedDate, "EEEE, MMMM d")}
      </span>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onNextDay}
        disabled={isToday}
      >
        Next Day
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
