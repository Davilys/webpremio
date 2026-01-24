import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemSettings {
  // Premiação - Registro de Marca
  registro_bonus_base: number;
  registro_bonus_meta_atingida: number;
  registro_meta_quantidade: number;
  registro_promocao_bonus: number;
  // Premiação - Publicação
  publicacao_bonus_avista: number;
  publicacao_bonus_parcelado: number;
  publicacao_bonus_promocao: number;
  // Premiação - Devedores (5 faixas baseadas no valor da parcela)
  devedores_faixa_1_min: number;   // R$ 199
  devedores_faixa_1_max: number;   // R$ 397
  devedores_faixa_2_max: number;   // R$ 597
  devedores_faixa_3_max: number;   // R$ 999
  devedores_faixa_4_max: number;   // R$ 1.500
  devedores_bonus_faixa_1: number; // R$ 10 por parcela
  devedores_bonus_faixa_2: number; // R$ 25 por parcela
  devedores_bonus_faixa_3: number; // R$ 50 por parcela
  devedores_bonus_faixa_4: number; // R$ 75 por parcela
  devedores_bonus_faixa_5: number; // R$ 100 por parcela
  // Valores de Serviços
  registro_valor_avista: number;
  registro_valor_parcelado: number;
  publicacao_valor_avista: number;
  publicacao_valor_parcelado: number;
}

// Valores padrão (fallback)
export const DEFAULT_SETTINGS: SystemSettings = {
  registro_bonus_base: 50,
  registro_bonus_meta_atingida: 100,
  registro_meta_quantidade: 30,
  registro_promocao_bonus: 50,
  publicacao_bonus_avista: 100,
  publicacao_bonus_parcelado: 50,
  publicacao_bonus_promocao: 50,
  // Faixas de Devedores (baseado no valor da parcela)
  devedores_faixa_1_min: 199,   // Mínimo da faixa 1
  devedores_faixa_1_max: 397,   // Máximo da faixa 1
  devedores_faixa_2_max: 597,   // Máximo da faixa 2
  devedores_faixa_3_max: 999,   // Máximo da faixa 3
  devedores_faixa_4_max: 1500,  // Máximo da faixa 4
  devedores_bonus_faixa_1: 10,  // R$ 10 por parcela (R$ 199 a R$ 397)
  devedores_bonus_faixa_2: 25,  // R$ 25 por parcela (R$ 398 a R$ 597)
  devedores_bonus_faixa_3: 50,  // R$ 50 por parcela (R$ 598 a R$ 999)
  devedores_bonus_faixa_4: 75,  // R$ 75 por parcela (R$ 1.000 a R$ 1.500)
  devedores_bonus_faixa_5: 100, // R$ 100 por parcela (Acima de R$ 1.518)
  // Valores de Serviços
  registro_valor_avista: 699.99,
  registro_valor_parcelado: 1194.00,
  publicacao_valor_avista: 1518.00,
  publicacao_valor_parcelado: 2388.00,
};

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');

      if (error) throw error;

      if (data) {
        const settingsMap: Partial<SystemSettings> = {};
        data.forEach((item) => {
          const key = item.key as keyof SystemSettings;
          if (key in DEFAULT_SETTINGS) {
            // Parse JSONB value - pode ser string ou número
            const rawValue = item.value;
            settingsMap[key] = typeof rawValue === 'string' 
              ? parseFloat(rawValue) 
              : (typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue)));
          }
        });
        setSettings({ ...DEFAULT_SETTINGS, ...settingsMap });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateSetting = async (key: keyof SystemSettings, value: number) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          value: value.toString(),
          updated_at: new Date().toISOString(),
        })
        .eq('key', key);

      if (error) throw error;

      setSettings((prev) => ({ ...prev, [key]: value }));
      
      toast({
        title: 'Sucesso',
        description: 'Configuração atualizada com sucesso.',
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a configuração.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateMultipleSettings = async (updates: Partial<SystemSettings>) => {
    try {
      setSaving(true);
      
      const promises = Object.entries(updates).map(([key, value]) =>
        supabase
          .from('system_settings')
          .update({ 
            value: value.toString(),
            updated_at: new Date().toISOString(),
          })
          .eq('key', key)
      );

      const results = await Promise.all(promises);
      const hasError = results.some((r) => r.error);

      if (hasError) {
        throw new Error('Erro ao atualizar algumas configurações');
      }

      setSettings((prev) => ({ ...prev, ...updates }));
      
      toast({
        title: 'Sucesso',
        description: 'Configurações atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    saving,
    updateSetting,
    updateMultipleSettings,
    refetch: fetchSettings,
  };
};

// Hook para obter configurações em tempo real (para uso em cálculos)
export const useSettingsValues = () => {
  const { settings, loading } = useSystemSettings();
  return { ...settings, loading };
};
