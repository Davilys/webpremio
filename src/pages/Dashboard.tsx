import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistrations } from '@/hooks/useRegistrations';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import BonusPanelRegistro from '@/components/dashboard/BonusPanelRegistro';
import BonusPanelPublicacao from '@/components/dashboard/BonusPanelPublicacao';
import MonthSelector from '@/components/dashboard/MonthSelector';
import { Bookmark, FileText, Award, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BONUS_GOAL, 
  calculateRegistroBonus,
  calculatePublicacaoBonus 
} from '@/types/database';

const Dashboard: React.FC = () => {
  const { profile, isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { registrations, loading, getQuantityByPayment } = useRegistrations(selectedDate);

  // Dados de Registro de Marca
  const registroData = getQuantityByPayment('registro');
  const registroTotal = registroData.total;
  
  // Dados de Publicação
  const publicacaoData = getQuantityByPayment('publicacao');
  const publicacaoTotal = publicacaoData.total;
  
  const totalGeral = registroTotal + publicacaoTotal;

  // Calcular bônus usando as novas regras
  const registroBonus = calculateRegistroBonus(
    registroData.total,
    registroData.avista,
    registroData.parcelado
  );
  const publicacaoBonus = calculatePublicacaoBonus(
    publicacaoData.avista,
    publicacaoData.parcelado
  );
  
  const totalBonus = registroBonus.total + publicacaoBonus.total;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const monthYear = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Olá, {profile?.nome?.split(' ')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin
                ? 'Visão geral do sistema de premiação'
                : 'Acompanhe sua premiação mensal'}
            </p>
          </div>
          <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Registros de Marca"
            value={registroTotal}
            subtitle={`Meta: ${BONUS_GOAL} | À vista: ${registroData.avista}`}
            icon={Bookmark}
            variant={registroTotal >= BONUS_GOAL ? 'success' : 'default'}
          />
          <StatsCard
            title="Publicações"
            value={publicacaoTotal}
            subtitle={`À vista: ${publicacaoData.avista} | Parcelado: ${publicacaoData.parcelado}`}
            icon={FileText}
            variant="default"
          />
          <StatsCard
            title="Total de Cadastros"
            value={totalGeral}
            subtitle="Marcas + Publicações"
            icon={TrendingUp}
            variant="primary"
          />
          <StatsCard
            title="Premiação Total"
            value={formatCurrency(totalBonus)}
            subtitle="Valor acumulado"
            icon={Award}
            variant={totalBonus > 0 ? 'success' : 'default'}
          />
        </div>

        {/* Bonus Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BonusPanelRegistro
            title="Registro de Marca"
            icon={<Bookmark className="w-6 h-6 text-primary-foreground" />}
            avistaQuantity={registroData.avista}
            parceladoQuantity={registroData.parcelado}
            monthYear={monthYear}
          />
          <BonusPanelPublicacao
            title="Publicação"
            icon={<FileText className="w-6 h-6 text-primary-foreground" />}
            avistaQuantity={publicacaoData.avista}
            parceladoQuantity={publicacaoData.parcelado}
            monthYear={monthYear}
          />
        </div>

        {/* Recent Registrations */}
        {registrations.length > 0 && (
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h2 className="text-xl font-bold mb-4">Últimos Cadastros</h2>
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
                      Pagamento
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Qtd
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.slice(0, 5).map((reg) => (
                    <tr
                      key={reg.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">{reg.nome_cliente}</td>
                      <td className="py-3 px-4 text-sm">{reg.nome_marca}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reg.tipo_premiacao === 'registro'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {reg.tipo_premiacao === 'registro'
                            ? 'Registro'
                            : 'Publicação'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reg.forma_pagamento === 'avista'
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {reg.forma_pagamento === 'avista' ? 'À Vista' : 'Parcelado'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {reg.quantidade}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {format(new Date(reg.data_referencia), 'dd/MM/yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">
              Carregando dados...
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
