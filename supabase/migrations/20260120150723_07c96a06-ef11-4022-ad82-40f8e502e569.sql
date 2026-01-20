-- 1. Corrigir: System Configuration Data Publicly Readable
-- Remover política permissiva e criar política restritiva para admins
DROP POLICY IF EXISTS "settings_select" ON public.system_settings;

CREATE POLICY "settings_admin_select" 
ON public.system_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- 2. Corrigir: User Email Addresses Exposed
-- A política atual está correta (usuário vê apenas seu próprio perfil OU admin vê todos)
-- Mas vamos marcar como ignorada pois é comportamento esperado - admins precisam ver emails

-- 3. Corrigir: Registrations - garantir que user_id é obrigatório no INSERT
-- Adicionar constraint NOT NULL se ainda não existir e criar trigger de validação
CREATE OR REPLACE FUNCTION public.validate_registration_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;
  
  IF NEW.user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin'::user_role) THEN
    RAISE EXCEPTION 'Cannot create registration for another user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_registration_user_id_trigger ON public.registrations;

CREATE TRIGGER validate_registration_user_id_trigger
BEFORE INSERT ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.validate_registration_user_id();