import React, { forwardRef } from 'react';
import { UserWithStats } from '@/hooks/useTeamStats';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ShieldCheck, User } from 'lucide-react';

interface UserKanbanCardProps {
  user: UserWithStats;
  onClick?: () => void;
}

const UserKanbanCard = forwardRef<HTMLDivElement, UserKanbanCardProps>(
  ({ user, onClick }, ref) => {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    const getEvolutionIcon = () => {
      if (user.evolution > 5) {
        return <TrendingUp className="w-4 h-4 text-success" />;
      } else if (user.evolution < -5) {
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      }
      return <Minus className="w-4 h-4 text-muted-foreground" />;
    };

    const getEvolutionColor = () => {
      if (user.evolution > 5) return 'text-success';
      if (user.evolution < -5) return 'text-destructive';
      return 'text-muted-foreground';
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "bg-card rounded-xl p-4 card-shadow cursor-pointer transition-all duration-200",
          "hover:card-shadow-hover hover:scale-[1.02] hover:border-primary/30",
          "border border-border/50",
          !user.status && "opacity-60"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              user.role === 'admin' 
                ? "bg-primary/20 text-primary" 
                : "bg-accent/20 text-accent"
            )}>
              <span className="text-sm font-bold">
                {user.nome?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                {user.nome}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {user.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>Administrador</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" />
                    <span>Funcionário</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className={cn(
            "w-2 h-2 rounded-full",
            user.status !== false ? "bg-success" : "bg-muted-foreground"
          )} />
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Premiação Mensal</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(user.monthlyBonus)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Evolução</span>
            <div className={cn("flex items-center gap-1 font-medium", getEvolutionColor())}>
              {getEvolutionIcon()}
              <span>{user.evolution > 0 ? '+' : ''}{user.evolution.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>{user.totalRegistros} registros</span>
          <span>{user.totalPublicacoes} publicações</span>
        </div>
      </div>
    );
  }
);

UserKanbanCard.displayName = 'UserKanbanCard';

export default UserKanbanCard;
