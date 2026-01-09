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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
        {periods.map((period) => {
          const isActive = selectedPeriod === period.id;
          const PeriodIcon = period.icon;
          
          return (
            <button
              key={period.id}
              onClick={() => onPeriodChange(period.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 rounded-lg",
                "text-sm font-medium",
                "transition-colors duration-200",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activePeriodBg"
                  className="absolute inset-0 bg-card rounded-lg shadow-sm"
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
                <span className="hidden sm:inline">{period.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      
      <MonthSelector currentDate={selectedDate} onChange={onDateChange} />
    </div>
  );
};

export default PeriodFilter;
