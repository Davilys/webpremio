-- Adicionar configurações de Devedores na tabela system_settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
  ('devedores_bonus_tier_1', '20', 'Bônus por parcela até R$ 598,00'),
  ('devedores_bonus_tier_2', '50', 'Bônus por parcela de R$ 599,00 até R$ 1.500,00'),
  ('devedores_bonus_tier_3', '100', 'Bônus por parcela acima de R$ 1.500,00'),
  ('devedores_faixa_1_limite', '598', 'Limite superior da faixa 1 (até R$)'),
  ('devedores_faixa_2_limite', '1500', 'Limite superior da faixa 2 (até R$)')
ON CONFLICT (key) DO NOTHING;