
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Calendar, MessageCircle, User, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <Gift className="h-4 w-4" /> },
    { to: '/chat', label: 'Gift Chat', icon: <MessageCircle className="h-4 w-4" /> },
    { to: '/events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    { to: '/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      } transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Gift className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl tracking-tight">PerfectGiftAI</span>
        </Link>
        
        {isMobile ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {isMenuOpen && (
              <motion.div 
                className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md p-4 border-t"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <nav className="flex flex-col space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
                        isActive(link.to)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </>
        ) : (
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-secondary'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </motion.header>
  );
};

export default NavBar;
