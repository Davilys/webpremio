import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  Moon,
  ChevronsRight,
  MessageSquare,
  Link2,
  Bot,
  Zap,
  Send,
  Calendar,
  Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Novo Cadastro',
    href: '/dashboard/novo',
    icon: <PlusCircle className="w-5 h-5" />,
  },
  {
    label: 'Registro de Marca',
    href: '/dashboard/registro',
    icon: <Bookmark className="w-5 h-5" />,
  },
  {
    label: 'Publicação',
    href: '/dashboard/publicacao',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Equipe',
    href: '/dashboard/equipe',
    icon: <BarChart3 className="w-5 h-5" />,
    adminOnly: true,
  },
  {
    label: 'Usuários',
    href: '/dashboard/usuarios',
    icon: <Users className="w-5 h-5" />,
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

      {/* Sidebar - Zionic style with light/neutral colors like print 5 */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background text-xl">🎯</span>
              </div>
              <div>
                <h1 className="font-bold text-foreground text-lg tracking-tight">WEBMARCAS</h1>
                <p className="text-xs text-muted-foreground">Sistema de Premiação</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Card - Like Zionic Credits */}
        <div className="px-4 py-4">
          <div className="bg-secondary/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">Créditos</span>
              </div>
              <span className="text-lg font-bold text-foreground">∞</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">REG</span>
                <span className="font-medium text-foreground">∞</span>
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">PUB</span>
                <span className="font-medium text-foreground">∞</span>
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl text-muted-foreground">
            <Search className="w-4 h-4" />
            <span className="text-sm">Buscar... (⌘K)</span>
          </div>
        </div>

        {/* User Selector */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                {profile?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="font-medium text-foreground">{profile?.nome?.split(' ')[0] || 'Usuário'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
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
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    {item.badge && (
                      <div className="absolute -left-1 -top-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold">
                        {item.badge}
                      </div>
                    )}
                    <span className={cn(
                      "transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium">{item.label}</span>
                      {item.label === 'Dashboard' && (
                        <p className="text-xs text-muted-foreground">Visão geral</p>
                      )}
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
              <Moon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* User info */}
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                {profile?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{profile?.nome || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role === 'admin' ? 'Admin' : 'Funcionário'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - Zionic style */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Left - Mobile menu + User info */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                  {profile?.nome?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{profile?.nome?.split(' ')[0] || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {role === 'admin' ? 'Administrador' : 'Membro'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
              </div>
            </div>

            {/* Right - Search + Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl text-muted-foreground text-sm">
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
              
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
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
