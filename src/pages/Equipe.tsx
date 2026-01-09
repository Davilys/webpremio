import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTeamStats, UserWithStats } from '@/hooks/useTeamStats';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import MonthSelector from '@/components/dashboard/MonthSelector';
import UserKanbanCard from '@/components/dashboard/UserKanbanCard';
import TeamRankingChart from '@/components/dashboard/TeamRankingChart';
import EvolutionChart from '@/components/dashboard/EvolutionChart';
import PremiumLoader from '@/components/PremiumLoader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Users, 
  Award, 
  TrendingUp, 
  LayoutGrid,
  BarChart3,
  Calendar,
  CalendarDays,
  CalendarRange,
  Trophy
} from 'lucide-react';

const Equipe: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'ranking'>('kanban');
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const { users, teamStats, loading } = useTeamStats(selectedDate);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPeriodBonus = () => {
    switch (period) {
      case 'monthly':
        return teamStats.monthlyBonus;
      case 'quarterly':
        return teamStats.quarterlyBonus;
      case 'yearly':
        return teamStats.yearlyBonus;
      default:
        return teamStats.monthlyBonus;
    }
  };

  if (!isAdmin) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Equipe
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do desempenho da equipe
            </p>
          </div>
          <div className="flex items-center gap-4">
            <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant={period === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('monthly')}
            className={period === 'monthly' ? 'gradient-primary' : ''}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Mensal
          </Button>
          <Button
            variant={period === 'quarterly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('quarterly')}
            className={period === 'quarterly' ? 'gradient-primary' : ''}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Trimestral
          </Button>
          <Button
            variant={period === 'yearly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('yearly')}
            className={period === 'yearly' ? 'gradient-primary' : ''}
          >
            <CalendarRange className="w-4 h-4 mr-2" />
            Anual
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Usuários"
            value={teamStats.totalUsers}
            subtitle={`${teamStats.activeUsers} ativos`}
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Premiação Total"
            value={formatCurrency(getPeriodBonus())}
            subtitle={period === 'monthly' ? 'Este mês' : period === 'quarterly' ? 'Trimestre' : 'Ano'}
            icon={Award}
            variant="success"
          />
          <StatsCard
            title="Média por Usuário"
            value={formatCurrency(teamStats.averageBonus)}
            subtitle="Premiação média mensal"
            icon={TrendingUp}
            variant="primary"
          />
          <StatsCard
            title="Top Performer"
            value={teamStats.topPerformer?.nome?.split(' ')[0] || '-'}
            subtitle={teamStats.topPerformer ? formatCurrency(teamStats.topPerformer.monthlyBonus) : '-'}
            icon={Trophy}
            variant="success"
          />
        </div>

        {/* View Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'kanban' | 'ranking')}>
          <TabsList>
            <TabsTrigger value="kanban" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="ranking" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Ranking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            {loading ? (
              <PremiumLoader message="Carregando equipe" variant="table" />
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {users.map((user) => (
                  <UserKanbanCard
                    key={user.id}
                    user={user}
                    onClick={() => setSelectedUser(user)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TeamRankingChart users={users} period={period} />
              <EvolutionChart showTeamAverage months={6} />
            </div>
          </TabsContent>
        </Tabs>

        {/* User Detail Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {selectedUser?.nome?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <span className="block">{selectedUser?.nome}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {selectedUser?.email}
                  </span>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6 mt-4">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Premiação Mensal</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedUser.monthlyBonus)}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Premiação Trimestral</p>
                    <p className="text-2xl font-bold text-accent">
                      {formatCurrency(selectedUser.quarterlyBonus)}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Premiação Anual</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(selectedUser.yearlyBonus)}
                    </p>
                  </div>
                </div>

                {/* Evolution Chart */}
                <EvolutionChart userId={selectedUser.id} showTeamAverage months={6} />

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-muted-foreground mb-1">Total de Registros</p>
                    <p className="text-xl font-semibold">{selectedUser.totalRegistros}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-muted-foreground mb-1">Total de Publicações</p>
                    <p className="text-xl font-semibold">{selectedUser.totalPublicacoes}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Equipe;
