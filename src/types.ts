export interface Product {
  id: number;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  badgeType?: 'best-seller' | 'new' | 'trending' | 'limited';
  category: 'casual' | 'printed' | 'solid' | 'check' | 'tropical' | 'floral' | 'linen' | 'oversized';
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  fabric: string;
  fit: string;
  care: string;
  deliveryEstimate: string;
  returnsPolicy: string;
  description: string;
  features: string[];
  modelInfo?: string;
  texturePattern?: 'botanical' | 'navy' | 'tropical' | 'black' | 'floral' | 'check' | 'linen' | 'oxford';
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface Review {
  id: number;
  author: string;
  avatarLetter: string;
  rating: number;
  verified: boolean;
  date: string;
  title: string;
  comment: string;
  productName: string;
  helpfulCount: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  pinCode: string;
  addressType: 'home' | 'office' | 'other';
  instructions?: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
