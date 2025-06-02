
"use client";

import type { ReactNode} from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CartItem } from '@/types';
import { useAuthContext } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteDoc, collection, writeBatch, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addItemToCart: (item: CartItem) => Promise<void>;
  removeItemFromCart: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuthContext();
  const { toast } = useToast();

  const getCartRef = useCallback(() => {
    if (!currentUser) return null;
    return doc(db, 'carts', currentUser.uid);
  }, [currentUser]);

  const getCartItemsCollectionRef = useCallback(() => {
    const cartRef = getCartRef();
    if (!cartRef) return null;
    return collection(cartRef, 'items');
  }, [getCartRef]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) {
        setCartItems([]); // Clear cart if user logs out
        return;
      }
      setLoading(true);
      const itemsColRef = getCartItemsCollectionRef();
      if (!itemsColRef) {
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(itemsColRef);
        const items = querySnapshot.docs.map(docSnap => docSnap.data() as CartItem);
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({ title: "Error", description: "Could not load your cart.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUser, getCartItemsCollectionRef, toast]);

  const addItemToCart = async (item: CartItem) => {
    if (!currentUser) {
      toast({ title: "Not logged in", description: "Please log in to add items to your cart.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const itemsColRef = getCartItemsCollectionRef();
    if (!itemsColRef) {
      setLoading(false);
      return;
    }

    try {
      const existingItemIndex = cartItems.findIndex(ci => ci.id === item.id);
      let newCartItems;
      const itemDocRef = doc(itemsColRef, item.id);

      if (existingItemIndex > -1) {
        const existingItem = cartItems[existingItemIndex];
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + item.quantity, totalPrice: existingItem.unitPrice * (existingItem.quantity + item.quantity) };
        await setDoc(itemDocRef, updatedItem);
        newCartItems = cartItems.map(ci => ci.id === item.id ? updatedItem : ci);
      } else {
        await setDoc(itemDocRef, item);
        newCartItems = [...cartItems, item];
      }
      setCartItems(newCartItems);
      toast({ title: "Success", description: `${item.productName} added to cart.` });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({ title: "Error", description: "Could not add item to cart.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (itemId: string) => {
    if (!currentUser) return;
    setLoading(true);
    const itemsColRef = getCartItemsCollectionRef();
     if (!itemsColRef) {
      setLoading(false);
      return;
    }
    try {
      await deleteDoc(doc(itemsColRef, itemId));
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast({ title: "Success", description: "Item removed from cart." });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({ title: "Error", description: "Could not remove item from cart.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    if (!currentUser || quantity <= 0) {
      if (quantity <= 0) await removeItemFromCart(itemId);
      return;
    }
    setLoading(true);
    const itemsColRef = getCartItemsCollectionRef();
    if (!itemsColRef) {
      setLoading(false);
      return;
    }

    try {
      const itemIndex = cartItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) throw new Error("Item not found");

      const itemToUpdate = cartItems[itemIndex];
      const updatedItem = { ...itemToUpdate, quantity, totalPrice: itemToUpdate.unitPrice * quantity };
      
      await setDoc(doc(itemsColRef, itemId), updatedItem);
      setCartItems(prevItems => prevItems.map(item => item.id === itemId ? updatedItem : item));
      toast({ title: "Success", description: "Cart updated." });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({ title: "Error", description: "Could not update cart.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;
    setLoading(true);
    const itemsColRef = getCartItemsCollectionRef();
    if (!itemsColRef) {
      setLoading(false);
      return;
    }
    try {
      const batch = writeBatch(db);
      const querySnapshot = await getDocs(itemsColRef);
      querySnapshot.forEach(docSnap => batch.delete(docSnap.ref));
      await batch.commit();
      
      setCartItems([]);
      toast({ title: "Success", description: "Cart cleared." });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({ title: "Error", description: "Could not clear cart.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    cartTotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
