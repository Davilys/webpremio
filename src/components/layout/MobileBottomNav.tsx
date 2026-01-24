import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Bookmark,
  FileText,
  Menu,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Registro', href: '/dashboard/registro', icon: Bookmark },
  { label: 'Novo', href: '/dashboard/novo', icon: PlusCircle },
  { label: 'Publicação', href: '/dashboard/publicacao', icon: FileText },
];

interface MobileBottomNavProps {
  onMenuClick: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Safe area background */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_30px_rgba(0,0,0,0.1)]" />
      
      <div className="relative flex items-center justify-around px-2 h-[70px] pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          const isCenter = item.label === 'Novo';

          if (isCenter) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="relative -mt-6"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                    "bg-gradient-to-br from-primary to-accent",
                    "active:shadow-md transition-shadow"
                  )}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-primary">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[60px] py-2 px-3 relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary/15" 
                    : "active:bg-secondary"
                )}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} 
                />
              </motion.div>
              <span 
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          );
        })}

        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] py-2 px-3"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl active:bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </motion.div>
          <span className="text-[10px] font-medium text-muted-foreground">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
