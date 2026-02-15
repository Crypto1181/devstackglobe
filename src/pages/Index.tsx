import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Globe, ArrowRight, Sparkles, Smartphone, Gamepad2, Bitcoin, Monitor, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import Footer from '@/components/Footer';

interface Review {
  reviewer_name: string;
  review_text: string;
  rating: number;
  company?: string;
  role?: string;
}

const reviews: Review[] = [
  {
    reviewer_name: 'Sarah Johnson',
    review_text: 'DevStackGlobe transformed our business with their exceptional web development services. The team is professional, responsive, and delivers beyond expectations.',
    rating: 5,
    company: 'TechStart Inc.',
    role: 'CEO'
  },
  {
    reviewer_name: 'Michael Chen',
    review_text: 'The templates we purchased saved us months of development time. High-quality code, excellent documentation, and great support. Highly recommended!',
    rating: 5,
    company: 'Digital Solutions',
    role: 'CTO'
  },
  {
    reviewer_name: 'Emily Rodriguez',
    review_text: 'Outstanding mobile app development services. They understood our vision and brought it to life with a beautiful, functional app that our users love.',
    rating: 5,
    company: 'AppVenture',
    role: 'Product Manager'
  },
  {
    reviewer_name: 'David Thompson',
    review_text: 'Working with DevStackGlobe was a game-changer. Their blockchain expertise helped us launch our Web3 platform successfully. Professional and knowledgeable team.',
    rating: 5,
    company: 'CryptoVault',
    role: 'Founder'
  },
  {
    reviewer_name: 'Lisa Anderson',
    review_text: 'The marketplace products are top-notch. We\'ve purchased multiple items and each one exceeded our expectations. Great value for money!',
    rating: 5,
    company: 'InnovateLab',
    role: 'Lead Developer'
  }
];

export default function Index() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Auto-swipe reviews every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrevious = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

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
            className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Bringing{' '}
            <span className="text-gradient">innovative ideas</span>{' '}
            to reality
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed px-2"
          >
            36+ full-stack experts delivering production-ready products in under 30 days. Proven across industries with reliable, on-time results. Let&apos;s build your next project.
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

      {/* Reviews Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Trusted by developers and businesses worldwide
            </p>
          </motion.div>

          <div className="relative">
            {/* Review Carousel */}
            <div className="relative overflow-hidden rounded-2xl">
              <motion.div
                key={currentReviewIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 md:p-12"
              >
                <div className="flex items-center justify-center mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= reviews[currentReviewIndex].rating
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center mb-6 leading-relaxed px-2">
                  "{reviews[currentReviewIndex].review_text}"
                </blockquote>

                <div className="text-center">
                  <p className="font-semibold text-base sm:text-lg mb-1">
                    {reviews[currentReviewIndex].reviewer_name}
                  </p>
                  {(reviews[currentReviewIndex].company || reviews[currentReviewIndex].role) && (
                    <p className="text-muted-foreground">
                      {reviews[currentReviewIndex].role}
                      {reviews[currentReviewIndex].role && reviews[currentReviewIndex].company && ', '}
                      {reviews[currentReviewIndex].company}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 md:w-12 md:h-12 rounded-full glass-card border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110 z-10"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 md:w-12 md:h-12 rounded-full glass-card border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110 z-10"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentReviewIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
