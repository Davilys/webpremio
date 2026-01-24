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
  // Premiação - Devedores (2 faixas)
  devedores_faixa_limite: number; // Limite da primeira faixa (ex: 1999)
  devedores_bonus_faixa_1: number; // Premiação para valores até o limite (ex: R$ 50)
  devedores_bonus_faixa_2: number; // Premiação para valores acima do limite (ex: R$ 100)
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
  devedores_faixa_limite: 1999, // Valores até R$ 1.999
  devedores_bonus_faixa_1: 50,  // R$ 50 para valores de R$ 901 a R$ 1.999
  devedores_bonus_faixa_2: 100, // R$ 100 para valores de R$ 2.000+
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
