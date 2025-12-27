import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, Smartphone, Globe, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
  id: string;
  type: string;
  name: string;
  description: string;
  programming_language: string;
  live_demo_url?: string;
  image?: string;
  icon?: typeof Smartphone;
  color?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const iconMap: Record<string, typeof Smartphone> = {
  'Mobile App': Smartphone,
  'Web Application': Globe,
  'Backend System': Database,
  'default': Globe,
};

const colorMap: Record<string, string> = {
  'Mobile App': 'primary',
  'Web Application': 'secondary',
  'Backend System': 'accent',
  'default': 'primary',
};

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading portfolios:', error);
      } else {
        // Transform data to match component structure
        const transformed = (data || []).map((item) => ({
          ...item,
          title: item.name,
          category: item.type,
          technologies: item.programming_language.split(',').map(t => t.trim()),
          icon: iconMap[item.type] || iconMap['default'] || Globe,
          color: colorMap[item.type] || colorMap['default'] || 'primary',
          image: item.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        }));
        setPortfolioItems(transformed);
      }
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A collection of projects I've built, from mobile apps to full-stack web applications
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading portfolios...</div>
          </div>
        ) : portfolioItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No portfolio items yet. Check back soon!</div>
          </div>
        ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioItems.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedProject(project)}
              className="glass-card overflow-hidden cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className={`absolute top-4 left-4 p-2 rounded-lg bg-${project.color}/20 backdrop-blur-sm`}>
                  <project.icon className={`w-5 h-5 text-${project.color}`} />
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">{project.category}</span>
                <h3 className="font-display text-xl font-bold mt-2 mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h2 className="font-display text-3xl font-bold mt-2 mb-4">{selectedProject.title}</h2>
                <p className="text-muted-foreground mb-6">{selectedProject.description}</p>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  {selectedProject.live_demo_url && (
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => window.open(selectedProject.live_demo_url, '_blank')}
                    >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  )}
                  <Button variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
