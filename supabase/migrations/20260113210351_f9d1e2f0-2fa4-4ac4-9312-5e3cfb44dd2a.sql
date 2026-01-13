-- Tabela de configurações do sistema
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Política: Todos autenticados podem ler
CREATE POLICY "settings_select" ON public.system_settings
  FOR SELECT TO authenticated USING (true);

-- Política: Apenas admins podem modificar
CREATE POLICY "settings_admin_insert" ON public.system_settings
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "settings_admin_update" ON public.system_settings
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "settings_admin_delete" ON public.system_settings
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::user_role));

-- Tabela de permissões de usuários
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  can_view_dashboard BOOLEAN DEFAULT true,
  can_view_registro BOOLEAN DEFAULT true,
  can_view_publicacao BOOLEAN DEFAULT true,
  can_view_equipe BOOLEAN DEFAULT false,
  can_create_registro BOOLEAN DEFAULT true,
  can_create_publicacao BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver suas próprias permissões ou admin pode ver todas
CREATE POLICY "permissions_select" ON public.user_permissions
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::user_role));

-- Política: Apenas admins podem gerenciar permissões
CREATE POLICY "permissions_admin_insert" ON public.user_permissions
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "permissions_admin_update" ON public.user_permissions
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "permissions_admin_delete" ON public.user_permissions
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::user_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criar permissões padrão quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user_permissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_permissions (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_permissions
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_permissions();

-- Inserir configurações padrão
INSERT INTO public.system_settings (key, value, description) VALUES
  ('registro_bonus_base', '50', 'Valor base por registro de marca (R$)'),
  ('registro_bonus_meta_atingida', '100', 'Valor por registro à vista após meta (R$)'),
  ('registro_meta_quantidade', '30', 'Quantidade de registros à vista para atingir meta'),
  ('registro_promocao_bonus', '50', 'Valor por registro promocional (R$)'),
  ('publicacao_bonus_avista', '100', 'Valor por publicação à vista (R$)'),
  ('publicacao_bonus_parcelado', '50', 'Valor por publicação parcelada (R$)'),
  ('publicacao_bonus_promocao', '50', 'Valor por publicação promocional (R$)'),
  ('registro_valor_avista', '699.99', 'Preço do registro de marca à vista (R$)'),
  ('registro_valor_parcelado', '1194.00', 'Preço do registro de marca parcelado (R$)'),
  ('publicacao_valor_avista', '1518.00', 'Preço da publicação à vista - 1 salário mínimo (R$)'),
  ('publicacao_valor_parcelado', '2388.00', 'Preço da publicação parcelada - 6x R$398 (R$)');