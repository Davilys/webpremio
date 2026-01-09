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
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek } from 'date-fns';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month');

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

  const monthYear = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });

  // Generate chart data for the month
  const chartData = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });
    
    return weeks.map((week, index) => ({
      name: `Sem ${index + 1}`,
      atual: Math.round(registroTotal / weeks.length * (index + 1)),
      meta: BONUS_GOAL,
    }));
  }, [selectedDate, registroTotal]);

  // Funnel data
  const funnelData = useMemo(() => [
    { name: 'Total de Cadastros', value: totalGeral, color: 'hsl(199, 100%, 48%)' },
    { name: 'Registros de Marca', value: registroTotal, color: 'hsl(199, 100%, 40%)' },
    { name: 'Publicações', value: publicacaoTotal, color: 'hsl(152, 69%, 45%)' },
    { name: 'Pagamentos à Vista', value: registroData.avista + publicacaoData.avista, color: 'hsl(152, 69%, 35%)' },
  ], [totalGeral, registroTotal, publicacaoTotal, registroData.avista, publicacaoData.avista]);

  const userName = profile?.nome?.split(' ')[0] || 'Usuário';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <WelcomePopup
        isOpen={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
        userName={userName}
        motivationalQuote={motivationalQuote}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-2">
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Metas & Performance
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
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

          {/* Tabs */}
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

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
            <SkeletonLoader variant="table" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <PremiumStatsCard
                    title="Registros de Marca"
                    value={registroTotal}
                    subtitle={`Meta: ${BONUS_GOAL} | À vista: ${registroData.avista}`}
                    icon={Bookmark}
                    variant={registroTotal >= BONUS_GOAL ? 'success' : 'primary'}
                    delay={0}
                  />
                  <PremiumStatsCard
                    title="Publicações"
                    value={publicacaoTotal}
                    subtitle={`À vista: ${publicacaoData.avista} | Parcelado: ${publicacaoData.parcelado}`}
                    icon={FileText}
                    variant="accent"
                    delay={0.1}
                  />
                  <PremiumStatsCard
                    title="Total de Cadastros"
                    value={totalGeral}
                    subtitle="Marcas + Publicações"
                    icon={TrendingUp}
                    variant="default"
                    delay={0.2}
                  />
                  <PremiumStatsCard
                    title="Premiação Total"
                    value={totalBonus}
                    subtitle="Valor acumulado"
                    icon={Award}
                    variant={totalBonus > 0 ? 'success' : 'default'}
                    formatAsCurrency
                    delay={0.3}
                  />
                </div>

                {/* Charts Row */}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <BonusPanelRegistro
                      title="Registro de Marca"
                      icon={<Bookmark className="w-6 h-6 text-primary-foreground" />}
                      avistaQuantity={registroData.avista}
                      parceladoQuantity={registroData.parcelado}
                      monthYear={monthYear}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <BonusPanelPublicacao
                      title="Publicação"
                      icon={<FileText className="w-6 h-6 text-primary-foreground" />}
                      avistaQuantity={publicacaoData.avista}
                      parceladoQuantity={publicacaoData.parcelado}
                      monthYear={monthYear}
                    />
                  </motion.div>
                </div>

                {/* Recent Registrations */}
                <RecentRegistrationsTable registrations={registrations} />
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GoalProgressChart 
                    data={chartData}
                    goalValue={BONUS_GOAL}
                    title="Meta de Registros"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl p-6 border border-border/50 shadow-[0_4px_24px_-4px_hsl(210_60%_15%/0.08)]"
                  >
                    <h3 className="font-semibold text-foreground mb-4">Resumo de Metas</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Bookmark className="w-5 h-5 text-primary" />
                          <span className="font-medium">Registros</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{registroTotal} / {BONUS_GOAL}</p>
                          <p className="text-sm text-muted-foreground">
                            {registroTotal >= BONUS_GOAL ? '✅ Meta atingida!' : `Faltam ${BONUS_GOAL - registroTotal}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-success" />
                          <span className="font-medium">Premiação Projetada</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-success">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBonus)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
                    delay={0.1}
                  />
                  <PremiumStatsCard
                    title="Clientes Ativos"
                    value={new Set(registrations.map(r => r.nome_cliente)).size}
                    subtitle="Clientes únicos"
                    icon={Users}
                    variant="accent"
                    delay={0.2}
                  />
                </div>
                <PerformanceFunnel
                  stages={funnelData}
                  title="Funil de Conversão Detalhado"
                />
              </motion.div>
            )}

            {activeTab === 'comparison' && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center py-16"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Comparativos em breve
                  </h3>
                  <p className="text-muted-foreground">
                    Compare seu desempenho com períodos anteriores
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RecentRegistrationsTable registrations={registrations} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
