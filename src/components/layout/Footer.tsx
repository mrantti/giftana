
import React from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto py-8 bg-giftana-cream">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Gift className="h-5 w-5 text-giftana-teal mr-2" />
            <span className="font-serif font-medium">Giftana</span>
            <span className="text-xs ml-2 text-muted-foreground">Thoughtful, made simple.</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center">
              <span className="text-xs">
                As an Amazon Associate / Etsy Affiliate, we may earn from qualifying purchases.
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Giftana. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
