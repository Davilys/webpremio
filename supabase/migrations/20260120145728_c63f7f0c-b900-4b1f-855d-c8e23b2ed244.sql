-- Add 'devedores' to the bonus_type enum
ALTER TYPE bonus_type ADD VALUE IF NOT EXISTS 'devedores';

-- Add columns for devedores functionality
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS quantidade_parcelas integer,
ADD COLUMN IF NOT EXISTS valor_resolvido numeric;

-- Add comment for clarity
COMMENT ON COLUMN public.registrations.quantidade_parcelas IS 'Número de parcelas pagas (usado para Devedores)';
COMMENT ON COLUMN public.registrations.valor_resolvido IS 'Valor total resolvido/pago (usado para Devedores)';