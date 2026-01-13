import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemSettings, SystemSettings } from '@/hooks/useSystemSettings';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Settings, DollarSign, Users, Shield, RotateCcw } from 'lucide-react';
import BonusSettingsCard from '@/components/settings/BonusSettingsCard';
import ValuesSettingsCard from '@/components/settings/ValuesSettingsCard';
import UserPermissionsCard from '@/components/settings/UserPermissionsCard';
import UsersManagementCard from '@/components/settings/UsersManagementCard';

const Configuracoes: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { 
    settings, 
    loading: settingsLoading, 
    saving, 
    updateMultipleSettings,
    refetch: refetchSettings 
  } = useSystemSettings();
  const {
    users,
    loading: usersLoading,
    saving: usersSaving,
    updateUserPermission,
    setAllPermissions,
    refetch: refetchUsers,
  } = useUserPermissions();

  // Estado local para mudanças não salvas
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar settings com localSettings
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Redirecionar se não for admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, authLoading, navigate]);

  const handleSettingChange = (key: keyof SystemSettings, value: number) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    await updateMultipleSettings(localSettings);
    setHasChanges(false);
  };

  const handleResetChanges = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const isLoading = authLoading || settingsLoading || usersLoading;
  const isSaving = saving || usersSaving;

  // Mapear users para formato esperado pelo UsersManagementCard
  const usersForManagement = users.map((u) => ({
    id: u.id,
    nome: u.nome,
    email: u.email,
    status: u.status,
    role: u.role,
    created_at: u.created_at,
  }));

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configurações</h1>
              <p className="text-muted-foreground">
                Gerencie todas as configurações do sistema
              </p>
            </div>
          </div>

          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleResetChanges}
                disabled={isSaving}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Descartar
              </Button>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bonus" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="bonus" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Premiação</span>
            </TabsTrigger>
            <TabsTrigger value="valores" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Valores</span>
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="permissoes" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Permissões</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Premiação */}
          <TabsContent value="bonus" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <BonusSettingsCard
                settings={localSettings}
                onSettingChange={handleSettingChange}
                disabled={isSaving}
              />
            )}
          </TabsContent>

          {/* Tab: Valores */}
          <TabsContent value="valores" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <ValuesSettingsCard
                settings={localSettings}
                onSettingChange={handleSettingChange}
                disabled={isSaving}
              />
            )}
          </TabsContent>

          {/* Tab: Usuários */}
          <TabsContent value="usuarios" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <UsersManagementCard
                users={usersForManagement}
                onRefresh={refetchUsers}
                disabled={isSaving}
              />
            )}
          </TabsContent>

          {/* Tab: Permissões */}
          <TabsContent value="permissoes" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <UserPermissionsCard
                users={users}
                onPermissionChange={updateUserPermission}
                onSetAllPermissions={setAllPermissions}
                disabled={isSaving}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
