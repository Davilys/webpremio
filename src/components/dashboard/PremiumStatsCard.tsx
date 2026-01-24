import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface PremiumStatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'primary' | 'accent';
  className?: string;
  formatAsCurrency?: boolean;
  delay?: number;
}

const PremiumStatsCard = forwardRef<HTMLDivElement, PremiumStatsCardProps>(({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  formatAsCurrency = false,
  delay = 0,
}, ref) => {
  const variantStyles = {
    default: {
      iconBg: 'bg-secondary',
      iconColor: 'text-foreground',
      border: 'border-border/50',
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      border: 'border-success/20',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      border: 'border-warning/20',
    },
    primary: {
      iconBg: 'bg-primary',
      iconColor: 'text-primary-foreground',
      border: 'border-border/50',
    },
    accent: {
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      border: 'border-accent/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative bg-card rounded-2xl p-4 sm:p-6",
        "border",
        styles.border,
        "hover:shadow-lg hover:shadow-foreground/5",
        "transition-all duration-300",
        "active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            <AnimatedCounter 
              value={value} 
              formatAsCurrency={formatAsCurrency}
              duration={1}
            />
          </div>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: delay + 0.2, 
            type: 'spring', 
            stiffness: 200,
            damping: 15
          }}
          className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            styles.iconBg
          )}
        >
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", styles.iconColor)} />
        </motion.div>
      </div>

      {trend && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                trend.value >= 0 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

PremiumStatsCard.displayName = 'PremiumStatsCard';

export default PremiumStatsCard;
