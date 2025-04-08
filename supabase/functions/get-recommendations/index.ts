
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock product database organized by interest categories
const productDatabase: Record<string, Product[]> = {
  technology: [
    {
      id: 'tech-1',
      title: 'Wireless Noise-Cancelling Headphones',
      price: '$149.99',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
      description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
      link: 'https://amazon.com/product/tech-1',
      platform: 'amazon'
    },
    {
      id: 'tech-2',
      title: 'Smart Home Starter Kit',
      price: '$129.95',
      image: 'https://images.unsplash.com/photo-1558002038-1055e2fff2ce?q=80&w=500&auto=format&fit=crop',
      description: 'Complete smart home solution with hub, smart bulbs, and motion sensors for automated comfort.',
      link: 'https://amazon.com/product/tech-2',
      platform: 'amazon'
    },
    {
      id: 'tech-3',
      title: 'Portable Bluetooth Speaker',
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=500&auto=format&fit=crop',
      description: 'Waterproof, durable Bluetooth speaker with 16-hour battery life and rich bass sound.',
      link: 'https://amazon.com/product/tech-3',
      platform: 'amazon'
    }
  ],
  cooking: [
    {
      id: 'cook-1',
      title: 'Professional Chef Knife Set',
      price: '$89.95',
      image: 'https://images.unsplash.com/photo-1566454419290-57a0589c9b17?q=80&w=500&auto=format&fit=crop',
      description: '8-piece premium knife set with wooden block. High-carbon stainless steel blades.',
      link: 'https://amazon.com/product/cook-1',
      platform: 'amazon'
    },
    {
      id: 'cook-2',
      title: 'Cast Iron Dutch Oven',
      price: '$69.99',
      image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?q=80&w=500&auto=format&fit=crop',
      description: '6-quart enameled cast iron dutch oven, perfect for slow cooking, roasting, and baking.',
      link: 'https://amazon.com/product/cook-2',
      platform: 'amazon'
    },
    {
      id: 'cook-3',
      title: 'Personalized Recipe Book',
      price: '$32.50',
      image: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?q=80&w=500&auto=format&fit=crop',
      description: 'Custom recipe book with personalized cover and pages for favorite family recipes.',
      link: 'https://etsy.com/product/cook-3',
      platform: 'etsy'
    }
  ],
  gardening: [
    {
      id: 'garden-1',
      title: 'Premium Gardening Tool Set',
      price: '$42.99',
      image: 'https://images.unsplash.com/photo-1591902916941-fb53ebe3d578?q=80&w=500&auto=format&fit=crop',
      description: 'This ergonomic garden tool set includes pruners, trowel, rake, and cultivator.',
      link: 'https://amazon.com/product/garden-1',
      platform: 'amazon'
    },
    {
      id: 'garden-2',
      title: 'Indoor Herb Garden Kit',
      price: '$38.95',
      image: 'https://images.unsplash.com/photo-1522448746354-da4936934201?q=80&w=500&auto=format&fit=crop',
      description: 'Self-watering indoor garden kit with basil, mint, and cilantro seeds. Includes LED grow lights.',
      link: 'https://amazon.com/product/garden-2',
      platform: 'amazon'
    },
    {
      id: 'garden-3',
      title: 'Personalized Plant Journal',
      price: '$24.50',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
      description: 'Beautiful handcrafted journal to track garden growth, plant care, and seasonal changes.',
      link: 'https://etsy.com/product/garden-3',
      platform: 'etsy'
    }
  ],
  art: [
    {
      id: 'art-1',
      title: 'Professional Drawing Set',
      price: '$54.99',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=500&auto=format&fit=crop',
      description: 'Complete art set with pencils, charcoal, and sketch pad for artists of all levels.',
      link: 'https://amazon.com/product/art-1',
      platform: 'amazon'
    },
    {
      id: 'art-2',
      title: 'Custom Portrait Commission',
      price: '$85.00',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=500&auto=format&fit=crop',
      description: 'Personalized portrait created by a professional artist from your photo.',
      link: 'https://etsy.com/product/art-2',
      platform: 'etsy'
    }
  ],
  books: [
    {
      id: 'book-1',
      title: 'Bestseller Book Box Set',
      price: '$49.99',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop',
      description: 'Collection of this year's most acclaimed novels, beautifully boxed.',
      link: 'https://amazon.com/product/book-1',
      platform: 'amazon'
    },
    {
      id: 'book-2',
      title: 'Personalized Bookmarks Set',
      price: '$22.50',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
      description: 'Set of 5 handcrafted leather bookmarks with custom engraving.',
      link: 'https://etsy.com/product/book-2',
      platform: 'etsy'
    }
  ],
  fitness: [
    {
      id: 'fitness-1',
      title: 'Smart Fitness Tracker',
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63eaa?q=80&w=500&auto=format&fit=crop',
      description: 'Advanced fitness tracker with heart rate monitoring, sleep tracking, and smartphone notifications.',
      link: 'https://amazon.com/product/fitness-1',
      platform: 'amazon'
    },
    {
      id: 'fitness-2',
      title: 'Premium Yoga Mat',
      price: '$45.99',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=500&auto=format&fit=crop',
      description: 'Eco-friendly, non-slip yoga mat with alignment markings and carrying strap.',
      link: 'https://amazon.com/product/fitness-2',
      platform: 'amazon'
    }
  ],
  general: [
    {
      id: 'general-1',
      title: 'Scented Candle Gift Set',
      price: '$34.99',
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop',
      description: 'Luxury set of 4 hand-poured soy candles in seasonal scents, beautifully packaged.',
      link: 'https://amazon.com/product/general-1',
      platform: 'amazon'
    },
    {
      id: 'general-2',
      title: 'Personalized Photo Frame',
      price: '$29.99',
      image: 'https://images.unsplash.com/photo-1595274459742-4ec73744175a?q=80&w=500&auto=format&fit=crop',
      description: 'Custom engraved wooden frame with your choice of message and design.',
      link: 'https://etsy.com/product/general-2',
      platform: 'etsy'
    },
    {
      id: 'general-3',
      title: 'Gourmet Chocolate Box',
      price: '$39.95',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=500&auto=format&fit=crop',
      description: 'Assortment of 24 handcrafted artisan chocolates in an elegant gift box.',
      link: 'https://amazon.com/product/general-3',
      platform: 'amazon'
    }
  ]
};

