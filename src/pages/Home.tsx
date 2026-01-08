import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Globe, Zap, Gamepad2, Bitcoin, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

const skills = [
  { icon: Smartphone, label: 'Mobile Apps', color: 'text-primary' },
  { icon: Globe, label: 'Web Development', color: 'text-secondary' },
  { icon: Gamepad2, label: 'Game Development', color: 'text-accent' },
  { icon: Bitcoin, label: 'Blockchain Dev', color: 'text-primary' },
  { icon: Zap, label: 'API Development', color: 'text-secondary' },
  { icon: Monitor, label: 'Software Dev', color: 'text-accent' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="container relative z-10 px-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={item} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Available for projects
              </span>
            </motion.div>

            <motion.div variants={item} className="mb-6">
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
                <div className="text-2xl md:text-3xl font-normal mb-2">Welcome to</div>
                <div className="text-gradient">DevStackGlobe</div>
              </h1>
            </motion.div>

            <motion.p
              variants={item}
              className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto"
            >
              We are <span className="text-primary font-semibold">Full Stack Developers</span> specializing in
            </motion.p>

            <motion.p
              variants={item}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Mobile Apps • Web Development • Game Development • Blockchain • API Development • Software Dev
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/portfolio">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group glow-primary">
                  View Portfolio
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-border/50 hover:bg-muted/50 font-semibold px-8 py-6 text-lg">
                  Get In Touch
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-24 relative">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              What I <span className="text-gradient">Build</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From concept to deployment, I create digital experiences that matter
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.label}
                variants={item}
                className="glass-card p-6 text-center group hover:border-primary/50 transition-all duration-300 cursor-default"
              >
                <skill.icon className={`w-10 h-10 mx-auto mb-3 ${skill.color} group-hover:scale-110 transition-transform`} />
                <span className="font-medium">{skill.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto glow-secondary relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Explore templates, plugins, and digital products to accelerate your development
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/templates">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8">
                    Browse Templates
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline" className="border-border/50 hover:bg-muted/50 font-semibold px-8">
                    Visit Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
