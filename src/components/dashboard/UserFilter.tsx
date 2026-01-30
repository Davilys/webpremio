import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/database';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users } from 'lucide-react';

interface UserFilterProps {
  selectedUserId: string | undefined;
  onUserChange: (userId: string | undefined) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ selectedUserId, onUserChange }) => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', true)
          .order('nome', { ascending: true });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  // Only show for admins
  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-muted-foreground" />
      <Select
        value={selectedUserId || 'all'}
        onValueChange={(value) => onUserChange(value === 'all' ? undefined : value)}
        disabled={loading}
      >
        <SelectTrigger className="w-[200px] bg-background">
          <SelectValue placeholder="Filtrar por usuário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os usuários</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilter;
