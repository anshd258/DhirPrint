
"use client";

import type { CartItem, ShippingAddress } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface OrderSummaryReviewProps {
  items: CartItem[];
  shippingAddress: ShippingAddress | null;
  totalAmount: number;
}

export default function OrderSummaryReview({ items, shippingAddress, totalAmount }: OrderSummaryReviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Please review your order details before placing it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Items</h3>
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item.id} className="flex items-center gap-3 p-2 border rounded-md">
                <Image src={item.productImage} alt={item.productName} width={48} height={48} className="rounded object-cover" data-ai-hint="product design"/>
                <div className="flex-grow">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                </div>
                <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        {shippingAddress && (
          <div>
            <h3 className="font-semibold mb-2">Shipping To</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
              <p>Phone: {shippingAddress.phoneNumber}</p>
            </address>
          </div>
        )}
        <Separator />
        <div className="space-y-1">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500">FREE</span>
            </div>
            {/* Add tax if applicable */}
            <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
