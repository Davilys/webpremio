import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import MonthSelector from './MonthSelector';

type Period = 'today' | 'week' | 'month' | 'custom';

interface PeriodFilterProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const periods: { id: Period; label: string; icon: React.ElementType }[] = [
  { id: 'today', label: 'Hoje', icon: Calendar },
  { id: 'week', label: 'Semana', icon: CalendarDays },
  { id: 'month', label: 'Mês', icon: CalendarRange },
];

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      <div className="flex gap-1 p-1.5 bg-muted/50 rounded-xl">
        {periods.map((period) => {
          const isActive = selectedPeriod === period.id;
          const PeriodIcon = period.icon;
          
          return (
            <motion.button
              key={period.id}
              onClick={() => onPeriodChange(period.id)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl flex-1 sm:flex-none",
                "text-sm font-medium",
                "transition-colors duration-200 touch-action-manipulation",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activePeriodBg"
                  className="absolute inset-0 bg-card rounded-xl shadow-sm"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <PeriodIcon className="w-4 h-4" />
                <span>{period.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      
      <MonthSelector currentDate={selectedDate} onChange={onDateChange} />
    </div>
  );
};

export default PeriodFilter;
