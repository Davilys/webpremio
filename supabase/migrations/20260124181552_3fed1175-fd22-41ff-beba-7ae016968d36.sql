-- Limpar configurações antigas de devedores e adicionar as 5 novas faixas
DELETE FROM public.system_settings WHERE key LIKE 'devedores_%';

-- Inserir as novas configurações de 5 faixas
INSERT INTO public.system_settings (key, value, description)
VALUES 
  -- Limites das faixas (valor da parcela)
  ('devedores_faixa_1_min', '199', 'Limite inferior da faixa 1 (R$)'),
  ('devedores_faixa_1_max', '397', 'Limite superior da faixa 1 (R$)'),
  ('devedores_faixa_2_max', '597', 'Limite superior da faixa 2 (R$)'),
  ('devedores_faixa_3_max', '999', 'Limite superior da faixa 3 (R$)'),
  ('devedores_faixa_4_max', '1500', 'Limite superior da faixa 4 (R$)'),
  -- Premiações por faixa
  ('devedores_bonus_faixa_1', '10', 'Premiação por parcela - Faixa 1 (R$ 199 a R$ 397)'),
  ('devedores_bonus_faixa_2', '25', 'Premiação por parcela - Faixa 2 (R$ 398 a R$ 597)'),
  ('devedores_bonus_faixa_3', '50', 'Premiação por parcela - Faixa 3 (R$ 598 a R$ 999)'),
  ('devedores_bonus_faixa_4', '75', 'Premiação por parcela - Faixa 4 (R$ 1.000 a R$ 1.500)'),
  ('devedores_bonus_faixa_5', '100', 'Premiação por parcela - Faixa 5 (Acima de R$ 1.518)')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();