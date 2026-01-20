import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RegistrationWithProfile, Profile, calculateDevedoresBonus } from '@/types/database';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const useDevedores = (selectedDate: Date, userId?: string) => {
  const { user, isAdmin } = useAuth();
  const [devedores, setDevedores] = useState<RegistrationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userIdRef = useRef(user?.id);
  const isAdminRef = useRef(isAdmin);
  
  useEffect(() => {
    userIdRef.current = user?.id;
    isAdminRef.current = isAdmin;
  }, [user?.id, isAdmin]);

  const fetchDevedores = useCallback(async () => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) {
      setLoading(false);
      setDevedores([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');

      let query = supabase
        .from('registrations')
        .select('*')
        .eq('tipo_premiacao', 'devedores')
        .gte('data_referencia', startDate)
        .lte('data_referencia', endDate)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (!isAdminRef.current) {
        query = query.eq('user_id', currentUserId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Fetch profiles separately for admin view
      let devedoresWithProfiles: RegistrationWithProfile[] = (data || []) as RegistrationWithProfile[];
      
      if (isAdminRef.current && data && data.length > 0) {
        const userIds = [...new Set(data.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);
        
        const profilesMap = new Map<string, Profile>();
        (profilesData || []).forEach(p => profilesMap.set(p.id, p as Profile));
        
        devedoresWithProfiles = data.map(r => ({
          ...r,
          profiles: profilesMap.get(r.user_id)
        })) as RegistrationWithProfile[];
      }

      setDevedores(devedoresWithProfiles);
    } catch (err) {
      console.error('Error fetching devedores:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      setDevedores([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, userId]);

  useEffect(() => {
    if (user?.id) {
      fetchDevedores();
    } else {
      setLoading(false);
      setDevedores([]);
    }
  }, [fetchDevedores, user?.id]);

  // Calcula o total de premiação para devedores
  const getTotalBonus = useCallback(() => {
    return devedores.reduce((sum, d) => {
      const valorResolvido = d.valor_resolvido || 0;
      const quantidadeParcelas = d.quantidade_parcelas || 0;
      const bonus = calculateDevedoresBonus(valorResolvido, quantidadeParcelas);
      return sum + bonus.total;
    }, 0);
  }, [devedores]);

  // Calcula o total de valor resolvido
  const getTotalValorResolvido = useCallback(() => {
    return devedores.reduce((sum, d) => sum + (d.valor_resolvido || 0), 0);
  }, [devedores]);

  // Calcula o total de parcelas
  const getTotalParcelas = useCallback(() => {
    return devedores.reduce((sum, d) => sum + (d.quantidade_parcelas || 0), 0);
  }, [devedores]);

  return {
    devedores,
    loading,
    error,
    refetch: fetchDevedores,
    getTotalBonus,
    getTotalValorResolvido,
    getTotalParcelas,
  };
};
