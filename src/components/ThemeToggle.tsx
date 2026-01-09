import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'icon' | 'full' | 'dropdown';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  // Simple icon toggle
  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={cn(
          "p-2 rounded-lg transition-colors",
          "hover:bg-secondary text-muted-foreground hover:text-foreground",
          className
        )}
        aria-label={resolvedTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        <motion.div
          initial={false}
          animate={{ rotate: resolvedTheme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </motion.button>
    );
  }

  // Dropdown with all options
  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hover:bg-secondary", className)}
          >
            <motion.div
              initial={false}
              animate={{ rotate: resolvedTheme === 'dark' ? 0 : 180 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className={cn(
              "gap-2 cursor-pointer",
              theme === 'light' && "bg-secondary"
            )}
          >
            <Sun className="w-4 h-4" />
            <span>Claro</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className={cn(
              "gap-2 cursor-pointer",
              theme === 'dark' && "bg-secondary"
            )}
          >
            <Moon className="w-4 h-4" />
            <span>Escuro</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className={cn(
              "gap-2 cursor-pointer",
              theme === 'system' && "bg-secondary"
            )}
          >
            <Monitor className="w-4 h-4" />
            <span>Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full button with label
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors",
        "bg-secondary/50 hover:bg-secondary text-foreground",
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{ rotate: resolvedTheme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-5 h-5 text-accent" />
        ) : (
          <Sun className="w-5 h-5 text-warning" />
        )}
      </motion.div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">
          {resolvedTheme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
        </p>
        <p className="text-xs text-muted-foreground">
          {theme === 'system' ? 'Seguindo sistema' : 'Manual'}
        </p>
      </div>
      <div className={cn(
        "w-10 h-6 rounded-full p-1 transition-colors",
        resolvedTheme === 'dark' ? "bg-accent" : "bg-muted"
      )}>
        <motion.div
          className="w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ x: resolvedTheme === 'dark' ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
