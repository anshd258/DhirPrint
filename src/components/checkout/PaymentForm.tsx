
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Lock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  onPaymentSuccess: (paymentDetails: { method: string; transactionId?: string }) => void;
  amount: number;
}

export default function PaymentForm({ onPaymentSuccess, amount }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual Stripe Elements or Razorpay UPI integration here
    // This is a mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    if (paymentMethod === "stripe") {
      // Simulate Stripe payment success
      const mockStripeCardNumber = (document.getElementById('cardNumber') as HTMLInputElement)?.value;
      if (!mockStripeCardNumber || mockStripeCardNumber.length < 16) {
        toast({ title: "Payment Failed", description: "Invalid card number.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      onPaymentSuccess({ method: "stripe", transactionId: `stripe_${Date.now()}` });
    } else if (paymentMethod === "razorpay_upi") {
      // Simulate Razorpay UPI payment success
      const mockUpiId = (document.getElementById('upiId') as HTMLInputElement)?.value;
       if (!mockUpiId || !mockUpiId.includes('@')) {
        toast({ title: "Payment Failed", description: "Invalid UPI ID.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      onPaymentSuccess({ method: "razorpay_upi", transactionId: `rzp_${Date.now()}` });
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Choose your payment method and complete your purchase of ${amount.toFixed(2)}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-6">
          <RadioGroup defaultValue="stripe" onValueChange={setPaymentMethod} className="mb-4">
            <div className="flex items-center space-x-2 p-3 border rounded-md has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-primary">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex-grow cursor-pointer">Pay with Card (Stripe)</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-md has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-primary">
              <RadioGroupItem value="razorpay_upi" id="razorpay_upi" />
              <Label htmlFor="razorpay_upi" className="flex-grow cursor-pointer">UPI (Razorpay)</Label>
            </div>
          </RadioGroup>

          {paymentMethod === "stripe" && (
            <div className="space-y-4 p-4 border rounded-md bg-muted/20">
              <h3 className="font-semibold">Enter Card Details</h3>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" type="text" placeholder="•••• •••• •••• ••••" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="text" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" type="text" placeholder="•••" />
                </div>
              </div>
               <p className="text-xs text-muted-foreground flex items-center"><Lock className="w-3 h-3 mr-1"/> Secure payment via Stripe.</p>
            </div>
          )}

          {paymentMethod === "razorpay_upi" && (
            <div className="space-y-4 p-4 border rounded-md bg-muted/20">
               <h3 className="font-semibold">Enter UPI ID</h3>
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input id="upiId" type="text" placeholder="yourname@bank" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center"><Lock className="w-3 h-3 mr-1"/> Secure payment via Razorpay.</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              `Pay $${amount.toFixed(2)} Securely`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
