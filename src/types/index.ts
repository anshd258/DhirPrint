export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: 'Flex Banner' | 'Acrylic Sign' | 'Neon Sign';
  description: string;
  materials: string[];
  sizes: string[];
  basePrice: number;
  pricingRules?: any; // Rules for material/size adjustments
  imageUrls: string[]; // URLs to product images
  defaultImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string; // Usually productId + customization hash
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  material: string;
  customizationDetails: {
    designUrl?: string; // URL to uploaded or AI generated image
    overlayText?: string;
  };
  quantity: number;
  unitPrice: number; // Price per unit after customization
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  paymentMethod: 'stripe' | 'razorpay_upi' | string; // or other payment methods
  paymentIntentId?: string; // Stripe Payment Intent ID
  razorpayOrderId?: string; // Razorpay Order ID
  status: OrderStatus;
  trackingLink?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface AiImage {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string; // URL to image in Firebase Storage
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesReport {
  id: string;
  generatedAt: Date;
  criteria: string;
  reportDataUrl: string; // URL to the report file/data
  summary: string;
}
