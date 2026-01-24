import React from 'react';
import { motion } from 'framer-motion';
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

  const formattedDate = format(currentDate, "MMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex items-center gap-1.5 bg-card rounded-xl p-1.5 border border-border/50 w-full sm:w-auto">
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="h-10 w-10 sm:h-9 sm:w-9 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      <div className="flex items-center justify-center gap-2 px-3 py-2 flex-1 sm:flex-none sm:min-w-[160px]">
        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="font-semibold capitalize text-sm sm:text-base truncate">{formattedDate}</span>
      </div>

      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-10 w-10 sm:h-9 sm:w-9 rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default MonthSelector;
