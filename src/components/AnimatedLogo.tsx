import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnimatedLogo({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Enhanced Animated Logo */}
      <div className="relative">
        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main logo container */}
        <motion.div
          className="relative w-12 h-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={mounted ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Globe with tech layers */}
          <div className="relative w-full h-full">
            {/* Outer ring with code brackets */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/60"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Code bracket decorations */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-xs font-bold">
                {'{'}
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-primary text-xs font-bold">
                {'}'}
              </div>
            </motion.div>

            {/* Globe sphere */}
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-br from-primary via-primary/90 to-accent shadow-2xl"
              animate={{ rotateY: 360 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Latitude lines */}
              <div className="absolute inset-1 rounded-full border border-white/20" />
              <div className="absolute inset-2 rounded-full border border-white/15" />
              
              {/* Longitude lines */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />
              
              {/* Tech grid pattern */}
              <div className="absolute inset-0 rounded-full opacity-20">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full" />
                <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full" />
                <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-white rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full" />
              </div>
              
              {/* Highlight */}
              <motion.div
                className="absolute top-2 left-3 w-2 h-2 rounded-full bg-white/60 blur-sm"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Orbiting tech elements */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-lg"
              style={{ transformOrigin: '0 20px' }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Stack layers indicator */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-primary"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-[-6px] rounded-full border border-primary/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Text with enhanced styling */}
      <div className="flex flex-col">
        <motion.span
          className="font-display text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -10 }}
          animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          DevStackGlobe
        </motion.span>
        <motion.div
          className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          initial={{ scaleX: 0 }}
          animate={mounted ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </div>
  );
}
