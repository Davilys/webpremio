export type UserRole = 'admin' | 'funcionario';
export type BonusType = 'registro' | 'publicacao';
export type PaymentMethod = 'avista' | 'parcelado' | 'promocao';
export type PublicationType = 
  | 'exigencia_merito'
  | 'recurso'
  | 'notificacao_extrajudicial'
  | 'oposicao'
  | 'deferimento'
  | 'indeferimento'
  | 'codigo_003';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
}

export interface Registration {
  id: string;
  user_id: string;
  tipo_premiacao: BonusType;
  nome_cliente: string;
  nome_marca: string;
  quantidade: number;
  forma_pagamento: PaymentMethod;
  tipo_publicacao: PublicationType | null;
  data_referencia: string;
  valor_promocao: number | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistrationWithProfile extends Registration {
  profiles?: Profile;
}

export const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  exigencia_merito: 'Exigência de Mérito',
  recurso: 'Recurso',
  notificacao_extrajudicial: 'Notificação Extrajudicial',
  oposicao: 'Oposição',
  deferimento: 'Deferimento',
  indeferimento: 'Indeferimento',
  codigo_003: 'Código 003',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  avista: 'À Vista',
  parcelado: 'Parcelado',
  promocao: 'Promoção',
};

// ==========================================
// REGRAS DE PREMIAÇÃO - REGISTRO DE MARCA
// ==========================================
// Registro de Marca (à vista/parcelado): R$ 25,00 por registro
// Valor Personalizado (promoção): R$ 50,00 por registro
// Meta mensal: 30 registros (para dobrar à vista)
// Após a meta (>= 30):
//   - À vista: R$ 50,00 por registro (dobra)
//   - Parcelado: R$ 25,00 por registro (nunca dobra)
// ==========================================

export const BONUS_GOAL = 30;
export const BONUS_VALUE_REGISTRO = 25; // Valor padrão por registro de marca
export const BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL = 50; // Valor à vista após meta
export const BONUS_VALUE_PROMOCAO = 50; // Valor por registro com valor personalizado

// Aliases para compatibilidade
export const BONUS_VALUE_STANDARD = BONUS_VALUE_REGISTRO;
export const BONUS_VALUE_BELOW_GOAL = BONUS_VALUE_REGISTRO;
export const BONUS_VALUE_AT_GOAL = BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL;
export const BONUS_VALUE_AVISTA_AFTER_GOAL = BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL;

export const PAYMENT_VALUES = {
  registro: {
    avista: 699.99,
    parcelado: 1194.00,
  },
  publicacao: {
    avista: 1518.00, // 1 salário mínimo 2025
    parcelado: 2388.00, // 6x R$ 398,00
  },
};

// Calcula premiação para Registro de Marca com a regra correta
export const calculateRegistroBonus = (
  totalQuantity: number,
  avistaQuantity: number,
  parceladoQuantity: number,
  promocaoQuantity: number = 0
): { total: number; avistaValue: number; parceladoValue: number; promocaoValue: number; goalReached: boolean } => {
  const goalReached = totalQuantity >= BONUS_GOAL;
  
  // Valor por unidade à vista: R$50 se meta atingida, senão R$25
  const avistaUnitValue = goalReached ? BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL : BONUS_VALUE_REGISTRO;
  // Parcelado sempre R$25, nunca dobra
  const parceladoUnitValue = BONUS_VALUE_REGISTRO;
  // Promoção sempre R$50
  const promocaoUnitValue = BONUS_VALUE_PROMOCAO;
  
  const avistaValue = avistaQuantity * avistaUnitValue;
  const parceladoValue = parceladoQuantity * parceladoUnitValue;
  const promocaoValue = promocaoQuantity * promocaoUnitValue;
  
  return {
    total: avistaValue + parceladoValue + promocaoValue,
    avistaValue,
    parceladoValue,
    promocaoValue,
    goalReached,
  };
};

// ==========================================
// REGRAS DE PREMIAÇÃO - PUBLICAÇÃO
// ==========================================
// SEM META - Premiação por forma de pagamento:
//   - À vista (1 salário mínimo): R$ 100,00
//   - Parcelado (6x R$ 398,00): R$ 50,00
// ==========================================

export const PUBLICACAO_BONUS_AVISTA = 100;
export const PUBLICACAO_BONUS_PARCELADO = 50;

// Calcula premiação para Publicação (sem meta, baseado apenas na forma de pagamento)
export const calculatePublicacaoBonus = (
  avistaQuantity: number,
  parceladoQuantity: number
): { total: number; avistaValue: number; parceladoValue: number } => {
  const avistaValue = avistaQuantity * PUBLICACAO_BONUS_AVISTA;
  const parceladoValue = parceladoQuantity * PUBLICACAO_BONUS_PARCELADO;
  
  return {
    total: avistaValue + parceladoValue,
    avistaValue,
    parceladoValue,
  };
};
