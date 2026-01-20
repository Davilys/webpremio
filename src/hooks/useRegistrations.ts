import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Registration, BonusType, RegistrationWithProfile, Profile } from '@/types/database';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const useRegistrations = (
  selectedDate: Date,
  bonusType?: BonusType,
  userId?: string
) => {
  const { user, isAdmin } = useAuth();
  const [registrations, setRegistrations] = useState<RegistrationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid unnecessary re-renders when dependencies change
  const userIdRef = useRef(user?.id);
  const isAdminRef = useRef(isAdmin);
  
  // Update refs when values change
  useEffect(() => {
    userIdRef.current = user?.id;
    isAdminRef.current = isAdmin;
  }, [user?.id, isAdmin]);

  const fetchRegistrations = useCallback(async () => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) {
      setLoading(false);
      setRegistrations([]);
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
        .gte('data_referencia', startDate)
        .lte('data_referencia', endDate)
        .order('created_at', { ascending: false });

      if (bonusType) {
        query = query.eq('tipo_premiacao', bonusType);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (!isAdminRef.current) {
        query = query.eq('user_id', currentUserId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Fetch profiles separately for admin view
      let registrationsWithProfiles: RegistrationWithProfile[] = (data || []) as Registration[];
      
      if (isAdminRef.current && data && data.length > 0) {
        const userIds = [...new Set(data.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);
        
        const profilesMap = new Map<string, Profile>();
        (profilesData || []).forEach(p => profilesMap.set(p.id, p as Profile));
        
        registrationsWithProfiles = data.map(r => ({
          ...r,
          profiles: profilesMap.get(r.user_id)
        })) as RegistrationWithProfile[];
      }

      setRegistrations(registrationsWithProfiles);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, bonusType, userId]);

  // Fetch when dependencies change, but use stable reference for user
  useEffect(() => {
    if (user?.id) {
      fetchRegistrations();
    } else {
      setLoading(false);
      setRegistrations([]);
    }
  }, [fetchRegistrations, user?.id]);

  const getTotalQuantity = useCallback((type?: BonusType) => {
    const filtered = type
      ? registrations.filter((r) => r.tipo_premiacao === type)
      : registrations;
    return filtered.reduce((sum, r) => sum + r.quantidade, 0);
  }, [registrations]);

  // Memoized function to get quantities by payment type
  const getQuantityByPayment = useCallback((type: BonusType) => {
    const filtered = registrations.filter((r) => r.tipo_premiacao === type);
    
    const avista = filtered
      .filter((r) => r.forma_pagamento === 'avista')
      .reduce((sum, r) => sum + r.quantidade, 0);
    
    const parcelado = filtered
      .filter((r) => r.forma_pagamento === 'parcelado')
      .reduce((sum, r) => sum + r.quantidade, 0);
    
    const promocao = filtered
      .filter((r) => r.forma_pagamento === 'promocao')
      .reduce((sum, r) => sum + r.quantidade, 0);
    
    // Total para meta = APENAS avista (parcelado e promocao NÃO contam para meta)
    const totalParaMeta = avista;
    // Total geral = todos os tipos
    const total = avista + parcelado + promocao;
    
    return { avista, parcelado, promocao, totalParaMeta, total };
  }, [registrations]);

  return {
    registrations,
    loading,
    error,
    refetch: fetchRegistrations,
    getTotalQuantity,
    getQuantityByPayment,
  };
};
