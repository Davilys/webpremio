import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Wallet, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { 
  DEVEDORES_BONUS_TIER_1,
  DEVEDORES_BONUS_TIER_2,
  DEVEDORES_BONUS_TIER_3,
  DEVEDORES_BONUS_TIER_4
} from '@/types/database';

interface BonusPanelDevedoresProps {
  totalBonus: number;
  totalValorResolvido: number;
  totalParcelas: number;
  totalRegistros: number;
  monthYear: string;
  className?: string;
}

const BonusPanelDevedores = forwardRef<HTMLDivElement, BonusPanelDevedoresProps>(({
  totalBonus,
  totalValorResolvido,
  totalParcelas,
  totalRegistros,
  monthYear,
  className,
}, ref) => {
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
      <div className="p-6 gradient-primary">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary-foreground">Devedores</h3>
            <p className="text-sm text-primary-foreground/80">{monthYear}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-primary-foreground/60" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Receipt className="w-4 h-4" />
              <span className="text-xs font-medium">Registros</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalRegistros}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Valor Resolvido</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(totalValorResolvido)}
            </p>
          </div>
        </div>

        {/* Faixas de Premiação */}
        <div className="space-y-2 p-4 rounded-lg bg-muted/30">
          <p className="text-sm font-medium text-muted-foreground mb-3">Faixas de Premiação por Parcela</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Até R$ 598</span>
              <span className="font-medium">{formatCurrency(DEVEDORES_BONUS_TIER_1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">R$ 599 a R$ 900</span>
              <span className="font-medium">{formatCurrency(DEVEDORES_BONUS_TIER_2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">R$ 901 a R$ 1.999</span>
              <span className="font-medium">{formatCurrency(DEVEDORES_BONUS_TIER_3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Acima de R$ 2.000</span>
              <span className="font-medium">{formatCurrency(DEVEDORES_BONUS_TIER_4)}</span>
            </div>
          </div>
        </div>

        {/* Total de Parcelas */}
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Total de Parcelas</p>
              <p className="text-xl font-bold">{totalParcelas}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="p-4 rounded-lg text-center bg-secondary">
          <p className="text-sm font-medium mb-1 text-muted-foreground">
            Total da Premiação
          </p>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(totalBonus)}
          </p>
        </div>
      </div>
    </div>
  );
});

BonusPanelDevedores.displayName = 'BonusPanelDevedores';

export default BonusPanelDevedores;
