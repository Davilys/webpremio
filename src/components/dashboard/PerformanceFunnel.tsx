import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface FunnelStage {
  name: string;
  value: number;
  color: string;
}

interface PerformanceFunnelProps {
  stages: FunnelStage[];
  title?: string;
  className?: string;
}

const PerformanceFunnel: React.FC<PerformanceFunnelProps> = ({
  stages,
  title = 'Funil de Performance',
  className,
}) => {
  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "bg-card rounded-2xl p-6 border border-border/50",
        "shadow-[0_4px_24px_-4px_hsl(210_60%_15%/0.08)]",
        className
      )}
    >
      <h3 className="font-semibold text-foreground mb-6">{title}</h3>
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const isLast = index === stages.length - 1;
          
          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">
                  {stage.name}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {stage.value}
                </span>
              </div>
              
              <div className="relative">
                <div className="h-10 bg-muted/50 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.2 * index + 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="h-full rounded-lg flex items-center justify-end pr-3"
                    style={{ backgroundColor: stage.color }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 * index + 0.8 }}
                      className="text-xs font-semibold text-white drop-shadow-sm"
                    >
                      {widthPercent.toFixed(0)}%
                    </motion.span>
                  </motion.div>
                </div>
              </div>
              
              {!isLast && (
                <div className="flex justify-center py-1">
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Conversion Rate */}
      {stages.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 pt-4 border-t border-border/50"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Taxa de conversão total</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-success">
                {((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(1)}%
              </span>
              <ArrowRight className="w-4 h-4 text-success" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PerformanceFunnel;
