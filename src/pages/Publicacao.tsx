import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistrations } from '@/hooks/useRegistrations';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BonusPanel from '@/components/dashboard/BonusPanel';
import MonthSelector from '@/components/dashboard/MonthSelector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Trash2 } from 'lucide-react';
import PremiumLoader from '@/components/PremiumLoader';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { PAYMENT_METHOD_LABELS, PUBLICATION_TYPE_LABELS, PublicationType } from '@/types/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Publicacao: React.FC = () => {
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { registrations, loading, refetch, getTotalQuantity } = useRegistrations(
    selectedDate,
    'publicacao'
  );
  const { toast } = useToast();

  const monthYear = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
  const totalQuantity = getTotalQuantity();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('registrations').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Registro excluído',
        description: 'O registro foi removido com sucesso.',
      });

      refetch();
    } catch (err) {
      toast({
        title: 'Erro ao excluir',
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Publicação
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas publicações
            </p>
          </div>
          <div className="flex items-center gap-4">
            <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
            <Link to="/dashboard/novo">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Publicação
              </Button>
            </Link>
          </div>
        </div>

        {/* Bonus Panel */}
        <div className="max-w-md">
          <BonusPanel
            title="Publicação"
            icon={<FileText className="w-6 h-6 text-primary-foreground" />}
            totalQuantity={totalQuantity}
            monthYear={monthYear}
          />
        </div>

        {/* Registrations Table */}
        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="text-xl font-bold mb-4">Publicações do Mês</h2>

          {loading ? (
            <PremiumLoader message="Carregando publicações" variant="table" />
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma publicação neste mês.
              </p>
              <Link to="/dashboard/novo">
                <Button className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Cadastrar Publicação
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Marca
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Qtd
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Pagamento
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Data
                    </th>
                    {isAdmin && (
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Funcionário
                      </th>
                    )}
                    {isAdmin && (
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Ações
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">{reg.nome_cliente}</td>
                      <td className="py-3 px-4 text-sm">{reg.nome_marca}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {reg.tipo_publicacao
                            ? PUBLICATION_TYPE_LABELS[reg.tipo_publicacao as PublicationType]
                            : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {reg.quantidade}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {PAYMENT_METHOD_LABELS[reg.forma_pagamento]}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {format(new Date(reg.data_referencia), 'dd/MM/yyyy')}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-sm">
                          {reg.profiles?.nome || 'N/A'}
                        </td>
                      )}
                      {isAdmin && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar Exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir esta publicação?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(reg.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Publicacao;
