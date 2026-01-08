import React, { forwardRef } from 'react';
import { UserWithStats } from '@/hooks/useTeamStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamRankingChartProps {
  users: UserWithStats[];
  period: 'monthly' | 'quarterly' | 'yearly';
}

const TeamRankingChart = forwardRef<HTMLDivElement, TeamRankingChartProps>(
  ({ users, period }, ref) => {
    const getBonusValue = (user: UserWithStats) => {
      switch (period) {
        case 'monthly':
          return user.monthlyBonus;
        case 'quarterly':
          return user.quarterlyBonus;
        case 'yearly':
          return user.yearlyBonus;
        default:
          return user.monthlyBonus;
      }
    };

    const sortedUsers = [...users]
      .sort((a, b) => getBonusValue(b) - getBonusValue(a))
      .slice(0, 10);

    const chartData = sortedUsers.map((user, index) => ({
      name: user.nome?.split(' ')[0] || 'Usuário',
      fullName: user.nome,
      value: getBonusValue(user),
      rank: index + 1,
    }));

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
      }).format(value);
    };

    const getBarColor = (rank: number) => {
      if (rank === 1) return 'hsl(var(--primary))';
      if (rank === 2) return 'hsl(var(--accent))';
      if (rank === 3) return 'hsl(var(--success))';
      return 'hsl(var(--muted-foreground) / 0.5)';
    };

    const getRankIcon = (rank: number) => {
      if (rank === 1) return <Trophy className="w-5 h-5 text-primary" />;
      if (rank === 2) return <Medal className="w-5 h-5 text-accent" />;
      if (rank === 3) return <Award className="w-5 h-5 text-success" />;
      return null;
    };

    const periodLabel = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      yearly: 'Anual',
    };

    return (
      <div ref={ref} className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold mb-4">
          Ranking de Desempenho - {periodLabel[period]}
        </h3>

        {sortedUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {sortedUsers.slice(0, 3).map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "text-center p-4 rounded-lg",
                    index === 0 && "bg-primary/10 border-2 border-primary/30",
                    index === 1 && "bg-accent/10 border border-accent/30",
                    index === 2 && "bg-success/10 border border-success/30"
                  )}
                >
                  <div className="flex justify-center mb-2">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className={cn(
                    "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold",
                    index === 0 && "bg-primary text-primary-foreground",
                    index === 1 && "bg-accent text-accent-foreground",
                    index === 2 && "bg-success text-success-foreground"
                  )}>
                    {user.nome?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <p className="font-medium text-sm text-foreground line-clamp-1">
                    {user.nome?.split(' ')[0]}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(getBonusValue(user))}
                  </p>
                </div>
              ))}
            </div>

            {/* Bar Chart */}
            {chartData.length > 3 && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => formatCurrency(value)}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Premiação']}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.rank)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

TeamRankingChart.displayName = 'TeamRankingChart';

export default TeamRankingChart;
