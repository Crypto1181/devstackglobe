import { motion } from 'framer-motion';

export default function AnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Animated Globe */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
        
        {/* Globe container */}
        <motion.div
          className="relative w-10 h-10"
          animate={{ rotateY: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Globe sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/40 shadow-lg">
            {/* Latitude lines */}
            <div className="absolute inset-1 rounded-full border border-primary-foreground/20" />
            <div className="absolute inset-2 rounded-full border border-primary-foreground/15" />
            <div className="absolute inset-3 rounded-full border border-primary-foreground/10" />
            
            {/* Longitude line - vertical */}
            <motion.div 
              className="absolute left-1/2 top-0 bottom-0 w-px bg-primary-foreground/30 -translate-x-1/2"
              style={{ transformStyle: 'preserve-3d' }}
            />
            
            {/* Longitude line - horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-primary-foreground/30 -translate-y-1/2" />
            
            {/* Highlight */}
            <div className="absolute top-1 left-2 w-3 h-3 rounded-full bg-white/40 blur-sm" />
          </div>
          
          {/* Orbiting dot */}
          <motion.div
            className="absolute w-2 h-2 bg-accent rounded-full shadow-lg"
            style={{ top: '50%', left: '50%' }}
            animate={{
              x: [0, 20, 0, -20, 0],
              y: [-20, 0, 20, 0, -20],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Ring around globe */}
        <motion.div
          className="absolute inset-[-4px] rounded-full border-2 border-primary/40 border-dashed"
          animate={{ rotate: -360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="font-display text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          DevStackGlobe
        </span>
        <motion.div 
          className="h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </div>
  );
}
