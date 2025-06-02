
"use client";

import { useState, useEffect } from 'react';
import type { Order, CartItem } from '@/types';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OrderSteps from '@/components/orders/OrderSteps';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Package, AlertCircle } from 'lucide-react';

// Mock function to fetch order details. Replace with actual Firestore fetching.
async function getOrderDetails(orderId: string): Promise<Order | null> {
  // TODO: Replace with actual Firestore fetching
  // Example:
  // const orderRef = doc(db, 'orders', orderId);
  // const orderSnap = await getDoc(orderRef);
  // if (orderSnap.exists()) {
  //   return { id: orderSnap.id, ...orderSnap.data() } as Order;
  // }
  // return null;
  
  // Mock data:
  if (orderId.startsWith("order_")) {
    const mockItems: CartItem[] = [
      { id: 'item1', productId: 'flex001', productName: 'Standard Flex Banner', productImage: 'https://placehold.co/100x100.png', size: '3x5 ft', material: 'Standard Flex', customizationDetails: {}, quantity: 1, unitPrice: 25, totalPrice: 25 },
      { id: 'item2', productId: 'acrylic001', productName: 'Clear Acrylic Sign', productImage: 'https://placehold.co/100x100.png', size: '12x18 in', material: '3mm Clear Acrylic', customizationDetails: { overlayText: 'Welcome' }, quantity: 2, unitPrice: 50, totalPrice: 100 },
    ];
    return {
      id: orderId,
      userId: 'mockUserId',
      items: mockItems,
      shippingAddress: {
        fullName: 'John Doe',
        addressLine1: '123 Print St',
        city: 'Designsville',
        state: 'CA',
        postalCode: '90210',
        country: 'USA',
        phoneNumber: '555-1234'
      },
      totalAmount: 125,
      paymentMethod: 'stripe',
      paymentIntentId: 'pi_mock_' + Date.now(),
      status: (['processing', 'shipped', 'delivered'] as const)[Math.floor(Math.random() * 3)], // Random status
      trackingLink: 'https://example.com/track/' + orderId,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(),
      // Add shippedAt and deliveredAt based on status for mock
      ...( (['processing', 'shipped', 'delivered'] as const)[Math.floor(Math.random() * 3)] === 'shipped' && { shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }),
      ...( (['processing', 'shipped', 'delivered'] as const)[Math.floor(Math.random() * 3)] === 'delivered' && { deliveredAt: new Date() }),
    };
  }
  return null;
}


export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrderDetails(orderId)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto py-12 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground">We couldn&apos;t find an order with ID: {orderId}</p>
        <Link href="/orders" className="mt-4 inline-block">
            <Button variant="outline">View My Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Order Tracking</CardTitle>
          <CardDescription>Order ID: <span className="font-medium text-primary">{order.id}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <OrderSteps 
            currentStatus={order.status} 
            createdAt={order.createdAt ? new Date(order.createdAt.seconds * 1000) : undefined} // Handle Firestore Timestamp if applicable
            shippedAt={(order as any).shippedAt ? new Date((order as any).shippedAt.seconds * 1000) : undefined}
            deliveredAt={(order as any).deliveredAt ? new Date((order as any).deliveredAt.seconds * 1000) : undefined}
          />
          {order.trackingLink && order.status === 'shipped' && (
            <div className="mt-6 text-center">
              <a href={order.trackingLink} target="_blank" rel="noopener noreferrer">
                <Button variant="default">Track Package Externally</Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-lg">Items</h3>
            <ul className="space-y-4">
              {order.items.map(item => (
                <li key={item.id} className="flex items-start gap-4 p-3 border rounded-md bg-muted/30">
                  <Image 
                    src={item.productImage || 'https://placehold.co/80x80.png'} 
                    alt={item.productName} 
                    width={80} 
                    height={80} 
                    className="rounded object-cover shadow"
                    data-ai-hint="product design" />
                  <div className="flex-grow">
                    <p className="font-semibold text-base">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Material: {item.material}</p>
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                    {item.customizationDetails.overlayText && <p className="text-sm text-muted-foreground">Overlay: "{item.customizationDetails.overlayText}"</p>}
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-base">${item.totalPrice.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-lg">Shipping Address</h3>
              <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phoneNumber}</p>
              </address>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">Payment Information</h3>
              <p className="text-sm text-muted-foreground">Method: <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span></p>
              <p className="text-sm text-muted-foreground">Total: <span className="font-medium text-foreground">${order.totalAmount.toFixed(2)}</span></p>
            </div>
          </div>
          <Separator />
          <div className="text-center mt-4">
            {/* TODO: Implement Reorder Functionality */}
            <Button variant="outline" size="lg" disabled>
              <Package className="mr-2 h-5 w-5" /> Reorder Items
            </Button>
            <p className="text-xs text-muted-foreground mt-2">(Reorder functionality coming soon)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
