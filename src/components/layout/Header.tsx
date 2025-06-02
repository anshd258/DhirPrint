
"use client";

import Link from 'next/link';
import { ShoppingCart, User, LogIn, LogOut, Printer, Zap, Settings, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';


export default function Header() {
  const { currentUser, logout, isAdmin } = useAuthContext();
  const { itemCount } = useCartContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-card/90 backdrop-blur-lg sticky top-0 z-50 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold text-primary font-headline hover:opacity-90 transition-opacity">
          <Printer className="h-7 w-7" />
          DhirPrint AI
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/products" className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors">
            Products
          </Link>
          
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-primary/10 transition-colors group">
            <ShoppingCart className="h-5 w-5 text-foreground/80 group-hover:text-primary" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 focus-visible:ring-1 focus-visible:ring-primary">
                  <Avatar className="h-9 w-9 border border-primary/30">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User size={18}/>}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{currentUser.displayName || currentUser.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')} className="focus:bg-primary/10 focus:text-primary">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/orders')} className="focus:bg-primary/10 focus:text-primary">
                   <ListOrdered className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="text-primary focus:bg-primary/10 focus:text-primary">
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
