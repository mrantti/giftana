// This is a mock API service simulating a real backend infrastructure
// In a production environment, this would connect to actual microservices

import { Product } from '@/components/chat/ProductSuggestion';

// Simulated latency for different API endpoints
const API_LATENCY = {
  products: () => 300 + Math.random() * 700, // 300-1000ms
  email: () => 200 + Math.random() * 300,    // 200-500ms
  recommendations: () => 500 + Math.random() * 1500 // 500-2000ms
};

// Simulated service health status
const SERVICE_HEALTH = {
  products: true,
  email: true,
  recommendations: true,
  database: true
};

// Mock product database
const productDatabase: Record<string, Product[]> = {
  gardening: [
    {
      id: '1',
      title: 'Premium Gardening Tool Set',
      price: '$42.99',
      image: 'https://images.unsplash.com/photo-1591902916941-fb53ebe3d578?q=80&w=500&auto=format&fit=crop',
      description: 'This ergonomic garden tool set includes pruners, trowel, rake, and cultivator - perfect for the gardening enthusiast!',
      link: 'https://amazon.com/product/1?tag=giftwise-20',
      platform: 'amazon'
    },
    {
      id: '2',
      title: 'Personalized Plant Journal',
      price: '$24.50',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
      description: 'A beautiful handcrafted journal to track garden growth, plant care, and seasonal changes.',
      link: 'https://etsy.com/product/2?tag=giftwise-20',
      platform: 'etsy'
    },
    {
      id: '3',
      title: 'Indoor Herb Garden Kit',
      price: '$38.95',
      image: 'https://images.unsplash.com/photo-1522448746354-da4936934201?q=80&w=500&auto=format&fit=crop',
      description: 'Self-watering indoor garden kit with basil, mint, and cilantro seeds. Includes LED grow lights.',
      link: 'https://amazon.com/product/3?tag=giftwise-20',
      platform: 'amazon'
    }
  ],
  tech: [
    {
      id: '4',
      title: 'Wireless Earbuds with Noise Cancellation',
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500&auto=format&fit=crop',
      description: 'High-quality wireless earbuds with active noise cancellation and 30-hour battery life.',
      link: 'https://amazon.com/product/4?tag=giftwise-20',
      platform: 'amazon'
    },
    {
      id: '5',
      title: 'Smart Home Starter Kit',
      price: '$129.95',
      image: 'https://images.unsplash.com/photo-1558002038-1055e2fff2ce?q=80&w=500&auto=format&fit=crop',
      description: 'Everything needed to start a smart home: hub, smart bulbs, and motion sensors.',
      link: 'https://amazon.com/product/5?tag=giftwise-20',
      platform: 'amazon'
    },
    {
      id: '6',
      title: 'Handcrafted Wooden Phone Stand',
      price: '$34.00',
      image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=500&auto=format&fit=crop',
      description: 'Beautifully crafted wooden phone stand, perfect for desk or nightstand.',
      link: 'https://etsy.com/product/6?tag=giftwise-20',
      platform: 'etsy'
    }
  ],
  cooking: [
    {
      id: '7',
      title: 'Professional Chef Knife Set',
      price: '$89.95',
      image: 'https://images.unsplash.com/photo-1566454419290-57a0589c9b17?q=80&w=500&auto=format&fit=crop',
      description: '8-piece premium knife set with wooden block. High-carbon stainless steel blades.',
      link: 'https://amazon.com/product/7?tag=giftwise-20',
      platform: 'amazon'
    },
    {
      id: '8',
      title: 'Personalized Recipe Book',
      price: '$28.50',
      image: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?q=80&w=500&auto=format&fit=crop',
      description: 'Custom recipe book with personalized cover and pages for favorite family recipes.',
      link: 'https://etsy.com/product/8?tag=giftwise-20',
      platform: 'etsy'
    }
  ]
};

// API functions with simulated infrastructure behavior
export const api = {
  // Simulate a health check endpoint
  healthCheck: async (): Promise<{status: string, services: Record<string, boolean>}> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      status: Object.values(SERVICE_HEALTH).every(status => status) ? 'healthy' : 'degraded',
      services: SERVICE_HEALTH
    };
  },
  
  // Get gift suggestions based on interests and budget
  getGiftSuggestions: async (interests: string[], budget?: number): Promise<Product[]> => {
    // Simulate backend service latency
    await new Promise(resolve => setTimeout(resolve, API_LATENCY.recommendations()));
    
    // Log analytics data - in production this would go to a real analytics service
    console.log(`[ANALYTICS] Gift suggestion request: interests=${interests.join(',')}, budget=${budget}`);
    
    // Get products matching interests
    let matchingProducts: Product[] = [];
    
    interests.forEach(interest => {
      const key = interest.toLowerCase();
      if (productDatabase[key]) {
        matchingProducts = [...matchingProducts, ...productDatabase[key]];
      }
    });
    
    // If no matches found, return some default products
    if (matchingProducts.length === 0) {
      console.log('[ERROR] No matching products found, falling back to defaults');
      const allProducts = Object.values(productDatabase).flat();
      matchingProducts = allProducts.slice(0, 3);
    }
    
    // Filter by budget if provided
    if (budget) {
      matchingProducts = matchingProducts.filter(product => {
        const price = parseFloat(product.price.replace('$', ''));
        return price <= budget;
      });
    }
    
    // Cache the results (simulated)
    console.log(`[CACHE] Storing results for interests=${interests.join(',')}, budget=${budget}`);
    
    // Return top 3 products
    return matchingProducts.slice(0, 3);
  },
  
  // Send email reminder
  sendEmailReminder: async (email: string, eventName: string, date: Date): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, API_LATENCY.email()));
    
    // Simulate sending through an email service with proper logging
    console.log(`[EMAIL_SERVICE] Reminder scheduled for ${email}: ${eventName} on ${date.toLocaleDateString()}`);
    
    // Simulate rate limiting and throttling
    if (Math.random() > 0.95) {
      console.log('[RATE_LIMIT] Email sending throttled');
      throw new Error('Rate limit exceeded for email service');
    }
    
    // Always return success in this mock implementation
    return true;
  },
  
  // Track user interaction (simulated analytics endpoint)
  trackInteraction: async (userId: string, action: string, metadata: Record<string, any>): Promise<void> => {
    // In a real implementation, this would send to an analytics service
    console.log(`[ANALYTICS] User ${userId} performed ${action}`, metadata);
    return Promise.resolve();
  }
};
