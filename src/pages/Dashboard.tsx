import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistrations } from '@/hooks/useRegistrations';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import BonusPanelRegistro from '@/components/dashboard/BonusPanelRegistro';
import BonusPanelPublicacao from '@/components/dashboard/BonusPanelPublicacao';
import MonthSelector from '@/components/dashboard/MonthSelector';
import { Bookmark, FileText, Award, TrendingUp, Sparkles, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BONUS_GOAL, 
  calculateRegistroBonus,
  calculatePublicacaoBonus 
} from '@/types/database';

const motivationalQuotes = [
  "Cada registro que você faz é um passo rumo ao sucesso! 🚀",
  "Seu esforço de hoje constrói sua vitória de amanhã! 💪",
  "Você está fazendo a diferença, continue assim! ⭐",
  "Grandes conquistas começam com pequenas ações diárias! 🏆",
  "Sua dedicação é inspiradora, não desista! 🔥",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia! 📈",
  "Você tem o poder de transformar metas em realidade! ✨",
  "Cada novo registro é uma semente de prosperidade plantada! 🌱",
  "Seu talento está fazendo a diferença na equipe! 🌟",
  "Acredite no seu potencial, você é capaz! 💫",
  "A persistência é o caminho para a excelência! 🎯",
  "Você está mais perto do seu objetivo do que imagina! 🏅",
  "Sua energia positiva contagia toda a equipe! ☀️",
  "Hoje é um novo dia para bater recordes! 🎖️",
  "Foco, força e fé: você vai longe! 💎",
];

const Dashboard: React.FC = () => {
  const { profile, isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  // Seleciona uma frase motivacional aleatória a cada visita
  const motivationalQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  }, []);

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
      {/* Welcome Popup */}
      <Dialog open={showWelcomePopup} onOpenChange={setShowWelcomePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <span>Olá, {profile?.nome?.split(' ')[0] || 'Usuário'}! 👋</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-center text-lg font-medium text-foreground">
              {motivationalQuote}
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowWelcomePopup(false)}
              className="w-full sm:w-auto"
            >
              Vamos lá! 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Olá, {profile?.nome?.split(' ')[0] || 'Usuário'}! 👋
            </h1>
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
