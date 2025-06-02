
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummaryReview from "@/components/checkout/OrderSummaryReview";
import type { ShippingAddress, CartItem, Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCartContext } from "@/contexts/CartContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// TODO: Import and use actual createOrder Cloud Function
// import { createOrder as createOrderCF } from '@/server-actions/create-order'; // Example path

export default function CheckoutPage() {
  const [currentTab, setCurrentTab] = useState("shipping");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{ method: string; transactionId?: string } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { cartItems, cartTotal, clearCart } = useCartContext();
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  if (!currentUser) {
     // router.push('/auth/login?redirect=/checkout'); // Or show a message
     return <div className="text-center py-10">Please <Link href="/auth/login?redirect=/checkout" className="text-primary underline">log in</Link> to proceed with checkout.</div>
  }

  if (cartItems.length === 0 && !isPlacingOrder) { // Check isPlacingOrder to avoid redirect after order success
    router.push('/cart');
    return <div className="text-center py-10">Your cart is empty. Redirecting...</div>;
  }

  const handleSaveShipping = (data: ShippingAddress) => {
    setShippingAddress(data);
    setCurrentTab("payment");
  };

  const handlePaymentSuccess = (data: { method: string; transactionId?: string }) => {
    setPaymentDetails(data);
    setCurrentTab("review");
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentDetails || !termsAccepted || !currentUser) {
      toast({ title: "Error", description: "Please complete all steps and accept terms.", variant: "destructive" });
      return;
    }
    setIsPlacingOrder(true);

    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: currentUser.uid,
      items: cartItems,
      shippingAddress,
      totalAmount: cartTotal,
      paymentMethod: paymentDetails.method,
      // Conditional IDs based on payment method
      ...(paymentDetails.method === 'stripe' && { paymentIntentId: paymentDetails.transactionId }),
      ...(paymentDetails.method === 'razorpay_upi' && { razorpayOrderId: paymentDetails.transactionId }),
      status: 'processing', // Initial status
    };

    try {
      // TODO: Call actual createOrder Cloud Function here
      // const result = await createOrderCF(orderData);
      // Mocking successful order creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockOrderId = `order_${Date.now()}`; 
      
      // TODO: Store order in Firestore orders/{orderId} via CF
      // TODO: Clear cart from Firestore via CF or context
      await clearCart(); 
      toast({ title: "Order Placed!", description: "Thank you for your purchase.", icon: <CheckCircle className="h-5 w-5 text-green-500"/> });
      router.push(`/order/success/${mockOrderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({ title: "Order Failed", description: "Could not place your order. Please try again.", variant: "destructive" });
      setIsPlacingOrder(false);
    }
  };

  const tabDetails = [
    { value: "shipping", label: "Shipping", icon: <Truck className="mr-2 h-5 w-5"/> },
    { value: "payment", label: "Payment", icon: <CreditCard className="mr-2 h-5 w-5"/> },
    { value: "review", label: "Review & Place Order", icon: <ShoppingBag className="mr-2 h-5 w-5"/> },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center font-headline">Checkout</h1>
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                {tabDetails.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value} disabled={
                        (tab.value === "payment" && !shippingAddress) ||
                        (tab.value === "review" && (!shippingAddress || !paymentDetails))
                    } className="text-sm md:text-base">
                        {tab.icon} {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            <CardContent>
            <TabsContent value="shipping">
                <ShippingForm onSaveShippingAddress={handleSaveShipping} initialData={shippingAddress || undefined}/>
            </TabsContent>
            <TabsContent value="payment">
                <PaymentForm onPaymentSuccess={handlePaymentSuccess} amount={cartTotal} />
                 <Button variant="outline" onClick={() => setCurrentTab("shipping")} className="mt-4 w-full">Back to Shipping</Button>
            </TabsContent>
            <TabsContent value="review">
                <OrderSummaryReview items={cartItems} shippingAddress={shippingAddress} totalAmount={cartTotal} />
                <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
                        <Label htmlFor="terms" className="text-sm">
                            I agree to the <Link href="/terms" className="text-primary underline">terms and conditions</Link>.
                        </Label>
                    </div>
                    <Button 
                        onClick={handlePlaceOrder} 
                        className="w-full" 
                        size="lg"
                        disabled={!termsAccepted || isPlacingOrder || !shippingAddress || !paymentDetails}
                    >
                        {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Place Order
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentTab("payment")} className="w-full" disabled={isPlacingOrder}>Back to Payment</Button>
                </div>
            </TabsContent>
            </CardContent>
            </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}

