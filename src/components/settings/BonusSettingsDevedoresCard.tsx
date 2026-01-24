import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Info } from 'lucide-react';
import { SystemSettings } from '@/hooks/useSystemSettings';

interface BonusSettingsDevedoresCardProps {
  settings: SystemSettings;
  onSettingChange: (key: keyof SystemSettings, value: number) => void;
  disabled?: boolean;
}

const BonusSettingsDevedoresCard: React.FC<BonusSettingsDevedoresCardProps> = ({
  settings,
  onSettingChange,
  disabled = false,
}) => {
  const handleChange = (key: keyof SystemSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onSettingChange(key, value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Devedores - Faixas de Premiação</CardTitle>
            <CardDescription>
              Configure os valores de premiação por faixa de valor da parcela
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informação sobre o cálculo */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">Como funciona o cálculo:</p>
              <p className="text-muted-foreground">
                <strong>Valor da Parcela</strong> = Valor Resolvido Total ÷ Quantidade de Parcelas Pagas
              </p>
              <p className="text-muted-foreground">
                <strong>Premiação Total</strong> = Premiação por Parcela × Quantidade de Parcelas Pagas
              </p>
            </div>
          </div>
        </div>

        {/* Faixas de Valor */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Limites das Faixas (R$)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="devedores_faixa_1_min">
                Valor Mínimo (Faixa 1)
              </Label>
              <Input
                id="devedores_faixa_1_min"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_faixa_1_min}
                onChange={handleChange('devedores_faixa_1_min')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_faixa_1_max">
                Limite Faixa 1 (até R$)
              </Label>
              <Input
                id="devedores_faixa_1_max"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_faixa_1_max}
                onChange={handleChange('devedores_faixa_1_max')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_faixa_2_max">
                Limite Faixa 2 (até R$)
              </Label>
              <Input
                id="devedores_faixa_2_max"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_faixa_2_max}
                onChange={handleChange('devedores_faixa_2_max')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_faixa_3_max">
                Limite Faixa 3 (até R$)
              </Label>
              <Input
                id="devedores_faixa_3_max"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_faixa_3_max}
                onChange={handleChange('devedores_faixa_3_max')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_faixa_4_max">
                Limite Faixa 4 (até R$)
              </Label>
              <Input
                id="devedores_faixa_4_max"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_faixa_4_max}
                onChange={handleChange('devedores_faixa_4_max')}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Valores de Premiação por Faixa */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Premiação por Parcela (R$)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_faixa_1">
                Faixa 1
                <Badge variant="secondary" className="ml-2 text-xs">
                  R$ {settings.devedores_faixa_1_min} - R$ {settings.devedores_faixa_1_max}
                </Badge>
              </Label>
              <Input
                id="devedores_bonus_faixa_1"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_faixa_1}
                onChange={handleChange('devedores_bonus_faixa_1')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_faixa_2">
                Faixa 2
                <Badge variant="secondary" className="ml-2 text-xs">
                  R$ {settings.devedores_faixa_1_max + 1} - R$ {settings.devedores_faixa_2_max}
                </Badge>
              </Label>
              <Input
                id="devedores_bonus_faixa_2"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_faixa_2}
                onChange={handleChange('devedores_bonus_faixa_2')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_faixa_3">
                Faixa 3
                <Badge variant="secondary" className="ml-2 text-xs">
                  R$ {settings.devedores_faixa_2_max + 1} - R$ {settings.devedores_faixa_3_max}
                </Badge>
              </Label>
              <Input
                id="devedores_bonus_faixa_3"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_faixa_3}
                onChange={handleChange('devedores_bonus_faixa_3')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_faixa_4">
                Faixa 4
                <Badge variant="secondary" className="ml-2 text-xs">
                  R$ {settings.devedores_faixa_3_max + 1} - R$ {settings.devedores_faixa_4_max}
                </Badge>
              </Label>
              <Input
                id="devedores_bonus_faixa_4"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_faixa_4}
                onChange={handleChange('devedores_bonus_faixa_4')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_faixa_5">
                Faixa 5
                <Badge variant="default" className="ml-2 text-xs">
                  Acima de R$ {settings.devedores_faixa_4_max}
                </Badge>
              </Label>
              <Input
                id="devedores_bonus_faixa_5"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_faixa_5}
                onChange={handleChange('devedores_bonus_faixa_5')}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Resumo das Faixas */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <h4 className="text-sm font-medium">Resumo das Faixas</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between p-3 rounded bg-background">
              <div>
                <span className="font-medium text-foreground">Faixa 1</span>
                <span className="text-muted-foreground ml-2">
                  R$ {settings.devedores_faixa_1_min} a R$ {settings.devedores_faixa_1_max}
                </span>
              </div>
              <span className="font-bold text-orange-600">{formatCurrency(settings.devedores_bonus_faixa_1)}/parcela</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded bg-background">
              <div>
                <span className="font-medium text-foreground">Faixa 2</span>
                <span className="text-muted-foreground ml-2">
                  R$ {settings.devedores_faixa_1_max + 1} a R$ {settings.devedores_faixa_2_max}
                </span>
              </div>
              <span className="font-bold text-orange-600">{formatCurrency(settings.devedores_bonus_faixa_2)}/parcela</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded bg-background">
              <div>
                <span className="font-medium text-foreground">Faixa 3</span>
                <span className="text-muted-foreground ml-2">
                  R$ {settings.devedores_faixa_2_max + 1} a R$ {settings.devedores_faixa_3_max}
                </span>
              </div>
              <span className="font-bold text-orange-600">{formatCurrency(settings.devedores_bonus_faixa_3)}/parcela</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded bg-background">
              <div>
                <span className="font-medium text-foreground">Faixa 4</span>
                <span className="text-muted-foreground ml-2">
                  R$ {settings.devedores_faixa_3_max + 1} a R$ {settings.devedores_faixa_4_max}
                </span>
              </div>
              <span className="font-bold text-orange-600">{formatCurrency(settings.devedores_bonus_faixa_4)}/parcela</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded bg-background">
              <div>
                <span className="font-medium text-foreground">Faixa 5</span>
                <span className="text-muted-foreground ml-2">
                  Acima de R$ {settings.devedores_faixa_4_max}
                </span>
              </div>
              <span className="font-bold text-orange-600">{formatCurrency(settings.devedores_bonus_faixa_5)}/parcela</span>
            </div>
          </div>
        </div>

        {/* Exemplo de Cálculo */}
        <div className="rounded-lg border border-dashed p-4 space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Exemplo Prático
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Valor resolvido total: <strong>R$ 2.000,00</strong></p>
            <p>• Parcelas pagas: <strong>4</strong></p>
            <p>• Valor da parcela: <strong>R$ 500,00</strong> (2.000 ÷ 4)</p>
            <p>• Faixa aplicada: <strong>Faixa 2</strong> (R$ 398 a R$ 597)</p>
            <p>• Premiação por parcela: <strong>{formatCurrency(settings.devedores_bonus_faixa_2)}</strong></p>
            <p>• <strong>Premiação final: {formatCurrency(settings.devedores_bonus_faixa_2 * 4)}</strong> ({settings.devedores_bonus_faixa_2} × 4)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusSettingsDevedoresCard;
