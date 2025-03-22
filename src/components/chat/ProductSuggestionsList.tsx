
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductSuggestion, { Product } from './ProductSuggestion';

// Mock product data
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Gardening Tool Set',
    price: '$42.99',
    image: 'https://images.unsplash.com/photo-1591902916941-fb53ebe3d578?q=80&w=500&auto=format&fit=crop',
    description: 'This ergonomic garden tool set includes pruners, trowel, rake, and cultivator - perfect for the gardening enthusiast!',
    link: 'https://amazon.com',
    platform: 'amazon'
  },
  {
    id: '2',
    title: 'Personalized Plant Journal',
    price: '$24.50',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
    description: 'A beautiful handcrafted journal to track garden growth, plant care, and seasonal changes.',
    link: 'https://etsy.com',
    platform: 'etsy'
  },
  {
    id: '3',
    title: 'Indoor Herb Garden Kit',
    price: '$38.95',
    image: 'https://images.unsplash.com/photo-1522448746354-da4936934201?q=80&w=500&auto=format&fit=crop',
    description: 'Self-watering indoor garden kit with basil, mint, and cilantro seeds. Includes LED grow lights.',
    link: 'https://amazon.com',
    platform: 'amazon'
  }
];

interface ProductSuggestionsListProps {
  products?: Product[];
}

const ProductSuggestionsList: React.FC<ProductSuggestionsListProps> = ({ 
  products = mockProducts 
}) => {
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
