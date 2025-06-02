
"use client"; // Required for hooks like useAuthContext and useRouter

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"; // Assuming Sidebar is in ui
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, UserCircle, Printer } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/admin/products', label: 'Products', icon: <Package /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart /> },
  { href: '/admin/reports', label: 'Sales Reports', icon: <BarChart3 /> },
  // Add more admin links if needed
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isAdmin, loading, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!currentUser || !isAdmin) {
    router.replace('/auth/login?message=admin_only'); // Redirect to login or an unauthorized page
    return <div className="flex h-screen items-center justify-center"><p>Access Denied. Redirecting...</p></div>;
  }
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };


  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex flex-col items-center gap-2">
           <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary font-headline mb-2 group-data-[state=collapsed]:hidden">
             <Printer className="h-7 w-7" />
             DhirPrint AI
           </Link>
           <Link href="/" className="items-center gap-2 text-xl font-bold text-primary font-headline mb-2 hidden group-data-[state=collapsed]:flex">
             <Printer className="h-7 w-7" />
           </Link>
          <div className="flex flex-col items-center gap-1 group-data-[state=collapsed]:hidden">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={currentUser.photoURL || undefined} />
              <AvatarFallback className="text-xl">{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserCircle />}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm">{currentUser.displayName}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right', className: 'ml-2' }}
                    className="justify-start"
                  >
                    {item.icon}
                    <span className="group-data-[state=expanded]:inline group-data-[state=collapsed]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:aspect-square">
              <LogOut className="mr-2 h-5 w-5 group-data-[state=collapsed]:mr-0" />
              <span className="group-data-[state=expanded]:inline group-data-[state=collapsed]:hidden">Logout</span>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/30">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
            <SidebarTrigger className="sm:hidden" /> {/* Mobile toggle */}
            <h1 className="text-2xl font-semibold font-headline capitalize">
                {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h1>
        </header>
        <main className="flex-1 p-4 md:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Add a Loader2 component if not already available globally
const Loader2 = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("animate-spin", className)}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
