import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistrations } from '@/hooks/useRegistrations';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BonusPanelRegistro from '@/components/dashboard/BonusPanelRegistro';
import MonthSelector from '@/components/dashboard/MonthSelector';
import { EditRegistrationModal, canEditRegistration } from '@/components/EditRegistrationModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bookmark, Plus, Trash2 } from 'lucide-react';
import PremiumLoader from '@/components/PremiumLoader';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { PAYMENT_METHOD_LABELS } from '@/types/database';
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

const RegistroMarca: React.FC = () => {
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { registrations, loading, refetch, getQuantityByPayment } = useRegistrations(
    selectedDate,
    'registro'
  );
  const { toast } = useToast();

  const monthYear = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
  const registroData = getQuantityByPayment('registro');

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
              <Bookmark className="w-8 h-8 text-primary" />
              Registro de Marca
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus registros de marcas e classes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
            <Link to="/dashboard/novo">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Registro
              </Button>
            </Link>
          </div>
        </div>

        {/* Bonus Panel */}
        <div className="max-w-md">
          <BonusPanelRegistro
            title="Registro de Marca"
            icon={<Bookmark className="w-6 h-6 text-primary-foreground" />}
            avistaQuantity={registroData.avista}
            parceladoQuantity={registroData.parcelado}
            promocaoQuantity={registroData.promocao}
            monthYear={monthYear}
          />
        </div>

        {/* Registrations Table */}
        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="text-xl font-bold mb-4">Registros do Mês</h2>

          {loading ? (
            <PremiumLoader message="Carregando registros" variant="table" />
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum registro de marca neste mês.
              </p>
              <Link to="/dashboard/novo">
                <Button className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Fazer Primeiro Registro
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
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Ações
                    </th>
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
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditRegistrationModal
                            registration={reg}
                            type="registro"
                            onSuccess={refetch}
                          />
                          {isAdmin && (
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
                                    Tem certeza que deseja excluir este registro?
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
                          )}
                        </div>
                      </td>
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

export default RegistroMarca;
