import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import logoWebmarcas from '@/assets/logo-webmarcas-icon.png';
import {
  LayoutDashboard,
  Users,
  FileText,
  Bookmark,
  LogOut,
  X,
  BarChart3,
  PlusCircle,
  Settings,
  Wallet,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  subtitle?: string;
  href: string;
  icon: React.ElementType;
  iconColor?: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    subtitle: 'Métricas e relatórios',
    href: '/dashboard',
    icon: LayoutDashboard,
    iconColor: 'text-primary',
  },
  {
    label: 'Novo Cadastro',
    subtitle: 'Registrar cliente',
    href: '/dashboard/novo',
    icon: PlusCircle,
    iconColor: 'text-success',
  },
  {
    label: 'Registro de Marca',
    subtitle: 'Gestão de marcas',
    href: '/dashboard/registro',
    icon: Bookmark,
    iconColor: 'text-primary',
  },
  {
    label: 'Publicação',
    subtitle: 'Gestão de publicações',
    href: '/dashboard/publicacao',
    icon: FileText,
    iconColor: 'text-accent',
  },
  {
    label: 'Devedores',
    subtitle: 'Valores resolvidos',
    href: '/dashboard/devedores',
    icon: Wallet,
    iconColor: 'text-amber-500',
  },
  {
    label: 'Equipe',
    subtitle: 'Ranking e desempenho',
    href: '/dashboard/equipe',
    icon: BarChart3,
    iconColor: 'text-warning',
    adminOnly: true,
  },
  {
    label: 'Usuários',
    subtitle: 'Gestão de usuários',
    href: '/dashboard/usuarios',
    icon: Users,
    iconColor: 'text-pink-500',
    adminOnly: true,
  },
  {
    label: 'Configurações',
    subtitle: 'Ajustes do sistema',
    href: '/dashboard/configuracoes',
    icon: Settings,
    iconColor: 'text-muted-foreground',
    adminOnly: true,
  },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onSignOut }) => {
  const { profile, isAdmin } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-card z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <img 
                  src={logoWebmarcas} 
                  alt="WebMarcas" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h2 className="font-bold text-foreground text-base">Menu</h2>
                  <p className="text-xs text-muted-foreground">CRM WebMarcas</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center active:bg-secondary/80"
              >
                <X className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {profile?.nome?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{profile?.nome || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-success/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-medium text-success">Online</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                {filteredNavItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.98]",
                          isActive
                            ? "bg-primary/10"
                            : "active:bg-secondary"
                        )}
                      >
                        <span className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                          isActive 
                            ? "bg-primary/20" 
                            : "bg-secondary",
                          item.iconColor || "text-foreground"
                        )}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className={cn(
                            "font-medium text-sm block",
                            isActive ? "text-primary" : "text-foreground"
                          )}>
                            {item.label}
                          </span>
                          {item.subtitle && (
                            <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                          )}
                        </div>
                        <ChevronRight className={cn(
                          "w-4 h-4",
                          isActive ? "text-primary" : "text-muted-foreground/50"
                        )} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-3">
              {/* Theme toggle */}
              <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 rounded-2xl">
                <span className="text-sm font-medium text-foreground">Tema</span>
                <ThemeToggle variant="icon" />
              </div>

              {/* Sign out */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-destructive/10 active:bg-destructive/20 transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/20">
                  <LogOut className="w-5 h-5 text-destructive" />
                </span>
                <span className="font-medium text-sm text-destructive">Sair da conta</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
