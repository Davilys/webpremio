import React from 'react';
import { motion, type Easing } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumLoaderProps {
  message?: string;
  variant?: 'default' | 'card' | 'table' | 'fullscreen';
  className?: string;
}

const PremiumLoader: React.FC<PremiumLoaderProps> = ({
  message = 'Carregando...',
  variant = 'default',
  className,
}) => {
  const easeLinear: Easing = 'linear';
  const easeInOut: Easing = 'easeInOut';

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Premium Spinner */}
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: easeInOut,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-full bg-primary/20 blur-md"
        />
        
        {/* Main spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            ease: easeLinear,
            repeat: Infinity,
          }}
          className="relative w-12 h-12"
        >
          {/* Gradient ring */}
          <svg className="w-full h-full" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#spinnerGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center dot */}
          <motion.div
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: easeInOut }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </div>

      {/* Message with animated dots */}
      {message && (
        <div className="flex items-center gap-0.5 text-sm text-muted-foreground font-medium">
          <span>{message}</span>
          <div className="flex gap-0.5 ml-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  duration: 0.6,
                  ease: easeInOut,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="inline-block"
              >
                .
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'fullscreen') {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center bg-background',
        className
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoaderContent />
        </motion.div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'bg-card rounded-2xl p-8 border border-border/50 flex items-center justify-center min-h-[200px]',
          className
        )}
      >
        <LoaderContent />
      </motion.div>
    );
  }

  if (variant === 'table') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn('flex items-center justify-center py-16', className)}
      >
        <LoaderContent />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex items-center justify-center py-12', className)}
    >
      <LoaderContent />
    </motion.div>
  );
};

export default PremiumLoader;
