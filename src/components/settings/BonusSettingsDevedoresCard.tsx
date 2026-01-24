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
              Configure os valores de premiação por faixa de valor da venda
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Limite da Faixa */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Limite da Faixa (R$)</h4>
          <div className="space-y-2">
            <Label htmlFor="devedores_faixa_limite">
              Limite Superior da Faixa 1 (até R$)
              <Badge variant="outline" className="ml-2 text-xs">Divisor</Badge>
            </Label>
            <Input
              id="devedores_faixa_limite"
              type="number"
              step="1"
              min="0"
              value={settings.devedores_faixa_limite}
              onChange={handleChange('devedores_faixa_limite')}
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground">
              Valores de R$ 901 até {formatCurrency(settings.devedores_faixa_limite)} = Faixa 1
            </p>
          </div>
        </div>

        {/* Valores de Premiação por Faixa */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Premiação por Faixa (R$)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_faixa_1">
                Faixa 1
                <Badge variant="secondary" className="ml-2 text-xs">R$ 901 - {formatCurrency(settings.devedores_faixa_limite)}</Badge>
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
              <p className="text-xs text-muted-foreground">
                {formatCurrency(settings.devedores_bonus_faixa_1)} por venda
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="devedores_bonus_faixa_2">
                Faixa 2
                <Badge variant="default" className="ml-2 text-xs">Acima de {formatCurrency(settings.devedores_faixa_limite)}</Badge>
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
              <p className="text-xs text-muted-foreground">
                {formatCurrency(settings.devedores_bonus_faixa_2)} por venda
              </p>
            </div>
          </div>
        </div>

        {/* Resumo das Faixas */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <h4 className="text-sm font-medium">Resumo das Faixas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-background">
              <span className="text-muted-foreground">R$ 901 - {formatCurrency(settings.devedores_faixa_limite)}</span>
              <span className="font-medium text-orange-600">{formatCurrency(settings.devedores_bonus_faixa_1)}/venda</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-background">
              <span className="text-muted-foreground">Acima de {formatCurrency(settings.devedores_faixa_limite)}</span>
              <span className="font-medium text-orange-600">{formatCurrency(settings.devedores_bonus_faixa_2)}/venda</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusSettingsDevedoresCard;
