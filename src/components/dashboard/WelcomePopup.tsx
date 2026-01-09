import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  motivationalQuote: string;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({
  isOpen,
  onClose,
  userName,
  motivationalQuote,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Olá, {userName}! 👋
            </motion.span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            
            {/* Animated ring */}
            <motion.div
              className="absolute -inset-2 rounded-2xl border-2 border-primary/30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
              }}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-lg font-medium text-foreground"
          >
            {motivationalQuote}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button 
            onClick={onClose}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-2"
          >
            <Rocket className="w-5 h-5" />
            Vamos lá!
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
