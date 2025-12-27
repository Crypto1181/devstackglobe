import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter, CreditCard, HelpCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@devstackglobe.com' },
  { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', consultationType: 'general' });
  const [loading, setLoading] = useState(false);
  const [hasPaidConsultation, setHasPaidConsultation] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    checkConsultationPurchase();
  }, [user]);

  const checkConsultationPurchase = async () => {
    if (!user) {
      setHasPaidConsultation(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('consultation_purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .limit(1);

      if (error) {
        console.error('Error checking consultation purchase:', error);
        setHasPaidConsultation(false);
        return;
      }

      setHasPaidConsultation(data && data.length > 0);
    } catch (error) {
      console.error('Error checking consultation purchase:', error);
      setHasPaidConsultation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to book a consultation.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Add consultation to cart
    addToCart({
      id: `consultation-${Date.now()}`,
      name: `Consultation - ${formData.consultationType === 'product' ? 'Product Support' : 'General'}`,
      price: 25,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      type: 'consultation',
    });

      toast({
      title: 'Consultation Added to Cart',
      description: 'Please proceed to checkout to complete your consultation booking.',
      });
    
    setFormData({ name: '', email: '', subject: '', message: '', consultationType: 'general' });
    setLoading(false);
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
            Book a <span className="text-gradient">Consultation</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Get expert guidance on your project or product support. Consultation fee: <span className="text-primary font-semibold">$25</span>
          </p>
        </motion.div>

        <div className={`grid ${hasPaidConsultation ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-12 max-w-6xl mx-auto`}>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`glass-card p-8 ${hasPaidConsultation ? '' : 'lg:col-span-1'}`}
          >
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Consultation Fee: $25</h3>
                  <p className="text-sm text-muted-foreground">
                    Payment is required to book a consultation. This includes project guidance, technical advice, and product support.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold mb-6">Book Your Consultation</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Consultation Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, consultationType: 'general' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.consultationType === 'general'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <HelpCircle className={`w-6 h-6 mx-auto mb-2 ${formData.consultationType === 'general' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="font-medium text-sm">General Consultation</p>
                    <p className="text-xs text-muted-foreground mt-1">Project guidance & advice</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, consultationType: 'product' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.consultationType === 'product'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <ShoppingBag className={`w-6 h-6 mx-auto mb-2 ${formData.consultationType === 'product' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="font-medium text-sm">Product Support</p>
                    <p className="text-xs text-muted-foreground mt-1">Help with purchased items</p>
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-muted/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-muted/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder={formData.consultationType === 'product' ? 'Product Support Request' : 'Project Inquiry'}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder={formData.consultationType === 'product' ? 'Tell us about the product you purchased and what help you need...' : 'Tell me about your project and what guidance you need...'}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-muted/50 border-border/50 focus:border-primary resize-none"
                  required
                />
              </div>
              
              {!user && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    You need to be logged in to book a consultation.
                  </p>
                  <Link to="/login">
                    <Button type="button" variant="outline" className="w-full">
                      Login to Continue
                    </Button>
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !user}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
              >
                {loading ? 'Adding to Cart...' : (
                  <>
                    <CreditCard className="mr-2 w-4 h-4" />
                    Add Consultation to Cart ($25)
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You'll be redirected to checkout to complete payment
              </p>
            </form>
          </motion.div>

          {/* Contact Info - Only show after payment */}
          {hasPaidConsultation ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold mb-6">Contact Info</h2>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold mb-6">Follow Me</h2>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="p-4 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all group"
                      aria-label={link.label}
                    >
                      <link.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="glass-card p-8 glow-accent relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-bold mb-2">Why Book a Consultation?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Expert guidance on your project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Technical advice and best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Product support for purchased items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Personalized solutions for your needs</span>
                    </li>
                  </ul>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    Consultation Fee: $25
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold mb-4">Unlock Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  After you complete your consultation payment, you'll gain access to our direct contact information and social media links.
                </p>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Complete your consultation booking to unlock:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Direct email contact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Phone number</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Social media links</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="glass-card p-8 glow-accent relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-bold mb-2">Why Book a Consultation?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Expert guidance on your project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Technical advice and best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Product support for purchased items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Personalized solutions for your needs</span>
                    </li>
                  </ul>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    Consultation Fee: $25
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
