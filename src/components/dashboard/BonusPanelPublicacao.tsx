import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { DollarSign, CreditCard, Banknote, Sparkles } from 'lucide-react';
import { 
  PUBLICACAO_BONUS_AVISTA, 
  PUBLICACAO_BONUS_PARCELADO,
  PUBLICACAO_BONUS_PROMOCAO,
  calculatePublicacaoBonus 
} from '@/types/database';

interface BonusPanelPublicacaoProps {
  title: string;
  icon: React.ReactNode;
  avistaQuantity: number;
  parceladoQuantity: number;
  promocaoQuantity?: number;
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
  const totalQuantity = avistaQuantity + parceladoQuantity + promocaoQuantity;
  const bonusData = calculatePublicacaoBonus(avistaQuantity, parceladoQuantity, promocaoQuantity);

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
        </div>

        {/* Breakdown by payment method */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Banknote className="w-4 h-4" />
              <span className="text-xs font-medium">À Vista</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {avistaQuantity} <span className="text-xs font-normal text-muted-foreground">pub.</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(PUBLICACAO_BONUS_AVISTA)}/un
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">Parcelado</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {parceladoQuantity} <span className="text-xs font-normal text-muted-foreground">pub.</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(PUBLICACAO_BONUS_PARCELADO)}/un
            </p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-accent mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium">Personalizado</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {promocaoQuantity} <span className="text-xs font-normal text-muted-foreground">pub.</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(PUBLICACAO_BONUS_PROMOCAO)}/un
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
              {totalQuantity}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Valor Médio</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {totalQuantity > 0 ? formatCurrency(bonusData.total / totalQuantity) : formatCurrency(0)}
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
          <div className="flex justify-between text-sm">
            <span className="text-accent">
              {promocaoQuantity} personalizado × {formatCurrency(PUBLICACAO_BONUS_PROMOCAO)}
            </span>
            <span className="font-medium text-accent">{formatCurrency(bonusData.promocaoValue)}</span>
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