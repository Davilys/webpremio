import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BonusType, PaymentMethod, PublicationType, PUBLICATION_TYPE_LABELS, PAYMENT_METHOD_LABELS, PAYMENT_VALUES } from '@/types/database';
import { Bookmark, FileText, Calendar, CreditCard, User, Tag, Hash, MessageSquare } from 'lucide-react';
import { z } from 'zod';
import { format } from 'date-fns';

const registrationSchema = z.object({
  tipo_premiacao: z.enum(['registro', 'publicacao']),
  nome_cliente: z.string().min(2, 'Nome do cliente é obrigatório').max(200),
  nome_marca: z.string().min(1, 'Nome da marca é obrigatório').max(200),
  quantidade: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
  forma_pagamento: z.enum(['avista', 'parcelado', 'promocao']),
  tipo_publicacao: z.enum([
    'exigencia_merito',
    'recurso',
    'notificacao_extrajudicial',
    'oposicao',
    'deferimento',
    'indeferimento',
    'codigo_003',
  ]).nullable(),
  data_referencia: z.string().min(1, 'Data é obrigatória'),
  observacoes: z.string().max(1000).optional(),
  valor_promocao: z.number().min(0.01, 'Valor deve ser maior que zero').nullable().optional(),
});

type FormData = z.infer<typeof registrationSchema>;

const NovoRegistro: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    tipo_premiacao: 'registro',
    nome_cliente: '',
    nome_marca: '',
    quantidade: 1,
    forma_pagamento: 'avista',
    tipo_publicacao: null,
    data_referencia: format(new Date(), 'yyyy-MM-dd'),
    observacoes: '',
    valor_promocao: null,
  });

  const isPublicacao = formData.tipo_premiacao === 'publicacao';

  const getPaymentValue = () => {
    if (formData.forma_pagamento === 'promocao') {
      return formData.valor_promocao || 0;
    }
    const values = PAYMENT_VALUES[formData.tipo_premiacao];
    return values[formData.forma_pagamento as 'avista' | 'parcelado'];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = registrationSchema.safeParse({
      ...formData,
      tipo_publicacao: isPublicacao ? formData.tipo_publicacao : null,
    });

    if (!validation.success) {
      toast({
        title: 'Erro de validação',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    if (isPublicacao && !formData.tipo_publicacao) {
      toast({
        title: 'Erro de validação',
        description: 'Selecione o tipo de publicação',
        variant: 'destructive',
      });
      return;
    }

    if (formData.forma_pagamento === 'promocao' && (!formData.valor_promocao || formData.valor_promocao <= 0)) {
      toast({
        title: 'Erro de validação',
        description: 'Informe o valor promocional',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('registrations').insert({
        user_id: user!.id,
        tipo_premiacao: formData.tipo_premiacao,
        nome_cliente: formData.nome_cliente.trim(),
        nome_marca: formData.nome_marca.trim(),
        quantidade: formData.quantidade,
        forma_pagamento: formData.forma_pagamento,
        tipo_publicacao: isPublicacao ? formData.tipo_publicacao : null,
        data_referencia: formData.data_referencia,
        observacoes: formData.observacoes?.trim() || null,
        valor_promocao: formData.forma_pagamento === 'promocao' ? formData.valor_promocao : null,
      });

      if (error) throw error;

      toast({
        title: 'Cadastro realizado!',
        description: `${formData.quantidade} ${isPublicacao ? 'publicação(ões)' : 'marca(s)'} cadastrada(s) com sucesso.`,
      });

      navigate('/dashboard');
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
          <h1 className="text-3xl font-bold text-foreground">Novo Cadastro</h1>
          <p className="text-muted-foreground mt-1">
            Registre um novo cliente para premiação
          </p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Informações do Cadastro</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Premiação */}
              <div className="space-y-2">
                <Label>Tipo de Premiação *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo_premiacao: 'registro', tipo_publicacao: null })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                      formData.tipo_premiacao === 'registro'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Bookmark className={`w-6 h-6 ${formData.tipo_premiacao === 'registro' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <p className="font-semibold">Registro de Marca</p>
                      <p className="text-xs text-muted-foreground">Cadastro de marcas/classes</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo_premiacao: 'publicacao' })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                      formData.tipo_premiacao === 'publicacao'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <FileText className={`w-6 h-6 ${formData.tipo_premiacao === 'publicacao' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <p className="font-semibold">Publicação</p>
                      <p className="text-xs text-muted-foreground">Publicações diversas</p>
                    </div>
                  </button>
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

              {/* Nome da Marca */}
              <div className="space-y-2">
                <Label htmlFor="nome_marca">Nome da Marca *</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nome_marca"
                    placeholder="Nome da marca"
                    className="pl-10"
                    value={formData.nome_marca}
                    onChange={(e) => setFormData({ ...formData, nome_marca: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Quantidade */}
              <div className="space-y-2">
                <Label htmlFor="quantidade">
                  {isPublicacao ? 'Quantidade de Publicações *' : 'Quantidade de Marcas/Classes *'}
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="quantidade"
                    type="number"
                    min={1}
                    className="pl-10"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              {/* Tipo de Publicação (conditional) */}
              {isPublicacao && (
                <div className="space-y-2">
                  <Label>Tipo de Publicação *</Label>
                  <Select
                    value={formData.tipo_publicacao || ''}
                    onValueChange={(value) => setFormData({ ...formData, tipo_publicacao: value as PublicationType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PUBLICATION_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="data_referencia">
                  {isPublicacao ? 'Data da Publicação *' : 'Data do Pagamento *'}
                </Label>
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

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <Label>Forma de Pagamento *</Label>
                <Select
                  value={formData.forma_pagamento}
                  onValueChange={(value) => setFormData({ ...formData, forma_pagamento: value as PaymentMethod, valor_promocao: value === 'promocao' ? formData.valor_promocao : null })}
                >
                  <SelectTrigger>
                    <CreditCard className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avista">
                      {PAYMENT_METHOD_LABELS.avista} — {formData.tipo_premiacao === 'publicacao' ? '1 Salário Mínimo' : formatCurrency(PAYMENT_VALUES[formData.tipo_premiacao].avista)}
                    </SelectItem>
                    <SelectItem value="parcelado">
                      {PAYMENT_METHOD_LABELS.parcelado} — {formData.tipo_premiacao === 'publicacao' ? '6x de R$ 398,00' : formatCurrency(PAYMENT_VALUES[formData.tipo_premiacao].parcelado)}
                    </SelectItem>
                    <SelectItem value="promocao">
                      {PAYMENT_METHOD_LABELS.promocao} — Sem Premiação (R$ 0,00)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.forma_pagamento !== 'promocao' && (
                  <p className="text-sm text-muted-foreground">
                    Valor do serviço: {formatCurrency(getPaymentValue())}
                  </p>
                )}
              </div>

              {/* Valor Personalizado (Sem Premiação) */}
              {formData.forma_pagamento === 'promocao' && (
                <div className="space-y-2">
                  <Label htmlFor="valor_promocao">Valor Personalizado (R$) *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="valor_promocao"
                      type="number"
                      min={0.01}
                      step={0.01}
                      placeholder="Ex: 499.90"
                      className="pl-10"
                      value={formData.valor_promocao || ''}
                      onChange={(e) => setFormData({ ...formData, valor_promocao: parseFloat(e.target.value) || null })}
                      required
                    />
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Valor personalizado não gera premiação. A marca será contabilizada como fechada, mas sem bônus.
                  </p>
                </div>
              )}

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

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/dashboard')}
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

export default NovoRegistro;
