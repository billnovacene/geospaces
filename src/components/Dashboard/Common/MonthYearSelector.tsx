
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, addMonths, subMonths } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MonthYearSelectorProps {
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
  className?: string;
}

export function MonthYearSelector({ 
  onDateChange, 
  initialDate = new Date(),
  className 
}: MonthYearSelectorProps) {
  const [date, setDate] = useState<Date>(initialDate);
  const [open, setOpen] = useState(false);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    setOpen(false);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handlePreviousMonth = () => {
    const newDate = subMonths(date, 1);
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = addMonths(date, 1);
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handlePreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="min-w-[130px] justify-start text-left font-normal h-8"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{format(date, "MMMM yyyy")}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
}
