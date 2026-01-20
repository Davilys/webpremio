import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
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
  Search,
  Settings,
  ChevronsRight,
  Zap,
  MessageSquare,
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - WebMarcas style */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logoWebmarcas} 
                alt="WebMarcas" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-bold text-sidebar-foreground text-base tracking-tight">CRM WebMarcas</h1>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-sidebar-foreground">CRM WebMarcas</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
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
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
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
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
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
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/20">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - WebMarcas style */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-14">
            {/* Left - Mobile menu + Breadcrumb */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">◯</span>
                <span className="text-muted-foreground">CRM WebMarcas</span>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-muted-foreground text-sm">
                <Search className="w-4 h-4" />
                <span>Buscar...</span>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">⌘K</kbd>
              </div>
              
              <button className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full" />
              </button>
              
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Online</span>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {profile?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
