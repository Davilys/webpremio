import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, ShieldCheck, User } from 'lucide-react';
import { UserWithPermissions, DEFAULT_PERMISSIONS, UserPermission } from '@/hooks/useUserPermissions';

interface UserPermissionsCardProps {
  users: UserWithPermissions[];
  onPermissionChange: (
    userId: string,
    permission: keyof Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    value: boolean
  ) => void;
  onSetAllPermissions: (
    userId: string,
    permissions: Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => void;
  disabled?: boolean;
}

const PERMISSION_LABELS: Record<string, string> = {
  can_view_dashboard: 'Ver Dashboard',
  can_view_registro: 'Ver Registros',
  can_view_publicacao: 'Ver Publicações',
  can_view_equipe: 'Ver Equipe',
  can_create_registro: 'Criar Registros',
  can_create_publicacao: 'Criar Publicações',
};

const FULL_ACCESS: Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  can_view_dashboard: true,
  can_view_registro: true,
  can_view_publicacao: true,
  can_view_equipe: true,
  can_create_registro: true,
  can_create_publicacao: true,
};

const BASIC_ACCESS: Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  can_view_dashboard: true,
  can_view_registro: true,
  can_view_publicacao: true,
  can_view_equipe: false,
  can_create_registro: true,
  can_create_publicacao: true,
};

const UserPermissionsCard: React.FC<UserPermissionsCardProps> = ({
  users,
  onPermissionChange,
  onSetAllPermissions,
  disabled = false,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getUserPermissionValue = (
    user: UserWithPermissions,
    permission: keyof Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): boolean => {
    if (user.permissions) {
      return user.permissions[permission];
    }
    return DEFAULT_PERMISSIONS[permission];
  };

  // Filtrar apenas funcionários (admins têm acesso total automaticamente)
  const funcionarios = users.filter((u) => u.role !== 'admin');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Permissões de Usuários</CardTitle>
            <CardDescription>
              Configure o que cada funcionário pode visualizar e fazer no sistema
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {funcionarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum funcionário cadastrado</p>
            <p className="text-sm">Adicione funcionários na aba Usuários para gerenciar permissões</p>
          </div>
        ) : (
          <div className="space-y-6">
            {funcionarios.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.nome}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSetAllPermissions(user.id, BASIC_ACCESS)}
                      disabled={disabled}
                    >
                      Acesso Básico
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onSetAllPermissions(user.id, FULL_ACCESS)}
                      disabled={disabled}
                    >
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      Acesso Total
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <Switch
                        checked={getUserPermissionValue(
                          user,
                          key as keyof Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'>
                        )}
                        onCheckedChange={(checked) =>
                          onPermissionChange(
                            user.id,
                            key as keyof Omit<UserPermission, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
                            checked
                          )
                        }
                        disabled={disabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info sobre admins */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span>
              <strong>Administradores</strong> têm acesso total a todas as funcionalidades automaticamente.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPermissionsCard;
