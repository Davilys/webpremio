import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bookmark, FileText } from 'lucide-react';
import { SystemSettings } from '@/hooks/useSystemSettings';

interface BonusSettingsCardProps {
  settings: SystemSettings;
  onSettingChange: (key: keyof SystemSettings, value: number) => void;
  disabled?: boolean;
}

const BonusSettingsCard: React.FC<BonusSettingsCardProps> = ({
  settings,
  onSettingChange,
  disabled = false,
}) => {
  const handleChange = (key: keyof SystemSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onSettingChange(key, value);
  };

  return (
    <div className="space-y-6">
      {/* Registro de Marca */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Registro de Marca</CardTitle>
              <CardDescription>
                Configure os valores de premiação para registros de marca
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registro_bonus_base">
                Valor Base (R$)
                <Badge variant="outline" className="ml-2 text-xs">Por registro</Badge>
              </Label>
              <Input
                id="registro_bonus_base"
                type="number"
                step="0.01"
                min="0"
                value={settings.registro_bonus_base}
                onChange={handleChange('registro_bonus_base')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Valor pago por cada registro (antes de atingir a meta)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registro_bonus_meta_atingida">
                Valor Após Meta (R$)
                <Badge variant="secondary" className="ml-2 text-xs">Só à vista</Badge>
              </Label>
              <Input
                id="registro_bonus_meta_atingida"
                type="number"
                step="0.01"
                min="0"
                value={settings.registro_bonus_meta_atingida}
                onChange={handleChange('registro_bonus_meta_atingida')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Valor pago por registro à vista após atingir a meta
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registro_meta_quantidade">
                Meta (Quantidade)
                <Badge variant="outline" className="ml-2 text-xs">À vista</Badge>
              </Label>
              <Input
                id="registro_meta_quantidade"
                type="number"
                step="1"
                min="1"
                value={settings.registro_meta_quantidade}
                onChange={handleChange('registro_meta_quantidade')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Quantidade de registros à vista para dobrar o bônus
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registro_promocao_bonus">
                Valor Promoção (R$)
                <Badge variant="outline" className="ml-2 text-xs">Fixo</Badge>
              </Label>
              <Input
                id="registro_promocao_bonus"
                type="number"
                step="0.01"
                min="0"
                value={settings.registro_promocao_bonus}
                onChange={handleChange('registro_promocao_bonus')}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Valor fixo para registros promocionais
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publicação */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Publicação</CardTitle>
              <CardDescription>
                Configure os valores de premiação para publicações (sem meta)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicacao_bonus_avista">
                À Vista (R$)
                <Badge variant="default" className="ml-2 text-xs">1 salário</Badge>
              </Label>
              <Input
                id="publicacao_bonus_avista"
                type="number"
                step="0.01"
                min="0"
                value={settings.publicacao_bonus_avista}
                onChange={handleChange('publicacao_bonus_avista')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicacao_bonus_parcelado">
                Parcelado (R$)
                <Badge variant="outline" className="ml-2 text-xs">6x R$398</Badge>
              </Label>
              <Input
                id="publicacao_bonus_parcelado"
                type="number"
                step="0.01"
                min="0"
                value={settings.publicacao_bonus_parcelado}
                onChange={handleChange('publicacao_bonus_parcelado')}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicacao_bonus_promocao">
                Promoção (R$)
              </Label>
              <Input
                id="publicacao_bonus_promocao"
                type="number"
                step="0.01"
                min="0"
                value={settings.publicacao_bonus_promocao}
                onChange={handleChange('publicacao_bonus_promocao')}
                disabled={disabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusSettingsCard;
