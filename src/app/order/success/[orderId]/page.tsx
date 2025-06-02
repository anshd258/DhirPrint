
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-lg shadow-xl p-4 md:p-8">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Order Placed Successfully!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Thank you for your purchase. Your order is being processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Your Order ID is: <span className="font-semibold text-primary">{orderId}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            You will receive an email confirmation shortly with your order details and tracking information once it ships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href={`/order/tracking/${orderId}`}>
              <Button size="lg" variant="outline">Track Your Order</Button>
            </Link>
            <Link href="/products">
              <Button size="lg">
                <ShoppingBag className="mr-2 h-5 w-5" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
