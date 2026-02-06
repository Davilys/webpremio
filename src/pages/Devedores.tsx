import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevedores } from '@/hooks/useDevedores';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BonusPanelDevedores from '@/components/dashboard/BonusPanelDevedores';
import MonthSelector from '@/components/dashboard/MonthSelector';
import UserFilter from '@/components/dashboard/UserFilter';
import { EditDevedorModal } from '@/components/EditDevedorModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import PremiumLoader from '@/components/PremiumLoader';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { calculateDevedoresBonus, DevedoresSettings } from '@/types/database';
import { useSystemSettings } from '@/hooks/useSystemSettings';
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

const Devedores: React.FC = () => {
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const { devedores, loading, refetch, getTotalBonus, getTotalValorResolvido, getTotalParcelas } = useDevedores(selectedDate, selectedUserId);
  const { toast } = useToast();
  const { settings } = useSystemSettings();

  const monthYear = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcular total do bônus com as configurações dinâmicas
  const calculatedTotalBonus = devedores.reduce((sum, dev) => {
    const bonus = calculateDevedoresBonus(
      dev.valor_resolvido || 0,
      dev.quantidade_parcelas || 1,
      devedoresSettings
    );
    return sum + bonus.total;
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Wallet className="w-8 h-8 text-primary" />
              Devedores
            </h1>
            <p className="text-muted-foreground mt-1">
              Controle de cadastros com valores resolvidos/pagos
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {isAdmin && (
              <UserFilter
                selectedUserId={selectedUserId}
                onUserChange={setSelectedUserId}
              />
            )}
            <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
            <Link to="/dashboard/novo-devedor">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Registro
              </Button>
            </Link>
          </div>
        </div>

        {/* Bonus Panel */}
        <div className="max-w-md">
          <BonusPanelDevedores
            totalBonus={calculatedTotalBonus}
            totalValorResolvido={getTotalValorResolvido()}
            totalParcelas={getTotalParcelas()}
            totalRegistros={devedores.length}
            monthYear={monthYear}
          />
        </div>

        {/* Devedores Table */}
        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="text-xl font-bold mb-4">Registros do Mês</h2>

          {loading ? (
            <PremiumLoader message="Carregando registros" variant="table" />
          ) : devedores.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum registro de devedor neste mês.
              </p>
              <Link to="/dashboard/novo-devedor">
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
                      Valor Total
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Parcelas
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Valor/Parcela
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Faixa
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Premiação
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
                  {devedores.map((dev) => {
                    const bonus = calculateDevedoresBonus(
                      dev.valor_resolvido || 0,
                      dev.quantidade_parcelas || 1,
                      devedoresSettings
                    );
                    return (
                      <tr
                        key={dev.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">{dev.nome_cliente}</td>
                        <td className="py-3 px-4 text-sm">
                          {formatCurrency(dev.valor_resolvido || 0)}
                        </td>
                        <td className="py-3 px-4 text-sm text-center">
                          {dev.quantidade_parcelas || 1}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {formatCurrency(bonus.valorParcela)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {bonus.faixa}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-success">
                          {formatCurrency(bonus.total)}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {(() => {
                            try {
                              return format(new Date(dev.data_referencia + 'T00:00:00'), 'dd/MM/yyyy');
                            } catch {
                              return dev.data_referencia;
                            }
                          })()}
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4 text-sm">
                            {dev.profiles?.nome || 'N/A'}
                          </td>
                        )}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <EditDevedorModal
                              registration={dev}
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
                                      onClick={() => handleDelete(dev.id)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Devedores;
