
"use client";

import { useState, useEffect } from 'react';
import type { Order } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, ShoppingBag, ListOrdered, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

// Mock function to fetch user's orders. Replace with actual Firestore fetching.
async function getUserOrders(userId: string): Promise<Order[]> {
  // TODO: Replace with actual Firestore query:
  // const ordersCol = collection(db, 'orders');
  // const q = query(ordersCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  // const orderSnapshot = await getDocs(q);
  // return orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

  if (userId === 'mockUserId' || userId) { // Allow mock data for any logged-in user for now
     return [
        { id: 'order_user_123', userId, items: [{id:'p1',productId:'flex001',productName:'Banner Design A',productImage:'https://placehold.co/50x50.png',size:'M',material:'Flex',customizationDetails:{},quantity:1,unitPrice:30,totalPrice:30}], shippingAddress: {fullName:'User Name', addressLine1:'123 User St', city:'UserCity', state:'US', postalCode:'00000', country:'USA', phoneNumber:'555'}, totalAmount: 30, paymentMethod: 'stripe', status: 'delivered', createdAt: new Date(Date.now() - 5*24*60*60*1000), updatedAt: new Date() },
        { id: 'order_user_456', userId, items: [{id:'p2',productId:'neon001',productName:'Neon Sparkle',productImage:'https://placehold.co/50x50.png',size:'L',material:'Neon',customizationDetails:{},quantity:1,unitPrice:180,totalPrice:180}], shippingAddress: {fullName:'User Name', addressLine1:'123 User St', city:'UserCity', state:'US', postalCode:'00000', country:'USA', phoneNumber:'555'}, totalAmount: 180, paymentMethod: 'razorpay_upi', status: 'shipped', trackingLink:'https://track.example/user_xyz', createdAt: new Date(Date.now() - 2*24*60*60*1000), updatedAt: new Date() },
     ];
  }
  return [];
}

export default function MyOrdersPage() {
  const { currentUser, loading: authLoading } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace("/auth/login?redirect=/orders");
    }
    if (currentUser) {
      setLoadingOrders(true);
      getUserOrders(currentUser.uid)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [currentUser, authLoading, router]);

  const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'delivered': return 'default'; // Assuming 'default' is styled as success (e.g. green)
      case 'shipped': return 'secondary';
      case 'processing': return 'outline'; // Should have a distinct 'processing' style if possible
      case 'pending_payment': return 'outline';
      case 'cancelled': return 'destructive';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  if (authLoading || loadingOrders) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }
  
  if (!currentUser) return null; // Should be redirected by useEffect

  return (
    <div className="container mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline flex items-center"><ListOrdered className="mr-3 h-8 w-8 text-primary"/>My Order History</CardTitle>
          <CardDescription>View details and track your past orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">You haven&apos;t placed any orders yet.</p>
              <Link href="/products" className="mt-6 inline-block">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg">Order ID: <span className="text-primary">{order.id.substring(0,15)}...</span></CardTitle>
                      <CardDescription>
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-sm px-3 py-1">
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                        <p className="font-medium text-sm">Total: <span className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</span></p>
                        <p className="text-xs text-muted-foreground">Items: {order.items.length}</p>
                    </div>
                    <div className="flex justify-end">
                      <Link href={`/order/tracking/${order.id}`}>
                        <Button variant="outline">View Details & Track</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
