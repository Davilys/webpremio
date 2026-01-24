import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, isSameMonth } from 'date-fns';
import { Pencil, Lock, Receipt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Registration, calculateDevedoresBonus } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const devedorSchema = z.object({
  nome_cliente: z.string().min(2, 'Nome do cliente é obrigatório').max(200),
  valor_resolvido: z.number().min(0.01, 'Valor deve ser maior que zero'),
  data_referencia: z.string().min(1, 'Data é obrigatória'),
  observacoes: z.string().max(1000).nullable().optional(),
});

type DevedorFormData = z.infer<typeof devedorSchema>;

interface EditDevedorModalProps {
  registration: Registration;
  onSuccess: () => void;
}

const canEditRegistration = (dataReferencia: string): boolean => {
  const registrationDate = new Date(dataReferencia + 'T00:00:00');
  const currentDate = new Date();
  return isSameMonth(registrationDate, currentDate);
};

export const EditDevedorModal: React.FC<EditDevedorModalProps> = ({
  registration,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const canEdit = canEditRegistration(registration.data_referencia);

  const form = useForm<DevedorFormData>({
    resolver: zodResolver(devedorSchema),
    defaultValues: {
      nome_cliente: registration.nome_cliente,
      valor_resolvido: registration.valor_resolvido || 0,
      data_referencia: registration.data_referencia,
      observacoes: registration.observacoes || '',
    },
  });

  const watchedValues = form.watch();
  const bonusCalculation = calculateDevedoresBonus(watchedValues.valor_resolvido || 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const onSubmit = async (data: DevedorFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          nome_cliente: data.nome_cliente.trim(),
          valor_resolvido: data.valor_resolvido,
          data_referencia: data.data_referencia,
          observacoes: data.observacoes?.trim() || null,
        })
        .eq('id', registration.id);

      if (error) throw error;

      toast({
        title: 'Registro atualizado!',
        description: 'Os dados foram atualizados com sucesso.',
      });

      setOpen(false);
      onSuccess();
    } catch (err) {
      toast({
        title: 'Erro ao atualizar',
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canEdit) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edição bloqueada - mês encerrado</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Devedor</DialogTitle>
          <DialogDescription>
            Atualize as informações do registro de devedor
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome_cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor_resolvido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Resolvido / Valor Pago TOTAL (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0.01}
                      step={0.01}
                      placeholder="Ex: 2000.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_referencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Pagamento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações (opcional)"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cálculo da Premiação - Preview */}
            {watchedValues.valor_resolvido > 0 && (
              <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Receipt className="w-4 h-4" />
                  <span className="text-sm font-medium">Cálculo da Premiação</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor da Venda</p>
                    <p className="font-bold">{formatCurrency(watchedValues.valor_resolvido || 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Faixa</p>
                    <p className="font-bold text-primary">{bonusCalculation.faixa}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Premiação</span>
                    <span className="text-xl font-bold text-success">
                      {formatCurrency(bonusCalculation.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
