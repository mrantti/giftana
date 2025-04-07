
export interface Product {
  id: string;
  title: string;
  price: string;
  image?: string;
  description: string;
  link: string;
  platform: 'amazon' | 'etsy';
}
