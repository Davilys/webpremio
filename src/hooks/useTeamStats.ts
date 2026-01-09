import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile, UserRole, Registration, calculateRegistroBonus, calculatePublicacaoBonus } from '@/types/database';
import { startOfMonth, endOfMonth, format, subMonths, startOfYear, subYears } from 'date-fns';

export interface UserWithStats extends Profile {
  role: UserRole;
  totalRegistros: number;
  totalPublicacoes: number;
  totalBonus: number;
  monthlyBonus: number;
  quarterlyBonus: number;
  yearlyBonus: number;
  evolution: number; // Percentage evolution from last period
}

export interface TeamStats {
  totalUsers: number;
  activeUsers: number;
  totalBonus: number;
  monthlyBonus: number;
  quarterlyBonus: number;
  yearlyBonus: number;
  totalRegistros: number;
  totalPublicacoes: number;
  averageBonus: number;
  topPerformer: UserWithStats | null;
}

export const useTeamStats = (selectedDate: Date = new Date()) => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamStats = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch profiles and roles
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('nome'),
        supabase.from('user_roles').select('*'),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const profiles = profilesRes.data || [];
      const roles = rolesRes.data || [];

      // Date ranges
      const monthStart = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
      
      const quarterStart = format(startOfMonth(subMonths(selectedDate, 2)), 'yyyy-MM-dd');
      const yearStart = format(startOfYear(selectedDate), 'yyyy-MM-dd');
      
      const prevMonthStart = format(startOfMonth(subMonths(selectedDate, 1)), 'yyyy-MM-dd');
      const prevMonthEnd = format(endOfMonth(subMonths(selectedDate, 1)), 'yyyy-MM-dd');

      // Fetch all registrations for the year
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select('*')
        .gte('data_referencia', yearStart)
        .lte('data_referencia', monthEnd);

      if (regError) throw regError;

      // Calculate stats for each user
      const usersWithStats: UserWithStats[] = profiles.map((profile) => {
        const userRole = roles.find((r) => r.user_id === profile.id);
        const userRegs = (registrations || []).filter((r) => r.user_id === profile.id);

        // Current month
        const monthRegs = userRegs.filter(
          (r) => r.data_referencia >= monthStart && r.data_referencia <= monthEnd
        );
        
        // Quarter (last 3 months)
        const quarterRegs = userRegs.filter(
          (r) => r.data_referencia >= quarterStart && r.data_referencia <= monthEnd
        );
        
        // Year
        const yearRegs = userRegs.filter(
          (r) => r.data_referencia >= yearStart && r.data_referencia <= monthEnd
        );
        
        // Previous month for evolution
        const prevMonthRegs = userRegs.filter(
          (r) => r.data_referencia >= prevMonthStart && r.data_referencia <= prevMonthEnd
        );

        const calculatePeriodBonus = (regs: typeof userRegs) => {
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

          const registroBonus = calculateRegistroBonus(registroTotal, registroAvista, registroParcelado, registroPromocao);
          const publicacaoBonus = calculatePublicacaoBonus(publicacaoAvista, publicacaoParcelado);

          return {
            registros: registroTotal,
            publicacoes: publicacaoAvista + publicacaoParcelado,
            bonus: registroBonus.total + publicacaoBonus.total,
          };
        };

        const monthStats = calculatePeriodBonus(monthRegs);
        const quarterStats = calculatePeriodBonus(quarterRegs);
        const yearStats = calculatePeriodBonus(yearRegs);
        const prevMonthStats = calculatePeriodBonus(prevMonthRegs);

        // Calculate evolution (percentage change from previous month)
        const evolution = prevMonthStats.bonus > 0
          ? ((monthStats.bonus - prevMonthStats.bonus) / prevMonthStats.bonus) * 100
          : monthStats.bonus > 0 ? 100 : 0;

        return {
          ...profile,
          role: (userRole?.role as UserRole) || 'funcionario',
          totalRegistros: yearStats.registros,
          totalPublicacoes: yearStats.publicacoes,
          totalBonus: yearStats.bonus,
          monthlyBonus: monthStats.bonus,
          quarterlyBonus: quarterStats.bonus,
          yearlyBonus: yearStats.bonus,
          evolution,
        };
      });

      setUsers(usersWithStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStats();
  }, [isAdmin, selectedDate]);

  const teamStats = useMemo((): TeamStats => {
    const activeUsers = users.filter((u) => u.status !== false);
    const totalBonus = users.reduce((sum, u) => sum + u.totalBonus, 0);
    const monthlyBonus = users.reduce((sum, u) => sum + u.monthlyBonus, 0);
    const quarterlyBonus = users.reduce((sum, u) => sum + u.quarterlyBonus, 0);
    const yearlyBonus = users.reduce((sum, u) => sum + u.yearlyBonus, 0);
    const totalRegistros = users.reduce((sum, u) => sum + u.totalRegistros, 0);
    const totalPublicacoes = users.reduce((sum, u) => sum + u.totalPublicacoes, 0);
    
    const topPerformer = users.length > 0
      ? users.reduce((top, u) => (u.monthlyBonus > top.monthlyBonus ? u : top), users[0])
      : null;

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      totalBonus,
      monthlyBonus,
      quarterlyBonus,
      yearlyBonus,
      totalRegistros,
      totalPublicacoes,
      averageBonus: users.length > 0 ? monthlyBonus / users.length : 0,
      topPerformer,
    };
  }, [users]);

  return {
    users,
    teamStats,
    loading,
    error,
    refetch: fetchTeamStats,
  };
};
