import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone, Facebook, Instagram, Music, Send } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';

const navLinks = [
  { path: '/home', label: 'Home' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/templates', label: 'Templates' },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/contact', label: 'Contact' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#', color: '#ffffff' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', color: '#0A66C2' },
  { icon: Twitter, label: 'Twitter', href: '#', color: '#1DA1F2' },
  { icon: Facebook, label: 'Facebook', href: '#', color: '#0866FF' },
  { icon: Instagram, label: 'Instagram', href: '#', color: '#E4405F', gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
  { icon: Music, label: 'TikTok', href: '#', color: '#FE2C55' },
  { icon: Send, label: 'Telegram', href: '#', color: '#229ED9' },
];

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@devstackglobe.com' },
  { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/home">
              <AnimatedLogo showText={true} />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Full-stack development services, premium templates, and digital products to accelerate your development journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-display font-bold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`p-3 rounded-lg transition-all group ${
                    link.label === 'Instagram' && link.gradient
                      ? 'bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] hover:opacity-90'
                      : link.label === 'GitHub'
                      ? 'bg-[#181717] hover:bg-[#24292e]'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  aria-label={link.label}
                >
                  {link.label === 'Instagram' && link.gradient ? (
                    <link.icon 
                      className="w-5 h-5 transition-transform group-hover:scale-110 text-white" 
                    />
                  ) : link.label === 'GitHub' ? (
                    <link.icon 
                      className="w-5 h-5 transition-transform group-hover:scale-110 text-white" 
                    />
                  ) : (
                    <link.icon 
                      className="w-5 h-5 transition-transform group-hover:scale-110" 
                      style={{ color: link.color }}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevStackGlobe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

