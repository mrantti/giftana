import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock product database for fallback
const mockProducts = [
  {
    id: 'book-1',
    title: 'Bestseller Book Box Set',
    price: '$49.99',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop',
    description: "Collection of this year's most acclaimed novels, beautifully boxed.",
    link: 'https://amazon.com/product/book-1',
    platform: 'amazon'
  },
  {
    id: 'tech-1',
    title: 'Premium Wireless Headphones',
    price: '$79.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
    description: 'High-quality noise cancelling headphones with premium sound.',
    link: 'https://amazon.com/product/tech-1',
    platform: 'amazon'
  },
  {
    id: 'craft-1',
    title: 'Handmade Leather Journal',
    price: '$35.00',
    image: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?q=80&w=500&auto=format&fit=crop',
    description: 'Artisan crafted leather-bound journal with handmade paper.',
    link: 'https://etsy.com/product/craft-1',
    platform: 'etsy'
  },
  {
    id: 'home-1',
    title: 'Ambient Smart Lighting Kit',
    price: '$120.00',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=500&auto=format&fit=crop',
    description: 'Smart home lighting system with voice control and app integration.',
    link: 'https://amazon.com/product/home-1',
    platform: 'amazon'
  },
  {
    id: 'beauty-1',
    title: 'Luxury Skincare Gift Set',
    price: '$65.00',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4a86c4e?q=80&w=500&auto=format&fit=crop',
    description: 'Collection of premium organic skincare products in gift packaging.',
    link: 'https://amazon.com/product/beauty-1',
    platform: 'amazon'
  },
  {
    id: 'food-1',
    title: 'Gourmet Chocolate Collection',
    price: '$42.50',
    image: 'https://images.unsplash.com/photo-1549007994-cb8bed85db9c?q=80&w=500&auto=format&fit=crop',
    description: 'Handcrafted artisan chocolates from around the world.',
    link: 'https://amazon.com/product/food-1',
    platform: 'amazon'
  }
];

// Amazon API integration (mock implementation for now)
async function searchAmazonProducts(keywords: string[], priceRange?: string): Promise<any[]> {
  console.log("Searching Amazon for:", keywords, "Price range:", priceRange);
  
  // This is where you would implement the actual Amazon Product API call
  // For now, we'll filter our mock products based on keywords
  
  // Simple keyword matching against product title and description
  const matchingProducts = mockProducts.filter(product => {
    return keywords.some(keyword => 
      product.title.toLowerCase().includes(keyword.toLowerCase()) || 
      product.description.toLowerCase().includes(keyword.toLowerCase())
    );
  });
  
  // If we found products with the keywords, return them
  if (matchingProducts.length > 0) {
    return matchingProducts;
  }
  
  // Otherwise return a subset of mock products
  return mockProducts.slice(0, 3);
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { interests, priceRange, keywords, giftCategory, useAmazonApi } = await req.json();
    
    console.log("Received request for recommendations:", { 
      interests, priceRange, keywords, giftCategory, useAmazonApi 
    });
    
    let products = [];
    
    // Try to use Amazon API if requested
    if (useAmazonApi) {
      try {
        const searchTerms = [
          ...(interests || []),
          ...(keywords || []),
          giftCategory || 'gift'
        ];
        
        products = await searchAmazonProducts(searchTerms, priceRange);
        console.log(`Found ${products.length} products from Amazon API`);
      } catch (apiError) {
        console.error("Error with Amazon API:", apiError);
        // Fall back to mock data
        products = mockProducts;
      }
    } else {
      // Use mock data if Amazon API not requested
      products = mockProducts;
    }
    
    // Filter by price range if provided
    if (priceRange && products.length > 0) {
      // Simple filtering logic based on mock data - would be handled by the API in production
      products = products.sort((a, b) => {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        return priceA - priceB;
      });
      
      // Limit products to 6 for a nice grid display
      products = products.slice(0, 6);
    }
    
    return new Response(
      JSON.stringify({ 
        products,
        message: "Recommendations retrieved successfully" 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  } catch (error) {
    console.error("Error in get-recommendations function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        products: mockProducts.slice(0, 3) // Return some products even on error
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
