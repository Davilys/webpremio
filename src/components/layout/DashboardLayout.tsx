import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MobileDrawer from '@/components/layout/MobileDrawer';
import logoWebmarcas from '@/assets/logo-webmarcas-icon.png';
import {
  LayoutDashboard,
  Users,
  FileText,
  Bookmark,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  PlusCircle,
  Settings,
  Bell,
  Wallet,
} from 'lucide-react';

interface NavItem {
  label: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
  iconColor?: string;
  adminOnly?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    subtitle: 'Métricas e relatórios',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    iconColor: 'text-primary',
  },
  {
    label: 'Novo Cadastro',
    subtitle: 'Registrar cliente',
    href: '/dashboard/novo',
    icon: <PlusCircle className="w-5 h-5" />,
    iconColor: 'text-success',
  },
  {
    label: 'Registro de Marca',
    subtitle: 'Gestão de marcas',
    href: '/dashboard/registro',
    icon: <Bookmark className="w-5 h-5" />,
    iconColor: 'text-primary',
  },
  {
    label: 'Publicação',
    subtitle: 'Gestão de publicações',
    href: '/dashboard/publicacao',
    icon: <FileText className="w-5 h-5" />,
    iconColor: 'text-accent',
  },
  {
    label: 'Devedores',
    subtitle: 'Valores resolvidos',
    href: '/dashboard/devedores',
    icon: <Wallet className="w-5 h-5" />,
    iconColor: 'text-amber-500',
  },
  {
    label: 'Equipe',
    subtitle: 'Ranking e desempenho',
    href: '/dashboard/equipe',
    icon: <BarChart3 className="w-5 h-5" />,
    iconColor: 'text-warning',
    adminOnly: true,
  },
  {
    label: 'Usuários',
    subtitle: 'Gestão de usuários',
    href: '/dashboard/usuarios',
    icon: <Users className="w-5 h-5" />,
    iconColor: 'text-pink-500',
    adminOnly: true,
  },
  {
    label: 'Configurações',
    subtitle: 'Ajustes do sistema',
    href: '/dashboard/configuracoes',
    icon: <Settings className="w-5 h-5" />,
    iconColor: 'text-muted-foreground',
    adminOnly: true,
  },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, role, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-out flex flex-col",
          "hidden lg:flex"
        )}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={logoWebmarcas} 
              alt="WebMarcas" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="font-bold text-sidebar-foreground text-base tracking-tight">WebMarcas Premiação</h1>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-sidebar-foreground">Sistema Online</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {filteredNavItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    {item.badge && (
                      <div className="absolute -left-1 -top-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold">
                        {item.badge}
                      </div>
                    )}
                    <span className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                      isActive 
                        ? "bg-primary/20" 
                        : "bg-sidebar-accent",
                      item.iconColor || "text-sidebar-foreground"
                    )}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm block">{item.label}</span>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                      )}
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-primary" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {/* Sair button */}
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/20">
              <LogOut className="w-5 h-5 text-destructive" />
            </span>
            <div className="flex-1">
              <span className="font-medium text-sm">Sair</span>
              <p className="text-xs text-muted-foreground">Encerrar sessão</p>
            </div>
          </Link>
          
          {/* Theme toggle */}
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-muted-foreground">Tema</span>
            <ThemeToggle variant="icon" />
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        onSignOut={handleSignOut}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Left - Logo on mobile */}
            <div className="flex items-center gap-3">
              <img 
                src={logoWebmarcas} 
                alt="WebMarcas" 
                className="w-8 h-8 object-contain lg:hidden"
              />
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">◯</span>
                <span className="text-muted-foreground">WebMarcas Premiação</span>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="relative p-2.5 rounded-xl bg-secondary/50 active:bg-secondary text-muted-foreground transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-success rounded-full" />
              </motion.button>
              
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Online</span>
              </div>
              
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm shadow-lg"
              >
                {profile?.nome?.charAt(0).toUpperCase() || 'U'}
              </motion.div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-auto bg-background">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav onMenuClick={() => setDrawerOpen(true)} />
      </div>
    </div>
  );
};

export default DashboardLayout;