// Types for our recommendation system
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  link: string;
  platform: 'amazon' | 'etsy';
}

interface RecommendationRequest {
  interests: string[];
  priceRange?: string;
  keywords?: string[];
  giftCategory?: string;
  occasionContext?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interests, priceRange, keywords, giftCategory } = await req.json() as RecommendationRequest;
    
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one interest is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Finding recommendations for:", { interests, priceRange, keywords, giftCategory });
    
    // Get product recommendations based on interests and other parameters
    const recommendations = findRecommendations(interests, priceRange, keywords);
    
    return new Response(
      JSON.stringify({ products: recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in get-recommendations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function findRecommendations(
  interests: string[], 
  priceRange?: string, 
  keywords?: string[]
): Product[] {
  let allProducts: Product[] = [];
  
  // Map user interests to our product categories
  const categoryMap: Record<string, string[]> = {
    'tech': ['technology', 'electronics', 'gadgets', 'computers', 'phones'],
    'cooking': ['cooking', 'baking', 'kitchen', 'culinary', 'food'],
    'gardening': ['gardening', 'plants', 'outdoor', 'flowers', 'herbs'],
    'art': ['art', 'painting', 'drawing', 'crafts', 'creative'],
    'books': ['books', 'reading', 'literature', 'writing', 'stories'],
    'fitness': ['fitness', 'exercise', 'workout', 'gym', 'sports']
  };
  
  // For each interest, find matching products
  for (const interest of interests) {
    const interestLower = interest.toLowerCase();
    
    // First check for direct category match
    if (productDatabase[interestLower]) {
      allProducts = [...allProducts, ...productDatabase[interestLower]];
      continue;
    }
    
    // Then check mapped categories
    let categoryFound = false;
    for (const [category, synonyms] of Object.entries(categoryMap)) {
      if (synonyms.some(synonym => interestLower.includes(synonym))) {
        if (productDatabase[category]) {
          allProducts = [...allProducts, ...productDatabase[category]];
          categoryFound = true;
          break;
        }
      }
    }
    
    // If no category match, add some general products
    if (!categoryFound) {
      allProducts = [...allProducts, ...productDatabase['general']];
    }
  }
  
  // Filter by price range if specified
  if (priceRange) {
    const priceFilters: Record<string, (price: string) => boolean> = {
      'low': (price) => parseFloat(price.replace('$', '')) <= 30,
      'medium': (price) => {
        const numPrice = parseFloat(price.replace('$', ''));
        return numPrice > 30 && numPrice <= 75;
      },
      'high': (price) => {
        const numPrice = parseFloat(price.replace('$', ''));
        return numPrice > 75 && numPrice <= 150;
      },
      'premium': (price) => parseFloat(price.replace('$', '')) > 150
    };
    
    if (priceFilters[priceRange]) {
      allProducts = allProducts.filter(product => priceFilters[priceRange](product.price));
    }
  }
  
  // Filter by keywords if specified
  if (keywords && keywords.length > 0) {
    allProducts = allProducts.filter(product => 
      keywords.some(keyword => 
        product.title.toLowerCase().includes(keyword.toLowerCase()) || 
        product.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
  
  // Remove duplicates by ID
  const uniqueProducts = allProducts.filter((product, index, self) =>
    index === self.findIndex(p => p.id === product.id)
  );
  
  // Return top 6 products or all if less than 6
  return uniqueProducts.slice(0, 6);
}
