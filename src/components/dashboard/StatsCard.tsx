import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'primary';
  className?: string;
}

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}, ref) => {
  const variantStyles = {
    default: {
      iconBg: 'bg-secondary',
      iconColor: 'text-secondary-foreground',
    },
    success: {
      iconBg: 'gradient-accent',
      iconColor: 'text-accent-foreground',
    },
    warning: {
      iconBg: 'bg-warning',
      iconColor: 'text-warning-foreground',
    },
    primary: {
      iconBg: 'gradient-primary',
      iconColor: 'text-primary-foreground',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground animate-number-tick">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            styles.iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", styles.iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                trend.value >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-sm text-muted-foreground">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
