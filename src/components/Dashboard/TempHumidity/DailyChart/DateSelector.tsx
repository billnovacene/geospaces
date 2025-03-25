
import { subDays, addDays } from "date-fns";
import { DateNavigator } from "../DateNavigator";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function DateSelector({ selectedDate, setSelectedDate }: DateSelectorProps) {
  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
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
