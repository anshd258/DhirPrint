
"use client";

import type { CartItem as CartItemType } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemDisplay({ item }: CartItemProps) {
  const { updateItemQuantity, removeItemFromCart } = useCartContext();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
        removeItemFromCart(item.id);
    } else {
        updateItemQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0">
      <div className="relative w-24 h-24 bg-muted rounded overflow-hidden shrink-0">
        <Image 
            src={item.productImage || 'https://placehold.co/100x100.png'} 
            alt={item.productName} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="product design" />
      </div>
      <div className="flex-grow space-y-1">
        <h3 className="font-semibold text-lg">{item.productName}</h3>
        <p className="text-sm text-muted-foreground">
          {item.material} / {item.size}
        </p>
        {item.customizationDetails.overlayText && (
            <p className="text-xs text-muted-foreground">Text: "{item.customizationDetails.overlayText}"</p>
        )}
        <p className="text-sm font-medium text-primary">${item.unitPrice.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          min="1"
          className="w-16 h-10 text-center"
        />
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="shrink-0 w-20 text-right">
        <p className="font-semibold text-lg">${item.totalPrice.toFixed(2)}</p>
      </div>
      <div className="shrink-0">
        <Button variant="ghost" size="icon" onClick={() => removeItemFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
