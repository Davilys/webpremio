import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/database';

export interface UserPermission {
  id: string;
  user_id: string;
  can_view_dashboard: boolean;
  can_view_registro: boolean;
  can_view_publicacao: boolean;
  can_view_equipe: boolean;
  can_create_registro: boolean;
  can_create_publicacao: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithPermissions extends Profile {
  role: 'admin' | 'funcionario';
  permissions?: UserPermission;
}

export const DEFAULT_PERMISSIONS: Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  can_view_dashboard: true,
  can_view_registro: true,
  can_view_publicacao: true,
  can_view_equipe: false,
  can_create_registro: true,
  can_create_publicacao: true,
};

export const useUserPermissions = () => {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchUsersWithPermissions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Buscar perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('nome');

      if (profilesError) throw profilesError;

      // Buscar roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Buscar permissões
      const { data: permissions, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      // Combinar dados
      const usersWithPermissions: UserWithPermissions[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.id);
        const userPermissions = permissions?.find((p) => p.user_id === profile.id);

        return {
          ...profile,
          role: (userRole?.role as 'admin' | 'funcionario') || 'funcionario',
          permissions: userPermissions as UserPermission | undefined,
        };
      });

      setUsers(usersWithPermissions);
    } catch (error) {
      console.error('Error fetching users with permissions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateUserPermission = async (
    userId: string,
    permission: keyof Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    value: boolean
  ) => {
    try {
      setSaving(true);

      // Verificar se já existe permissão para o usuário
      const { data: existingPermission } = await supabase
        .from('user_permissions')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingPermission) {
        // Atualizar permissão existente
        const { error } = await supabase
          .from('user_permissions')
          .update({ [permission]: value })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Criar nova permissão
        const { error } = await supabase
          .from('user_permissions')
          .insert({
            user_id: userId,
            ...DEFAULT_PERMISSIONS,
            [permission]: value,
          });

        if (error) throw error;
      }

      // Atualizar estado local
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              permissions: {
                ...(user.permissions || {
                  id: '',
                  user_id: userId,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  ...DEFAULT_PERMISSIONS,
                }),
                [permission]: value,
              } as UserPermission,
            };
          }
          return user;
        })
      );

      toast({
        title: 'Sucesso',
        description: 'Permissão atualizada com sucesso.',
      });
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a permissão.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const setAllPermissions = async (
    userId: string,
    permissions: Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      setSaving(true);

      const { data: existingPermission } = await supabase
        .from('user_permissions')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingPermission) {
        const { error } = await supabase
          .from('user_permissions')
          .update(permissions)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_permissions')
          .insert({
            user_id: userId,
            ...permissions,
          });

        if (error) throw error;
      }

      await fetchUsersWithPermissions();

      toast({
        title: 'Sucesso',
        description: 'Permissões atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error setting permissions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as permissões.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUsersWithPermissions();
  }, [fetchUsersWithPermissions]);

  return {
    users,
    loading,
    saving,
    updateUserPermission,
    setAllPermissions,
    refetch: fetchUsersWithPermissions,
  };
};
