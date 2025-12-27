import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Sparkles, Smartphone, Gamepad2, Bitcoin, Monitor, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function Index() {
  return (
    <div className="min-h-screen bg-background bg-gradient-radial flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="container mx-auto flex items-center justify-between gap-2">
          <Link to="/" className="flex-shrink-0">
            <AnimatedLogo className="scale-90 sm:scale-100" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm px-3 sm:px-4">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              Crafting Digital Excellence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Build Your Next{' '}
            <span className="text-gradient">Digital Product</span>{' '}
            With Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Full-stack development services, premium templates, and digital products to accelerate your development journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group glow-primary">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button size="lg" variant="outline" className="border-border/50 hover:bg-muted/50 font-semibold px-8 py-6 text-lg">
                View Portfolio
              </Button>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { icon: Smartphone, label: 'Mobile Apps', desc: 'iOS & Android' },
              { icon: Globe, label: 'Web Development', desc: 'Modern & Fast' },
              { icon: Gamepad2, label: 'Game Development', desc: 'Unity & Unreal' },
              { icon: Bitcoin, label: 'Blockchain Dev', desc: 'Web3 & DApps' },
              { icon: Zap, label: 'API Development', desc: 'Scalable & Secure' },
              { icon: Monitor, label: 'Software Dev', desc: 'Custom Solutions' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-5 text-center group hover:border-primary/50 transition-all">
                <item.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold mb-1 text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm">
        © 2024 DevStackGlobe. All rights reserved.
      </footer>
    </div>
  );
}
