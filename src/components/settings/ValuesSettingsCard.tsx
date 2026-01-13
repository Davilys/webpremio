import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { SystemSettings } from '@/hooks/useSystemSettings';

interface ValuesSettingsCardProps {
  settings: SystemSettings;
  onSettingChange: (key: keyof SystemSettings, value: number) => void;
  disabled?: boolean;
}

const ValuesSettingsCard: React.FC<ValuesSettingsCardProps> = ({
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
    <div className="space-y-6">
      {/* Valores de Registro de Marca */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Registro de Marca - Preços</CardTitle>
              <CardDescription>
                Configure os valores cobrados pelos serviços de registro
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registro_valor_avista">
                Preço À Vista (R$)
              </Label>
              <Input
                id="registro_valor_avista"
                type="number"
                step="0.01"
                min="0"
                value={settings.registro_valor_avista}
                onChange={handleChange('registro_valor_avista')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Atual: {formatCurrency(settings.registro_valor_avista)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registro_valor_parcelado">
                Preço Parcelado (R$)
              </Label>
              <Input
                id="registro_valor_parcelado"
                type="number"
                step="0.01"
                min="0"
                value={settings.registro_valor_parcelado}
                onChange={handleChange('registro_valor_parcelado')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Atual: {formatCurrency(settings.registro_valor_parcelado)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valores de Publicação */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Publicação - Preços</CardTitle>
              <CardDescription>
                Configure os valores cobrados pelos serviços de publicação
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicacao_valor_avista">
                Preço À Vista (R$)
                <Badge variant="outline" className="ml-2 text-xs">1 salário mínimo</Badge>
              </Label>
              <Input
                id="publicacao_valor_avista"
                type="number"
                step="0.01"
                min="0"
                value={settings.publicacao_valor_avista}
                onChange={handleChange('publicacao_valor_avista')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Atual: {formatCurrency(settings.publicacao_valor_avista)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicacao_valor_parcelado">
                Preço Parcelado (R$)
                <Badge variant="outline" className="ml-2 text-xs">6x R$398,00</Badge>
              </Label>
              <Input
                id="publicacao_valor_parcelado"
                type="number"
                step="0.01"
                min="0"
                value={settings.publicacao_valor_parcelado}
                onChange={handleChange('publicacao_valor_parcelado')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Atual: {formatCurrency(settings.publicacao_valor_parcelado)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuesSettingsCard;
