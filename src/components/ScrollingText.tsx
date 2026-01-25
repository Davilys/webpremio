import React, { useEffect, useState, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollingTextProps {
  phrases: string[];
  interval?: number;
  className?: string;
  style?: CSSProperties;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({
  phrases,
  interval = 3500,
  className = '',
  style,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, interval);

    return () => clearInterval(timer);
  }, [phrases.length, interval]);

  return (
    <span className="inline-block relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{
            y: { 
              type: 'spring', 
              stiffness: 200, 
              damping: 25,
              duration: 0.5 
            },
            opacity: { duration: 0.3 },
          }}
          className={`inline-block ${className}`}
          style={style}
        >
          {phrases[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default ScrollingText;
