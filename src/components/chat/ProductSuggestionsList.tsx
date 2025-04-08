
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductSuggestion from './ProductSuggestion';
import { Product } from '@/types/product';

interface ProductSuggestionsListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductSuggestionsList: React.FC<ProductSuggestionsListProps> = ({ 
  products, 
  onProductClick 
}) => {
  // Handle product click
  const handleProductClick = (product: Product) => {
    onProductClick(product);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {products.map((product, index) => (
          <ProductSuggestion 
            key={product.id} 
            product={product} 
            index={index}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button variant="secondary" className="shadow-sm">
          Show More Ideas
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductSuggestionsList;
