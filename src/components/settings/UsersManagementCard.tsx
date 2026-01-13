import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Users, UserPlus, Trash2, Edit2, Shield, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

interface User {
  id: string;
  nome: string;
  email: string;
  status: boolean;
  role: 'admin' | 'funcionario';
  created_at: string;
}

interface UsersManagementCardProps {
  users: User[];
  onRefresh: () => void;
  disabled?: boolean;
}

const newUserSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100),
});

const UsersManagementCard: React.FC<UsersManagementCardProps> = ({
  users,
  onRefresh,
  disabled = false,
}) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', password: '' });
  const [editFormData, setEditFormData] = useState({ nome: '' });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCreateUser = async () => {
    try {
      const validated = newUserSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase.functions.invoke('user-provision', {
        body: {
          email: validated.email,
          password: validated.password,
          nome: validated.nome,
        },
      });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Usuário criado com sucesso.',
      });

      setFormData({ nome: '', email: '', password: '' });
      setIsDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível criar o usuário.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'funcionario') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Função do usuário atualizada com sucesso.',
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a função do usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ nome: editFormData.nome })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Usuário atualizado com sucesso.',
      });

      setIsEditDialogOpen(false);
      setEditingUser(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o usuário.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: 'Erro',
        description: 'Você não pode excluir sua própria conta.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Primeiro deletar roles e permissions
      await supabase.from('user_roles').delete().eq('user_id', userId);
      await supabase.from('user_permissions').delete().eq('user_id', userId);
      
      // Depois deletar profile
      const { error } = await supabase.from('profiles').delete().eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Usuário excluído com sucesso.',
      });

      onRefresh();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o usuário.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditFormData({ nome: user.nome });
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Gestão de Usuários</CardTitle>
              <CardDescription>
                Adicione, edite e gerencie os usuários do sistema
              </CardDescription>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={disabled}>
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar um novo usuário no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do usuário"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Usuário'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(user.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.nome}</p>
                    {user.role === 'admin' ? (
                      <Badge variant="default" className="text-xs">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Funcionário
                      </Badge>
                    )}
                    {!user.status && (
                      <Badge variant="destructive" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={user.role}
                  onValueChange={(value: 'admin' | 'funcionario') =>
                    handleUpdateRole(user.id, value)
                  }
                  disabled={disabled || user.id === currentUser?.id}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                  </SelectContent>
                </Select>

                <Switch
                  checked={user.status}
                  onCheckedChange={() => handleToggleStatus(user.id, user.status)}
                  disabled={disabled || user.id === currentUser?.id}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(user)}
                  disabled={disabled}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      disabled={disabled || user.id === currentUser?.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o usuário <strong>{user.nome}</strong>?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Atualize os dados do usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome Completo</Label>
                <Input
                  id="edit-nome"
                  value={editFormData.nome}
                  onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                  placeholder="Nome do usuário"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditUser} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UsersManagementCard;
