import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Target, DollarSign, CreditCard, Banknote, Tag } from 'lucide-react';
import { 
  BONUS_GOAL, 
  BONUS_VALUE_REGISTRO, 
  BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL,
  BONUS_VALUE_PROMOCAO,
  calculateRegistroBonus 
} from '@/types/database';

interface BonusPanelRegistroProps {
  title: string;
  icon: React.ReactNode;
  avistaQuantity: number;
  parceladoQuantity: number;
  promocaoQuantity?: number;
  monthYear: string;
  className?: string;
}

const BonusPanelRegistro = forwardRef<HTMLDivElement, BonusPanelRegistroProps>(({
  title,
  icon,
  avistaQuantity = 0,
  parceladoQuantity = 0,
  promocaoQuantity = 0,
  monthYear,
  className,
}, ref) => {
  // Total para meta = APENAS à vista (parcelado e promocao NÃO contam)
  const totalParaMeta = avistaQuantity;
  const bonusData = calculateRegistroBonus(avistaQuantity + parceladoQuantity + promocaoQuantity, avistaQuantity, parceladoQuantity, promocaoQuantity);
  const progress = Math.min((avistaQuantity / BONUS_GOAL) * 100, 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "p-6",
        bonusData.goalReached ? "gradient-accent" : "gradient-primary"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary-foreground">{title}</h3>
            <p className="text-sm text-primary-foreground/80">{monthYear}</p>
          </div>
          {bonusData.goalReached ? (
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
              {totalParaMeta} / {BONUS_GOAL}
            </span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-3",
              bonusData.goalReached && "[&>div]:gradient-accent"
            )}
          />
        </div>

        {/* Breakdown by payment method - 3 columns */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Banknote className="w-4 h-4" />
              <span className="text-xs font-medium">À Vista</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {avistaQuantity}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(bonusData.goalReached ? BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL : BONUS_VALUE_REGISTRO)}/un
            </p>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">Parcelado</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {parceladoQuantity}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(BONUS_VALUE_REGISTRO)}/un
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-medium">Personalizado</span>
            </div>
            <p className="text-lg font-bold text-amber-500">
              {promocaoQuantity}
            </p>
            <p className="text-xs text-amber-500/70 mt-1">
              {formatCurrency(BONUS_VALUE_PROMOCAO)}/un
            </p>
          </div>
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
              bonusData.goalReached ? "text-success" : "text-destructive"
            )}>
              {bonusData.goalReached ? 'SIM' : 'NÃO'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Bônus À Vista</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {bonusData.goalReached ? '2x' : '1x'}
            </p>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="space-y-2 p-4 rounded-lg bg-muted/30">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {avistaQuantity} à vista × {formatCurrency(bonusData.goalReached ? BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL : BONUS_VALUE_REGISTRO)}
            </span>
            <span className="font-medium">{formatCurrency(bonusData.avistaValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {parceladoQuantity} parcelado × {formatCurrency(BONUS_VALUE_REGISTRO)}
            </span>
            <span className="font-medium">{formatCurrency(bonusData.parceladoValue)}</span>
          </div>
          {promocaoQuantity > 0 && (
            <div className="flex justify-between text-sm border-t border-border/50 pt-2 mt-2">
              <span className="text-amber-500">
                {promocaoQuantity} personalizado × {formatCurrency(BONUS_VALUE_PROMOCAO)}
              </span>
              <span className="font-medium text-amber-500">{formatCurrency(bonusData.promocaoValue)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className={cn(
          "p-4 rounded-lg text-center",
          bonusData.goalReached ? "gradient-accent" : "bg-secondary"
        )}>
          <p className={cn(
            "text-sm font-medium mb-1",
            bonusData.goalReached ? "text-accent-foreground/80" : "text-muted-foreground"
          )}>
            Total da Premiação
          </p>
          <p className={cn(
            "text-3xl font-bold",
            bonusData.goalReached ? "text-accent-foreground" : "text-foreground"
          )}>
            {formatCurrency(bonusData.total)}
          </p>
        </div>
      </div>
    </div>
  );
});

BonusPanelRegistro.displayName = 'BonusPanelRegistro';

export default BonusPanelRegistro;
