
# Plano: Adicionar Faixa 0 de Premiacao (R$ 1 ate R$ 199 = R$ 10)

## Objetivo
Criar uma nova faixa de premiacao para valores de parcela que antes nao tinham bonus:
- **Nova Faixa 0**: R$ 1,00 ate R$ 199,00 = R$ 10,00 por parcela

## Estrutura Atual vs Nova

### Atual (sem premiacao abaixo de R$ 199)
| Faixa | Valor da Parcela | Bonus |
|-------|------------------|-------|
| Sem premiacao | Abaixo de R$ 199 | R$ 0 |
| Faixa 1 | R$ 199 a R$ 397 | R$ 10 |
| Faixa 2 | R$ 398 a R$ 597 | R$ 25 |
| Faixa 3 | R$ 598 a R$ 999 | R$ 50 |
| Faixa 4 | R$ 1.000 a R$ 1.500 | R$ 75 |
| Faixa 5 | Acima de R$ 1.500 | R$ 100 |

### Nova (com Faixa 0)
| Faixa | Valor da Parcela | Bonus |
|-------|------------------|-------|
| **Faixa 0** | **R$ 1 a R$ 199** | **R$ 10** |
| Faixa 1 | R$ 200 a R$ 397 | R$ 10 |
| Faixa 2 | R$ 398 a R$ 597 | R$ 25 |
| Faixa 3 | R$ 598 a R$ 999 | R$ 50 |
| Faixa 4 | R$ 1.000 a R$ 1.500 | R$ 75 |
| Faixa 5 | Acima de R$ 1.500 | R$ 100 |

---

## Arquivos a Modificar

### 1. src/types/database.ts
- Adicionar constante `DEVEDORES_FAIXA_0_MAX = 199`
- Adicionar constante `DEVEDORES_BONUS_FAIXA_0 = 10`
- Atualizar interface `DevedoresSettings` com:
  - `faixa_0_max: number`
  - `bonus_faixa_0: number`
- Atualizar `DEFAULT_DEVEDORES_SETTINGS`
- Modificar `getDevedoresBonusPerParcela()` para verificar Faixa 0 primeiro
- Modificar `getDevedoresFaixaName()` para exibir nome da Faixa 0

### 2. src/hooks/useSystemSettings.ts
- Adicionar na interface `SystemSettings`:
  - `devedores_faixa_0_max: number` (valor: 199)
  - `devedores_bonus_faixa_0: number` (valor: 10)
- Atualizar `DEFAULT_SETTINGS` com os novos valores

### 3. src/components/settings/BonusSettingsDevedoresCard.tsx
- Adicionar campo de configuracao para limite da Faixa 0
- Adicionar campo de configuracao para bonus da Faixa 0
- Adicionar linha no resumo das faixas para Faixa 0

### 4. src/components/dashboard/BonusPanelDevedores.tsx
- Adicionar exibicao da Faixa 0 na lista de faixas de premiacao

### 5. Banco de Dados
Inserir novos registros na tabela `system_settings`:
- `devedores_faixa_0_max`: 199
- `devedores_bonus_faixa_0`: 10

---

## Logica de Calculo Atualizada

```text
function getDevedoresBonusPerParcela(valorParcela, settings):
  
  if valorParcela < 1:
    return 0  // Valores zerados nao geram premiacao
  
  if valorParcela <= settings.faixa_0_max (199):
    return settings.bonus_faixa_0 (R$ 10)  // NOVA FAIXA 0
  
  if valorParcela <= settings.faixa_1_max (397):
    return settings.bonus_faixa_1 (R$ 10)  // Faixa 1
  
  if valorParcela <= settings.faixa_2_max (597):
    return settings.bonus_faixa_2 (R$ 25)  // Faixa 2
  
  // ... demais faixas
```

---

## Resultado Esperado
- Valores de parcela de R$ 1 ate R$ 199 agora geram R$ 10 de premiacao por parcela
- Administrador pode configurar os valores da nova faixa
- Exibicao correta nos paineis de bonus e configuracoes
- Nenhuma funcionalidade existente sera alterada
