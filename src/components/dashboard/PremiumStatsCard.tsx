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
      iconBg: 'bg-gradient-to-br from-secondary to-muted',
      iconColor: 'text-secondary-foreground',
      ring: 'ring-secondary/20',
    },
    success: {
      iconBg: 'bg-gradient-to-br from-success to-success/80',
      iconColor: 'text-success-foreground',
      ring: 'ring-success/20',
    },
    warning: {
      iconBg: 'bg-gradient-to-br from-warning to-warning/80',
      iconColor: 'text-warning-foreground',
      ring: 'ring-warning/20',
    },
    primary: {
      iconBg: 'bg-gradient-to-br from-primary to-primary/80',
      iconColor: 'text-primary-foreground',
      ring: 'ring-primary/20',
    },
    accent: {
      iconBg: 'bg-gradient-to-br from-accent to-primary',
      iconColor: 'text-accent-foreground',
      ring: 'ring-accent/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "relative bg-card rounded-2xl p-6 overflow-hidden",
        "border border-border/50",
        "shadow-[0_4px_24px_-4px_hsl(210_60%_15%/0.08),0_2px_8px_-2px_hsl(210_60%_15%/0.04)]",
        "hover:shadow-[0_20px_40px_-12px_hsl(210_60%_15%/0.15)]",
        "transition-shadow duration-300",
        className
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <div className="text-3xl font-bold text-foreground">
            <AnimatedCounter 
              value={value} 
              formatAsCurrency={formatAsCurrency}
              duration={1.2}
            />
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: delay + 0.2, 
            type: 'spring', 
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 }
          }}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            "ring-4",
            styles.iconBg,
            styles.ring
          )}
        >
          <Icon className={cn("w-7 h-7", styles.iconColor)} />
        </motion.div>
      </div>

      {trend && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.4, duration: 0.3 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
                trend.value >= 0 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-sm text-muted-foreground">{trend.label}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

PremiumStatsCard.displayName = 'PremiumStatsCard';

export default PremiumStatsCard;
