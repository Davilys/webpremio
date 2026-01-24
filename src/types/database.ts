export type UserRole = 'admin' | 'funcionario';
export type BonusType = 'registro' | 'publicacao' | 'devedores';
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
  // Campos para Devedores
  quantidade_parcelas: number | null;
  valor_resolvido: number | null;
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
// Registro de Marca (à vista/parcelado): R$ 50,00 por registro
// Valor Personalizado (promoção): R$ 50,00 por registro
// Meta mensal: 30 registros (só à vista conta para dobrar)
// Após a meta (>= 30 à vista):
//   - À vista: R$ 100,00 por registro (dobra)
//   - Parcelado: R$ 50,00 por registro (nunca dobra)
// ==========================================

export const BONUS_GOAL = 30;
export const BONUS_VALUE_REGISTRO = 50; // Valor padrão por registro de marca
export const BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL = 100; // Valor à vista após meta
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
  // Meta é baseada APENAS em registros à vista
  const goalReached = avistaQuantity >= BONUS_GOAL;
  
  // Valor por unidade à vista: R$100 se meta atingida, senão R$50
  const avistaUnitValue = goalReached ? BONUS_VALUE_REGISTRO_AVISTA_AFTER_GOAL : BONUS_VALUE_REGISTRO;
  // Parcelado sempre R$50, nunca dobra
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
//   - Promoção: R$ 50,00
// ==========================================

export const PUBLICACAO_BONUS_AVISTA = 100;
export const PUBLICACAO_BONUS_PARCELADO = 50;
export const PUBLICACAO_BONUS_PROMOCAO = 50;

// Calcula premiação para Publicação (sem meta, baseado apenas na forma de pagamento)
export const calculatePublicacaoBonus = (
  avistaQuantity: number,
  parceladoQuantity: number,
  promocaoQuantity: number = 0
): { total: number; avistaValue: number; parceladoValue: number; promocaoValue: number } => {
  const avistaValue = avistaQuantity * PUBLICACAO_BONUS_AVISTA;
  const parceladoValue = parceladoQuantity * PUBLICACAO_BONUS_PARCELADO;
  const promocaoValue = promocaoQuantity * PUBLICACAO_BONUS_PROMOCAO;
  
  return {
    total: avistaValue + parceladoValue + promocaoValue,
    avistaValue,
    parceladoValue,
    promocaoValue,
  };
};

// ==========================================
// REGRAS DE PREMIAÇÃO - DEVEDORES
// ==========================================
// Cálculo baseado no VALOR DA PARCELA:
//   Valor da Parcela = Valor Resolvido Total ÷ Quantidade de Parcelas Pagas
//
// Faixas de premiação (valor da parcela):
//   Faixa 1: R$ 199,00 a R$ 397,00 → R$ 10,00 por parcela
//   Faixa 2: R$ 398,00 a R$ 597,00 → R$ 25,00 por parcela
//   Faixa 3: R$ 598,00 a R$ 999,00 → R$ 50,00 por parcela
//   Faixa 4: R$ 1.000,00 a R$ 1.500,00 → R$ 75,00 por parcela
//   Faixa 5: Acima de R$ 1.518,00 → R$ 100,00 por parcela
//
// Premiação Total = Premiação por Parcela × Quantidade de Parcelas Pagas
// ==========================================

// Configurações padrão das faixas (valores default)
export const DEVEDORES_FAIXA_1_MIN = 199;
export const DEVEDORES_FAIXA_1_MAX = 397;
export const DEVEDORES_FAIXA_2_MAX = 597;
export const DEVEDORES_FAIXA_3_MAX = 999;
export const DEVEDORES_FAIXA_4_MAX = 1500;
export const DEVEDORES_FAIXA_5_MIN = 1518;

export const DEVEDORES_BONUS_FAIXA_1 = 10;  // R$ 199 a R$ 397
export const DEVEDORES_BONUS_FAIXA_2 = 25;  // R$ 398 a R$ 597
export const DEVEDORES_BONUS_FAIXA_3 = 50;  // R$ 598 a R$ 999
export const DEVEDORES_BONUS_FAIXA_4 = 75;  // R$ 1.000 a R$ 1.500
export const DEVEDORES_BONUS_FAIXA_5 = 100; // Acima de R$ 1.518

// Interface para configurações de devedores
export interface DevedoresSettings {
  faixa_1_min: number;
  faixa_1_max: number;
  faixa_2_max: number;
  faixa_3_max: number;
  faixa_4_max: number;
  bonus_faixa_1: number;
  bonus_faixa_2: number;
  bonus_faixa_3: number;
  bonus_faixa_4: number;
  bonus_faixa_5: number;
}

