import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Rocket } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
        
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Olá, {userName}! 👋
            </motion.span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative flex flex-col items-center gap-6 py-6">
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            
            {/* Animated rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ 
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ 
                scale: [1, 1.8, 1.8],
                opacity: [0.3, 0, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 0.3
              }}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-lg font-medium text-foreground px-4"
          >
            {motivationalQuote}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center relative"
        >
          <Button 
            onClick={onClose}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2"
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
