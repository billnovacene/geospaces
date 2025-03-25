
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface DateNavigatorProps {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export function DateNavigator({ selectedDate, onPrevDay, onNextDay }: DateNavigatorProps) {
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  
  return (
    <div className="flex justify-between items-center pt-4 border-t mt-4">
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onPrevDay}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextDay}
          disabled={isToday}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