// Configurações padrão
export const DEFAULT_DEVEDORES_SETTINGS: DevedoresSettings = {
  faixa_1_min: DEVEDORES_FAIXA_1_MIN,
  faixa_1_max: DEVEDORES_FAIXA_1_MAX,
  faixa_2_max: DEVEDORES_FAIXA_2_MAX,
  faixa_3_max: DEVEDORES_FAIXA_3_MAX,
  faixa_4_max: DEVEDORES_FAIXA_4_MAX,
  bonus_faixa_1: DEVEDORES_BONUS_FAIXA_1,
  bonus_faixa_2: DEVEDORES_BONUS_FAIXA_2,
  bonus_faixa_3: DEVEDORES_BONUS_FAIXA_3,
  bonus_faixa_4: DEVEDORES_BONUS_FAIXA_4,
  bonus_faixa_5: DEVEDORES_BONUS_FAIXA_5,
};

// Obtém a premiação por parcela baseada no valor da parcela
export const getDevedoresBonusPerParcela = (
  valorParcela: number,
  settings: DevedoresSettings = DEFAULT_DEVEDORES_SETTINGS
): number => {
  if (valorParcela < settings.faixa_1_min) {
    return 0; // Valores abaixo de R$ 199 não geram premiação
  } else if (valorParcela <= settings.faixa_1_max) {
    return settings.bonus_faixa_1; // Faixa 1: R$ 10
  } else if (valorParcela <= settings.faixa_2_max) {
    return settings.bonus_faixa_2; // Faixa 2: R$ 25
  } else if (valorParcela <= settings.faixa_3_max) {
    return settings.bonus_faixa_3; // Faixa 3: R$ 50
  } else if (valorParcela <= settings.faixa_4_max) {
    return settings.bonus_faixa_4; // Faixa 4: R$ 75
  } else {
    return settings.bonus_faixa_5; // Faixa 5: R$ 100
  }
};

// Obtém o nome da faixa baseado no valor da parcela
export const getDevedoresFaixaName = (
  valorParcela: number,
  settings: DevedoresSettings = DEFAULT_DEVEDORES_SETTINGS
): string => {
  if (valorParcela < settings.faixa_1_min) {
    return 'Abaixo do mínimo';
  } else if (valorParcela <= settings.faixa_1_max) {
    return `Faixa 1 (R$ ${settings.faixa_1_min} - R$ ${settings.faixa_1_max})`;
  } else if (valorParcela <= settings.faixa_2_max) {
    return `Faixa 2 (R$ ${settings.faixa_1_max + 1} - R$ ${settings.faixa_2_max})`;
  } else if (valorParcela <= settings.faixa_3_max) {
    return `Faixa 3 (R$ ${settings.faixa_2_max + 1} - R$ ${settings.faixa_3_max})`;
  } else if (valorParcela <= settings.faixa_4_max) {
    return `Faixa 4 (R$ ${settings.faixa_3_max + 1} - R$ ${settings.faixa_4_max})`;
  } else {
    return `Faixa 5 (Acima de R$ ${settings.faixa_4_max})`;
  }
};

// Calcula premiação para Devedores (baseado no valor da parcela)
export const calculateDevedoresBonus = (
  valorResolvido: number,
  quantidadeParcelas: number = 1,
  settings: DevedoresSettings = DEFAULT_DEVEDORES_SETTINGS
): { 
  total: number; 
  bonusPorParcela: number;
  valorParcela: number;
  faixa: string;
} => {
  if (valorResolvido <= 0 || quantidadeParcelas <= 0) {
    return { total: 0, bonusPorParcela: 0, valorParcela: 0, faixa: '-' };
  }
  
  // Valor da Parcela = Valor Resolvido Total ÷ Quantidade de Parcelas Pagas
  const valorParcela = valorResolvido / quantidadeParcelas;
  
  // Obtém premiação por parcela baseada no valor da parcela
  const bonusPorParcela = getDevedoresBonusPerParcela(valorParcela, settings);
  
  // Premiação Total = Premiação por Parcela × Quantidade de Parcelas Pagas
  const total = bonusPorParcela * quantidadeParcelas;
  
  // Nome da faixa
  const faixa = getDevedoresFaixaName(valorParcela, settings);
  
  return { total, bonusPorParcela, valorParcela, faixa };
};
