
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Gift } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';

interface ProductSuggestionProps {
  product: Product;
  index: number;
  onClick?: () => void;
}

const ProductSuggestion: React.FC<ProductSuggestionProps> = ({ product, index, onClick }) => {
  const handleClick = () => {
    // Track click event if callback provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="product-card overflow-hidden border border-border/50 h-full">
        <div className="relative pt-[56.25%] bg-secondary">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="font-medium">
              {product.platform === 'amazon' ? 'Amazon' : 'Etsy'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium text-base mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{product.description}</p>
          <p className="font-semibold">{product.price}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            asChild 
            className="w-full gap-2 group" 
            variant="outline"
            onClick={handleClick}
          >
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              View on {product.platform === 'amazon' ? 'Amazon' : 'Etsy'}
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductSuggestion;
