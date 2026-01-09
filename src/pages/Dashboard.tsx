import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistrations } from '@/hooks/useRegistrations';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PremiumStatsCard from '@/components/dashboard/PremiumStatsCard';
import BonusPanelRegistro from '@/components/dashboard/BonusPanelRegistro';
import BonusPanelPublicacao from '@/components/dashboard/BonusPanelPublicacao';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import PeriodFilter from '@/components/dashboard/PeriodFilter';
import GoalProgressChart from '@/components/dashboard/GoalProgressChart';
import PerformanceFunnel from '@/components/dashboard/PerformanceFunnel';
import RecentRegistrationsTable from '@/components/dashboard/RecentRegistrationsTable';
import WelcomePopup from '@/components/dashboard/WelcomePopup';
import SkeletonLoader from '@/components/dashboard/SkeletonLoader';
import { 
  Bookmark, 
  FileText, 
  Award, 
  TrendingUp, 
  Users,
  Clock
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
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
  const { profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month');

  const motivationalQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  }, []);

  const { registrations, loading, getQuantityByPayment } = useRegistrations(selectedDate);

  const registroData = getQuantityByPayment('registro');
  // totalPremiacao = apenas avista + parcelado (para cálculo de meta e bônus)
  const registroTotalPremiacao = registroData.totalPremiacao;
  // total = todas as marcas fechadas (incluindo valor personalizado)
  const registroTotal = registroData.total;
  
  const publicacaoData = getQuantityByPayment('publicacao');
  const publicacaoTotalPremiacao = publicacaoData.totalPremiacao;
  const publicacaoTotal = publicacaoData.total;
  
  const totalGeral = registroTotal + publicacaoTotal;

  // Calcular bônus usando apenas registros que geram premiação (avista + parcelado)
  const registroBonus = calculateRegistroBonus(
    registroTotalPremiacao,
    registroData.avista,
    registroData.parcelado
  );
  const publicacaoBonus = calculatePublicacaoBonus(
    publicacaoData.avista,
    publicacaoData.parcelado
  );
  
  const totalBonus = registroBonus.total + publicacaoBonus.total;

  const monthYear = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });

  const chartData = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });
    
    return weeks.map((_, index) => ({
      name: `Sem ${index + 1}`,
      atual: Math.round(registroTotalPremiacao / weeks.length * (index + 1)),
      meta: BONUS_GOAL,
    }));
  }, [selectedDate, registroTotalPremiacao]);

  const funnelData = useMemo(() => [
    { name: 'Total de Cadastros', value: totalGeral, color: 'hsl(224, 71%, 4%)' },
    { name: 'Registros de Marca', value: registroTotal, color: 'hsl(224, 50%, 20%)' },
    { name: 'Publicações', value: publicacaoTotal, color: 'hsl(142, 76%, 36%)' },
    { name: 'Pagamentos à Vista', value: registroData.avista + publicacaoData.avista, color: 'hsl(142, 76%, 30%)' },
  ], [totalGeral, registroTotal, publicacaoTotal, registroData.avista, publicacaoData.avista]);

  const userName = profile?.nome?.split(' ')[0] || 'Usuário';

  return (
    <DashboardLayout>
      <WelcomePopup
        isOpen={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
        userName={userName}
        motivationalQuote={motivationalQuote}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight"
              >
                Metas & Performance
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mt-1"
              >
                Acompanhe seus resultados em tempo real
              </motion.p>
            </div>
            
            <PeriodFilter
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} variant="card" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonLoader variant="chart" />
              <SkeletonLoader variant="chart" />
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <PremiumStatsCard
                    title="Registros de Marca"
                    value={registroTotal}
                    subtitle={`Meta: ${registroTotalPremiacao}/${BONUS_GOAL} | Sem bônus: ${registroData.promocao}`}
                    icon={Bookmark}
                    variant={registroTotalPremiacao >= BONUS_GOAL ? 'success' : 'primary'}
                    delay={0}
                  />
                  <PremiumStatsCard
                    title="Publicações"
                    value={publicacaoTotal}
                    subtitle={`Com bônus: ${publicacaoTotalPremiacao} | Sem bônus: ${publicacaoData.promocao}`}
                    icon={FileText}
                    variant="accent"
                    delay={0.05}
                  />
                  <PremiumStatsCard
                    title="Total de Cadastros"
                    value={totalGeral}
                    subtitle="Marcas + Publicações"
                    icon={TrendingUp}
                    variant="default"
                    delay={0.1}
                  />
                  <PremiumStatsCard
                    title="Premiação Total"
                    value={totalBonus}
                    subtitle="Valor acumulado"
                    icon={Award}
                    variant={totalBonus > 0 ? 'success' : 'default'}
                    formatAsCurrency
                    delay={0.15}
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GoalProgressChart 
                    data={chartData}
                    goalValue={BONUS_GOAL}
                    title="Progresso de Registros"
                  />
                  <PerformanceFunnel
                    stages={funnelData}
                    title="Funil de Performance"
                  />
                </div>

                {/* Bonus Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <BonusPanelRegistro
                      title="Registro de Marca"
                      icon={<Bookmark className="w-5 h-5 text-background" />}
                      avistaQuantity={registroData.avista}
                      parceladoQuantity={registroData.parcelado}
                      promocaoQuantity={registroData.promocao}
                      monthYear={monthYear}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <BonusPanelPublicacao
                      title="Publicação"
                      icon={<FileText className="w-5 h-5 text-background" />}
                      avistaQuantity={publicacaoData.avista}
                      parceladoQuantity={publicacaoData.parcelado}
                      promocaoQuantity={publicacaoData.promocao}
                      monthYear={monthYear}
                    />
                  </motion.div>
                </div>

                <RecentRegistrationsTable registrations={registrations} />
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GoalProgressChart 
                    data={chartData}
                    goalValue={BONUS_GOAL}
                    title="Meta de Registros"
                  />
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Resumo de Metas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bookmark className="w-5 h-5 text-foreground" />
                          <span className="font-medium text-sm">Registros</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{registroTotalPremiacao} / {BONUS_GOAL}</p>
                          <p className="text-xs text-muted-foreground">
                            {registroTotalPremiacao >= BONUS_GOAL ? '✓ Meta atingida' : `Faltam ${BONUS_GOAL - registroTotalPremiacao}`}
                          </p>
                          {registroData.promocao > 0 && (
                            <p className="text-xs text-amber-600">{registroData.promocao} sem bônus</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-accent" />
                          <span className="font-medium text-sm">Premiação</span>
                        </div>
                        <p className="font-bold text-accent">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBonus)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <PremiumStatsCard
                    title="Taxa de Conversão"
                    value={totalGeral > 0 ? Math.round((registroData.avista / totalGeral) * 100) : 0}
                    subtitle="Pagamentos à vista"
                    icon={TrendingUp}
                    variant="success"
                    delay={0}
                  />
                  <PremiumStatsCard
                    title="Média Diária"
                    value={Math.round(totalGeral / 30)}
                    subtitle="Cadastros por dia"
                    icon={Clock}
                    variant="primary"
                    delay={0.05}
                  />
                  <PremiumStatsCard
                    title="Clientes Únicos"
                    value={new Set(registrations.map(r => r.nome_cliente)).size}
                    subtitle="Clientes atendidos"
                    icon={Users}
                    variant="accent"
                    delay={0.1}
                  />
                </div>
                <PerformanceFunnel
                  stages={funnelData}
                  title="Funil de Conversão"
                />
              </motion.div>
            )}

            {activeTab === 'comparison' && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Em breve</h3>
                  <p className="text-sm text-muted-foreground">Compare seu desempenho</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RecentRegistrationsTable registrations={registrations} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
