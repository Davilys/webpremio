import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ currentDate, onChange }) => {
  const handlePrevMonth = () => {
    onChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onChange(addMonths(currentDate, 1));
  };

  const formattedDate = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex items-center gap-2 bg-card rounded-lg p-2 card-shadow">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevMonth}
        className="h-9 w-9"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 px-4 py-2 min-w-[200px] justify-center">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="font-semibold capitalize">{formattedDate}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        className="h-9 w-9"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
