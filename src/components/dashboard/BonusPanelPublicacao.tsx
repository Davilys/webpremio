import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { DollarSign, CreditCard, Banknote, Ban } from 'lucide-react';
import { 
  PUBLICACAO_BONUS_AVISTA, 
  PUBLICACAO_BONUS_PARCELADO,
  calculatePublicacaoBonus 
} from '@/types/database';

interface BonusPanelPublicacaoProps {
  title: string;
  icon: React.ReactNode;
  avistaQuantity: number;
  parceladoQuantity: number;
  promocaoQuantity?: number; // Valor personalizado (sem premiação)
  monthYear: string;
  className?: string;
}

const BonusPanelPublicacao = forwardRef<HTMLDivElement, BonusPanelPublicacaoProps>(({
  title,
  icon,
  avistaQuantity = 0,
  parceladoQuantity = 0,
  promocaoQuantity = 0,
  monthYear,
  className,
}, ref) => {
  // totalPremiacao = apenas avista + parcelado (para cálculo de bônus)
  const totalPremiacao = avistaQuantity + parceladoQuantity;
  // totalPublicacoes = inclui promocao (total de publicações fechadas)
  const totalPublicacoes = totalPremiacao + promocaoQuantity;
  
  const bonusData = calculatePublicacaoBonus(avistaQuantity, parceladoQuantity);

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
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary-foreground">{title}</h3>
            <p className="text-sm text-primary-foreground/80">{monthYear}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Info - Sem meta */}
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            Sem meta • Premiação por forma de pagamento
          </p>
          {promocaoQuantity > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              {promocaoQuantity} publicação(ões) com valor personalizado (sem premiação)
            </p>
          )}
        </div>

        {/* Breakdown by payment method */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Banknote className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">À Vista</span>
            </div>
            <p className="text-base font-bold text-foreground">
              {avistaQuantity}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {formatCurrency(PUBLICACAO_BONUS_AVISTA)}/un
            </p>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Parcelado</span>
            </div>
            <p className="text-base font-bold text-foreground">
              {parceladoQuantity}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {formatCurrency(PUBLICACAO_BONUS_PARCELADO)}/un
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <Ban className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">V. Pers.</span>
            </div>
            <p className="text-base font-bold text-amber-600 dark:text-amber-400">
              {promocaoQuantity}
            </p>
            <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-1">
              R$ 0,00/un
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Total Publicações</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {totalPublicacoes}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Valor Médio</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {totalPremiacao > 0 ? formatCurrency(bonusData.total / totalPremiacao) : formatCurrency(0)}
            </p>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="space-y-2 p-4 rounded-lg bg-muted/30">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {avistaQuantity} à vista × {formatCurrency(PUBLICACAO_BONUS_AVISTA)}
            </span>
            <span className="font-medium">{formatCurrency(bonusData.avistaValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {parceladoQuantity} parcelado × {formatCurrency(PUBLICACAO_BONUS_PARCELADO)}
            </span>
            <span className="font-medium">{formatCurrency(bonusData.parceladoValue)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="p-4 rounded-lg text-center bg-secondary">
          <p className="text-sm font-medium mb-1 text-muted-foreground">
            Total da Premiação
          </p>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(bonusData.total)}
          </p>
        </div>
      </div>
    </div>
  );
});

BonusPanelPublicacao.displayName = 'BonusPanelPublicacao';

export default BonusPanelPublicacao;
