
"use client";

import Link from 'next/link';
import { ShoppingCart, User, LogIn, LogOut, Printer, Zap, Settings, ListOrdered, Menu } from 'lucide-react';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';


export default function Header() {
  const { currentUser, logout, isAdmin } = useAuthContext();
  const { itemCount } = useCartContext();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/#features", label: "Features" }, // Example link to a section
    { href: "/#contact", label: "Contact" }, // Example link to a section
  ];

  return (
    <header className="glassmorphic sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold text-primary font-headline hover:opacity-90 transition-opacity">
          <Printer className="h-7 w-7" />
          <span className="hidden sm:inline">DhirPrint AI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-primary/10 transition-colors group">
            <ShoppingCart className="h-5 w-5 text-foreground/80 group-hover:text-primary" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center px-1">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
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
              <DropdownMenuContent className="w-56 glassmorphic" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{currentUser.displayName || currentUser.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10"/>
                <DropdownMenuItem onClick={() => router.push('/profile')} className="focus:bg-primary/20 focus:text-primary">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/orders')} className="focus:bg-primary/20 focus:text-primary">
                   <ListOrdered className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="text-primary focus:bg-primary/20 focus:text-primary">
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10"/>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login" className="hidden md:block">
              <Button variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          )}
          
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-foreground/80" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] glassmorphic p-6">
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map(link => (
                    <Link 
                        key={link.label} 
                        href={link.href} 
                        className="text-lg font-medium text-foreground/90 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!currentUser && (
                     <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="primary" className="w-full mt-4">
                            Login
                        </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
