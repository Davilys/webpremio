import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
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
        {/* Faixas de Limite */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Limites das Faixas (R$)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="devedores_faixa_1_limite">
                Limite Faixa 1 (até R$)
                <Badge variant="outline" className="ml-2 text-xs">Tier 1</Badge>
              </Label>
              <Input
                id="devedores_faixa_1_limite"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_faixa_1_limite}
                onChange={handleChange('devedores_faixa_1_limite')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Parcelas até {formatCurrency(settings.devedores_faixa_1_limite)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_faixa_2_limite">
                Limite Faixa 2 (até R$)
                <Badge variant="outline" className="ml-2 text-xs">Tier 2</Badge>
              </Label>
              <Input
                id="devedores_faixa_2_limite"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_faixa_2_limite}
                onChange={handleChange('devedores_faixa_2_limite')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Parcelas de {formatCurrency(settings.devedores_faixa_1_limite + 1)} até {formatCurrency(settings.devedores_faixa_2_limite)}
              </p>
            </div>
          </div>
        </div>

        {/* Valores de Premiação por Faixa */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Premiação por Parcela (R$)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_tier_1">
                Faixa 1
                <Badge variant="secondary" className="ml-2 text-xs">Até {formatCurrency(settings.devedores_faixa_1_limite)}</Badge>
              </Label>
              <Input
                id="devedores_bonus_tier_1"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_tier_1}
                onChange={handleChange('devedores_bonus_tier_1')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                {formatCurrency(settings.devedores_bonus_tier_1)} por parcela
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_tier_2">
                Faixa 2
                <Badge variant="secondary" className="ml-2 text-xs">{formatCurrency(settings.devedores_faixa_1_limite + 1)} - {formatCurrency(settings.devedores_faixa_2_limite)}</Badge>
              </Label>
              <Input
                id="devedores_bonus_tier_2"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_tier_2}
                onChange={handleChange('devedores_bonus_tier_2')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                {formatCurrency(settings.devedores_bonus_tier_2)} por parcela
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_tier_3">
                Faixa 3
                <Badge variant="default" className="ml-2 text-xs">Acima de {formatCurrency(settings.devedores_faixa_2_limite)}</Badge>
              </Label>
              <Input
                id="devedores_bonus_tier_3"
                type="number"
                step="1"
                min="0"
                value={settings.devedores_bonus_tier_3}
                onChange={handleChange('devedores_bonus_tier_3')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                {formatCurrency(settings.devedores_bonus_tier_3)} por parcela
              </p>
            </div>
          </div>
        </div>

        {/* Resumo das Faixas */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <h4 className="text-sm font-medium">Resumo das Faixas</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-background">
              <span className="text-muted-foreground">Até {formatCurrency(settings.devedores_faixa_1_limite)}</span>
              <span className="font-medium text-orange-600">{formatCurrency(settings.devedores_bonus_tier_1)}/parcela</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-background">
              <span className="text-muted-foreground">{formatCurrency(settings.devedores_faixa_1_limite + 1)} - {formatCurrency(settings.devedores_faixa_2_limite)}</span>
              <span className="font-medium text-orange-600">{formatCurrency(settings.devedores_bonus_tier_2)}/parcela</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-background">
              <span className="text-muted-foreground">Acima de {formatCurrency(settings.devedores_faixa_2_limite)}</span>
              <span className="font-medium text-orange-600">{formatCurrency(settings.devedores_bonus_tier_3)}/parcela</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusSettingsDevedoresCard;
