import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateDevedoresBonus, DevedoresSettings } from '@/types/database';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Wallet, Calendar, User, MessageSquare, DollarSign, Receipt, Hash } from 'lucide-react';
import { z } from 'zod';
import { format } from 'date-fns';

const devedorSchema = z.object({
  nome_cliente: z.string().min(2, 'Nome do cliente é obrigatório').max(200),
  valor_resolvido: z.number().min(0.01, 'Valor deve ser maior que zero'),
  quantidade_parcelas: z.number().min(1, 'Quantidade de parcelas deve ser pelo menos 1'),
  data_referencia: z.string().min(1, 'Data é obrigatória'),
  observacoes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof devedorSchema>;

const NovoDevedor: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useSystemSettings();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome_cliente: '',
    valor_resolvido: 0,
    quantidade_parcelas: 1,
    data_referencia: format(new Date(), 'yyyy-MM-dd'),
    observacoes: '',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Criar settings para o cálculo
  const devedoresSettings: DevedoresSettings = {
    faixa_0_max: settings.devedores_faixa_0_max,
    faixa_1_min: settings.devedores_faixa_1_min,
    faixa_1_max: settings.devedores_faixa_1_max,
    faixa_2_max: settings.devedores_faixa_2_max,
    faixa_3_max: settings.devedores_faixa_3_max,
    faixa_4_max: settings.devedores_faixa_4_max,
    bonus_faixa_0: settings.devedores_bonus_faixa_0,
    bonus_faixa_1: settings.devedores_bonus_faixa_1,
    bonus_faixa_2: settings.devedores_bonus_faixa_2,
    bonus_faixa_3: settings.devedores_bonus_faixa_3,
    bonus_faixa_4: settings.devedores_bonus_faixa_4,
    bonus_faixa_5: settings.devedores_bonus_faixa_5,
  };

  // Calcula a premiação em tempo real
  const bonusCalculation = calculateDevedoresBonus(
    formData.valor_resolvido,
    formData.quantidade_parcelas,
    devedoresSettings
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = devedorSchema.safeParse(formData);

    if (!validation.success) {
      toast({
        title: 'Erro de validação',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('registrations').insert({
        user_id: user!.id,
        tipo_premiacao: 'devedores',
        nome_cliente: formData.nome_cliente.trim(),
        nome_marca: '-', // Campo obrigatório no DB, mas não usado para devedores
        quantidade: 1, // Campo obrigatório no DB
        forma_pagamento: 'avista', // Campo obrigatório no DB, mas não usado para devedores
        tipo_publicacao: null,
        data_referencia: formData.data_referencia,
        observacoes: formData.observacoes?.trim() || null,
        valor_promocao: null,
        quantidade_parcelas: formData.quantidade_parcelas,
        valor_resolvido: formData.valor_resolvido,
      });

      if (error) throw error;

      toast({
        title: 'Cadastro realizado!',
        description: `Devedor cadastrado com sucesso. Premiação: ${formatCurrency(bonusCalculation.total)}`,
      });

      navigate('/dashboard/devedores');
    } catch (err) {
      toast({
        title: 'Erro ao cadastrar',
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            Novo Devedor
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre um novo cadastro de devedor com valor resolvido
          </p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Informações do Devedor</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Premiação - Fixo */}
              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">Devedores</p>
                    <p className="text-xs text-muted-foreground">Controle de valores resolvidos/pagos</p>
                  </div>
                </div>
              </div>

              {/* Nome do Cliente */}
              <div className="space-y-2">
                <Label htmlFor="nome_cliente">Nome do Cliente *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nome_cliente"
                    placeholder="Nome completo do cliente"
                    className="pl-10"
                    value={formData.nome_cliente}
                    onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Valor Resolvido / Valor Pago TOTAL */}
              <div className="space-y-2">
                <Label htmlFor="valor_resolvido">Valor Resolvido / Valor Pago TOTAL (R$) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="valor_resolvido"
                    type="number"
                    min={0.01}
                    step={0.01}
                    placeholder="Ex: 2000.00"
                    className="pl-10"
                    value={formData.valor_resolvido || ''}
                    onChange={(e) => setFormData({ ...formData, valor_resolvido: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              {/* Quantidade de Parcelas Pagas */}
              <div className="space-y-2">
                <Label htmlFor="quantidade_parcelas">Quantidade de Parcelas Pagas *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="quantidade_parcelas"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Ex: 4"
                    className="pl-10"
                    value={formData.quantidade_parcelas || ''}
                    onChange={(e) => setFormData({ ...formData, quantidade_parcelas: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe quantas parcelas foram pagas pelo cliente
                </p>
              </div>

              {/* Data do Pagamento */}
              <div className="space-y-2">
                <Label htmlFor="data_referencia">Data do Pagamento *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="data_referencia"
                    type="date"
                    className="pl-10"
                    value={formData.data_referencia}
                    onChange={(e) => setFormData({ ...formData, data_referencia: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="observacoes"
                    placeholder="Observações adicionais (opcional)"
                    className="pl-10 min-h-[100px]"
                    value={formData.observacoes || ''}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  />
                </div>
              </div>

              {/* Cálculo da Premiação - Preview */}
              {formData.valor_resolvido > 0 && formData.quantidade_parcelas > 0 && (
                <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Receipt className="w-4 h-4" />
                    <span className="text-sm font-medium">Cálculo da Premiação</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor Total Pago</p>
                      <p className="font-bold">{formatCurrency(formData.valor_resolvido)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Parcelas Pagas</p>
                      <p className="font-bold">{formData.quantidade_parcelas}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor da Parcela</p>
                      <p className="font-bold">{formatCurrency(bonusCalculation.valorParcela)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Faixa</p>
                      <p className="font-bold text-primary">{bonusCalculation.faixa}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Premiação por parcela</span>
                      <span className="font-medium">{formatCurrency(bonusCalculation.bonusPorParcela)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Premiação Total</span>
                      <span className="text-2xl font-bold text-success">
                        {formatCurrency(bonusCalculation.total)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(bonusCalculation.bonusPorParcela)} × {formData.quantidade_parcelas} parcelas
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/dashboard/devedores')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Cadastro'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NovoDevedor;
