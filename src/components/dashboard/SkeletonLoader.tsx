import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'chart' | 'table' | 'text';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className, 
  variant = 'card' 
}) => {
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
  };

  if (variant === 'card') {
    return (
      <div className={cn("bg-card rounded-2xl p-6 border border-border/50 overflow-hidden relative", className)}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-muted rounded-lg" />
              <div className="h-8 w-32 bg-muted rounded-lg" />
              <div className="h-3 w-40 bg-muted rounded-lg" />
            </div>
            <div className="w-14 h-14 bg-muted rounded-2xl" />
          </div>
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn("bg-card rounded-2xl p-6 border border-border/50 overflow-hidden relative", className)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-muted rounded-lg" />
            <div className="h-8 w-24 bg-muted rounded-lg" />
          </div>
          <div className="h-64 bg-muted rounded-xl" />
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn("bg-card rounded-2xl p-6 border border-border/50 overflow-hidden relative", className)}>
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted rounded-lg" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 flex-1 bg-muted rounded-lg" />
                <div className="h-10 w-24 bg-muted rounded-lg" />
                <div className="h-10 w-20 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("h-4 bg-muted rounded-lg overflow-hidden relative", className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        variants={shimmer}
        initial="initial"
        animate="animate"
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default SkeletonLoader;
