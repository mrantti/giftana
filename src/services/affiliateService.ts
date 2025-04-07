
import { Product } from '@/types/product';

// Affiliate tracking configuration
interface AffiliateConfig {
  trackingIds: {
    amazon: string;
    etsy: string;
  };
  endpoints: {
    impression: string;
    click: string;
    conversion: string;
  };
}

// Default configuration - should be replaced with real partner IDs
const DEFAULT_CONFIG: AffiliateConfig = {
  trackingIds: {
    amazon: 'giftwise-20', // Amazon Associates ID
    etsy: 'giftwise-20',   // Etsy Affiliate ID
  },
  endpoints: {
    impression: 'https://api.example.com/track/impression',
    click: 'https://api.example.com/track/click',
    conversion: 'https://api.example.com/track/conversion',
  }
};

// Track clicks on affiliate links
class AffiliateService {
  private config: AffiliateConfig;
  private sessionId: string;
  
  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    
    // Load configuration from localStorage if available
    this.loadConfig();
  }
  
  // Update affiliate configuration
  setConfig(newConfig: Partial<AffiliateConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      trackingIds: {
        ...this.config.trackingIds,
        ...(newConfig.trackingIds || {})
      },
      endpoints: {
        ...this.config.endpoints,
        ...(newConfig.endpoints || {})
      }
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('perfectgift_affiliate_config', JSON.stringify(this.config));
  }
  
  // Get the current configuration
  getConfig(): AffiliateConfig {
    return { ...this.config };
  }
  
  // Load configuration from localStorage
  private loadConfig(): void {
    const storedConfig = localStorage.getItem('perfectgift_affiliate_config');
    if (storedConfig) {
      try {
        this.config = JSON.parse(storedConfig);
      } catch (error) {
        console.error('Error loading affiliate configuration:', error);
      }
    }
  }
  
  // Generate a product URL with affiliate parameters
  generateAffiliateUrl(product: Product): string {
    const url = new URL(product.link);
    const trackingId = product.platform === 'amazon' 
      ? this.config.trackingIds.amazon 
      : this.config.trackingIds.etsy;
    
    // Add tracking parameters based on platform
    if (product.platform === 'amazon') {
      url.searchParams.set('tag', trackingId);
    } else if (product.platform === 'etsy') {
      url.searchParams.set('utm_source', 'giftwise');
      url.searchParams.set('utm_medium', 'affiliate');
      url.searchParams.set('utm_campaign', trackingId);
    }
    
    return url.toString();
  }
  
  // Track a click on an affiliate product
  trackProductClick(product: Product): void {
    // Generate affiliate URL
    const affiliateUrl = this.generateAffiliateUrl(product);
    
    // In a real implementation, this would send analytics data to a backend service
    console.log(`[AFFILIATE] Click tracked for product: ${product.id} (${product.title})`);
    console.log(`[AFFILIATE] Affiliate URL: ${affiliateUrl}`);
    
    // Collect analytics data about the product interaction
    const analyticsData = {
      productId: product.id,
      platform: product.platform,
      price: product.price,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      url: affiliateUrl
    };
    
    // Send the analytics data to a tracking endpoint (simulated here)
    this.sendAnalyticsEvent('product_click', analyticsData);
    
    // Store click in localStorage for attribution window
    this.storeClick(product);
  }
  
  // Track impression of product recommendations
  trackProductImpression(products: Product[]): void {
    // Log all product impressions for analytics
    console.log(`[AFFILIATE] Impression tracked for ${products.length} products`);
    
    // In a real implementation, this would batch send impressions data
    products.forEach(product => {
      const affiliateUrl = this.generateAffiliateUrl(product);
      
      this.sendAnalyticsEvent('product_impression', {
        productId: product.id,
        platform: product.platform,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        url: affiliateUrl
      });
    });
    
    // Store impressions in localStorage
    this.storeImpressions(products);
  }
  
  // Track conversion (if available through affiliate webhook)
  trackConversion(transactionId: string, productId: string, value: number): void {
    console.log(`[AFFILIATE] Conversion tracked: ${transactionId} for product ${productId}`);
    
    this.sendAnalyticsEvent('conversion', {
      transactionId,
      productId,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    });
  }
  
  // Store product impressions in localStorage (for attribution)
  private storeImpressions(products: Product[]): void {
    try {
      const now = new Date().toISOString();
      const impressionsData = products.map(product => ({
        productId: product.id,
        timestamp: now
      }));
      
      localStorage.setItem('perfectgift_product_impressions', JSON.stringify(impressionsData));
    } catch (error) {
      console.error('Error storing product impressions:', error);
    }
  }
  
  // Store product click in localStorage (for attribution)
  private storeClick(product: Product): void {
    try {
      const clickData = {
        productId: product.id,
        platform: product.platform,
        price: product.price,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('perfectgift_last_click', JSON.stringify(clickData));
    } catch (error) {
      console.error('Error storing product click:', error);
    }
  }
  
  // Generate a unique session ID
  private generateSessionId(): string {
    const storedSessionId = localStorage.getItem('perfectgift_session_id');
    if (storedSessionId) return storedSessionId;
    
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('perfectgift_session_id', newSessionId);
    return newSessionId;
  }
  
  // Send analytics event to backend (simulated)
  private sendAnalyticsEvent(eventName: string, data: any): void {
    // In a real implementation, this would send to a backend analytics service
    // For now, we'll just log to console to simulate the network call
    console.log(`[ANALYTICS EVENT] ${eventName}`, data);
  }
}

// Export as singleton
export const affiliateService = new AffiliateService();
