
import { useCallback } from 'react';
import { Product } from '@/types/product';
import { affiliateService } from '@/services/affiliateService';

export function useProductTracking() {
  const trackProductClick = useCallback((product: Product) => {
    affiliateService.trackProductClick(product);
  }, []);

  return { trackProductClick };
}
