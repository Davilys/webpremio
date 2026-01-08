import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Target, DollarSign } from 'lucide-react';
import { BONUS_GOAL, BONUS_VALUE_AT_GOAL, BONUS_VALUE_BELOW_GOAL } from '@/types/database';

interface BonusPanelProps {
  title: string;
  icon: React.ReactNode;
  totalQuantity: number;
  monthYear: string;
  className?: string;
}

const BonusPanel: React.FC<BonusPanelProps> = ({
  title,
  icon,
  totalQuantity,
  monthYear,
  className,
}) => {
  const goalReached = totalQuantity >= BONUS_GOAL;
  const valuePerUnit = goalReached ? BONUS_VALUE_AT_GOAL : BONUS_VALUE_BELOW_GOAL;
  const totalBonus = totalQuantity * valuePerUnit;
  const progress = Math.min((totalQuantity / BONUS_GOAL) * 100, 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div
      className={cn(
        "bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "p-6",
        goalReached ? "gradient-accent" : "gradient-primary"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary-foreground">{title}</h3>
            <p className="text-sm text-primary-foreground/80">{monthYear}</p>
          </div>
          {goalReached ? (
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          ) : (
            <XCircle className="w-8 h-8 text-primary-foreground/60" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Progresso da Meta
            </span>
            <span className="text-sm font-bold">
              {totalQuantity} / {BONUS_GOAL}
            </span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-3",
              goalReached && "[&>div]:gradient-accent"
            )}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">Meta Atingida</span>
            </div>
            <p className={cn(
              "text-lg font-bold",
              goalReached ? "text-success" : "text-destructive"
            )}>
              {goalReached ? 'SIM' : 'NÃO'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Valor/Unidade</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(valuePerUnit)}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className={cn(
          "p-4 rounded-lg text-center",
          goalReached ? "gradient-accent" : "bg-secondary"
        )}>
          <p className={cn(
            "text-sm font-medium mb-1",
            goalReached ? "text-accent-foreground/80" : "text-muted-foreground"
          )}>
            Total da Premiação
          </p>
          <p className={cn(
            "text-3xl font-bold",
            goalReached ? "text-accent-foreground" : "text-foreground"
          )}>
            {formatCurrency(totalBonus)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BonusPanel;
