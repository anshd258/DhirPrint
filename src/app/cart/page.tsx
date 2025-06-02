
"use client";

import CartItemDisplay from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/CartContext';
import Link from 'next/link';
import { ShoppingCart, Loader2 } from 'lucide-react';

export default function CartPage() {
  const { cartItems, cartTotal, itemCount, loading, clearCart } = useCartContext();

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-3xl font-bold mb-4 font-headline">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center font-headline">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Items ({itemCount})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {cartItems.map((item) => (
                <CartItemDisplay key={item.id} item={item} />
              ))}
            </CardContent>
            {cartItems.length > 0 && (
                <CardFooter className="p-4">
                    <Button variant="outline" onClick={clearCart} className="text-destructive hover:bg-destructive/10 border-destructive/50">
                        Clear Cart
                    </Button>
                </CardFooter>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span> {/* Or calculate dynamically */}
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>${(cartTotal * 0.00).toFixed(2)}</span> {/* Example tax */}
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
