
import { subDays, addDays } from "date-fns";
import { DateNavigator } from "../DateNavigator";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function DateSelector({ selectedDate, setSelectedDate }: DateSelectorProps) {
  const handlePrevDay = () => {
    const newDate = subDays(selectedDate, 1);
    setSelectedDate(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };
  
  return (
    <DateNavigator 
      selectedDate={selectedDate}
      onPrevDay={handlePrevDay}
      onNextDay={handleNextDay}
    />
  );
}
