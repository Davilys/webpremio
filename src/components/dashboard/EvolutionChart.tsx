import React, { forwardRef, useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { calculateRegistroBonus, calculatePublicacaoBonus } from '@/types/database';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EvolutionChartProps {
  userId?: string;
  showTeamAverage?: boolean;
  months?: number;
}

interface ChartData {
  month: string;
  userBonus: number;
  teamAverage?: number;
  bestPerformer?: number;
}

const EvolutionChart = forwardRef<HTMLDivElement, EvolutionChartProps>(
  ({ userId, showTeamAverage = false, months = 6 }, ref) => {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchEvolutionData = async () => {
        setLoading(true);
        try {
          const now = new Date();
          const chartData: ChartData[] = [];

          for (let i = months - 1; i >= 0; i--) {
            const date = subMonths(now, i);
            const monthStart = format(startOfMonth(date), 'yyyy-MM-dd');
            const monthEnd = format(endOfMonth(date), 'yyyy-MM-dd');
            const monthLabel = format(date, 'MMM', { locale: ptBR });

            let query = supabase
              .from('registrations')
              .select('*')
              .gte('data_referencia', monthStart)
              .lte('data_referencia', monthEnd);

            const { data: registrations } = await query;

            if (registrations) {
              // Calculate user bonus
              const userRegs = userId 
                ? registrations.filter((r) => r.user_id === userId)
                : registrations;

              const calcBonus = (regs: typeof registrations) => {
                const registroRegs = regs.filter((r) => r.tipo_premiacao === 'registro');
                const publicacaoRegs = regs.filter((r) => r.tipo_premiacao === 'publicacao');

                const registroAvista = registroRegs
                  .filter((r) => r.forma_pagamento === 'avista')
                  .reduce((sum, r) => sum + r.quantidade, 0);
                const registroParcelado = registroRegs
                  .filter((r) => r.forma_pagamento === 'parcelado')
                  .reduce((sum, r) => sum + r.quantidade, 0);
                const registroPromocao = registroRegs
                  .filter((r) => r.forma_pagamento === 'promocao')
                  .reduce((sum, r) => sum + r.quantidade, 0);
                const registroTotal = registroAvista + registroParcelado;

                const publicacaoAvista = publicacaoRegs
                  .filter((r) => r.forma_pagamento === 'avista')
                  .reduce((sum, r) => sum + r.quantidade, 0);
                const publicacaoParcelado = publicacaoRegs
                  .filter((r) => r.forma_pagamento === 'parcelado')
                  .reduce((sum, r) => sum + r.quantidade, 0);
                const publicacaoPromocao = publicacaoRegs
                  .filter((r) => r.forma_pagamento === 'promocao')
                  .reduce((sum, r) => sum + r.quantidade, 0);

                const registroBonus = calculateRegistroBonus(registroTotal, registroAvista, registroParcelado, registroPromocao);
                const publicacaoBonus = calculatePublicacaoBonus(publicacaoAvista, publicacaoParcelado, publicacaoPromocao);

                return registroBonus.total + publicacaoBonus.total;
              };

              const userBonus = calcBonus(userRegs);

              const entry: ChartData = {
                month: monthLabel,
                userBonus,
              };

              if (showTeamAverage) {
                // Calculate team average and best performer
                const userIds = [...new Set(registrations.map((r) => r.user_id))];
                const bonusByUser: Record<string, number> = {};

                userIds.forEach((id) => {
                  const userRegs = registrations.filter((r) => r.user_id === id);
                  bonusByUser[id] = calcBonus(userRegs);
                });

                const allBonuses = Object.values(bonusByUser);
                entry.teamAverage = allBonuses.length > 0 
                  ? allBonuses.reduce((a, b) => a + b, 0) / allBonuses.length 
                  : 0;
                entry.bestPerformer = allBonuses.length > 0 
                  ? Math.max(...allBonuses) 
                  : 0;
              }

              chartData.push(entry);
            }
          }

          setData(chartData);
        } catch (error) {
          console.error('Error fetching evolution data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvolutionData();
    }, [userId, showTeamAverage, months]);

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
      }).format(value);
    };

    if (loading) {
      return (
        <div ref={ref} className="bg-card rounded-xl p-6 card-shadow">
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Carregando gráfico...
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold mb-4">Evolução de Premiação</h3>
        
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'userBonus' ? 'Sua Premiação' : 
                    name === 'teamAverage' ? 'Média da Equipe' : 'Melhor Resultado'
                  ]}
                />
                <Legend 
                  formatter={(value) => 
                    value === 'userBonus' ? 'Sua Premiação' : 
                    value === 'teamAverage' ? 'Média da Equipe' : 'Melhor Resultado'
                  }
                />
                <Line
                  type="monotone"
                  dataKey="userBonus"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {showTeamAverage && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="teamAverage"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bestPerformer"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }
);

EvolutionChart.displayName = 'EvolutionChart';

export default EvolutionChart;
