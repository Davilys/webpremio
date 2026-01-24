import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  BarChart3, 
  History 
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Visão Geral', shortLabel: 'Geral', icon: LayoutDashboard },
  { id: 'goals', label: 'Metas', shortLabel: 'Metas', icon: Target },
  { id: 'performance', label: 'Performance', shortLabel: 'Perf.', icon: TrendingUp },
  { id: 'comparison', label: 'Comparativos', shortLabel: 'Comp.', icon: BarChart3 },
  { id: 'history', label: 'Histórico', shortLabel: 'Hist.', icon: History },
];

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-1.5 sm:gap-2 p-1.5 bg-secondary/50 rounded-2xl overflow-x-auto scrollbar-hide border border-border/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl",
                "text-xs sm:text-sm font-medium whitespace-nowrap",
                "transition-colors duration-200 touch-action-manipulation",
                "min-w-[60px] sm:min-w-0 justify-center sm:justify-start",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-card rounded-xl shadow-sm border border-border/50"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <TabIcon className="w-4 h-4 flex-shrink-0" />
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTabs;
