
"use client"; 

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
} from "@/components/ui/sidebar";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, UserCircle, Printer } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
  { href: '/admin/products', label: 'Products', icon: <Package size={18}/> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18}/> },
  { href: '/admin/reports', label: 'AI Reports', icon: <BarChart3 size={18}/> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isAdmin, loading, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!currentUser || !isAdmin) {
    router.replace('/auth/login?message=admin_only'); 
    return <div className="flex h-screen items-center justify-center bg-background"><p className="text-foreground">Access Denied. Redirecting...</p></div>;
  }
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };


  return (
    <SidebarProvider defaultOpen>
      <Sidebar 
        collapsible="icon" 
        className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
        variant="sidebar"
      >
        <SidebarHeader className="p-4 flex flex-col items-center gap-3 border-b border-sidebar-border/50">
           <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary font-headline mb-2 group-data-[state=collapsed]:hidden">
             <Printer className="h-6 w-6" />
             DhirPrint AI
           </Link>
           <Link href="/" className="items-center gap-2 text-lg font-bold text-sidebar-primary font-headline mb-2 hidden group-data-[state=collapsed]:flex">
             <Printer className="h-6 w-6" />
           </Link>
          <div className="flex flex-col items-center gap-1.5 group-data-[state=collapsed]:hidden">
            <Avatar className="h-16 w-16 border-2 border-primary/50">
              <AvatarImage src={currentUser.photoURL || undefined} />
              <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserCircle />}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm mt-1">{currentUser.displayName}</p>
            <p className="text-xs text-sidebar-foreground/70">{currentUser.email}</p>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
                    tooltip={{ children: item.label, side: 'right', className: 'ml-2 bg-popover text-popover-foreground text-xs' }}
                    className="justify-start text-sm py-2 group-data-[state=expanded]:px-3 group-data-[state=collapsed]:px-2 data-[active=true]:bg-sidebar-primary/20 data-[active=true]:text-sidebar-primary hover:bg-sidebar-primary/10"
                  >
                    {item.icon}
                    <span className="group-data-[state=expanded]:inline group-data-[state=collapsed]:hidden ml-2">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-3 mt-auto border-t border-sidebar-border/50">
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:aspect-square hover:bg-destructive/20 hover:text-destructive text-sidebar-foreground/80 text-sm">
              <LogOut className="mr-2 h-4 w-4 group-data-[state=collapsed]:mr-0" />
              <span className="group-data-[state=expanded]:inline group-data-[state=collapsed]:hidden">Logout</span>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-card/90 backdrop-blur-md px-4 sm:px-6">
            <SidebarTrigger className="sm:hidden text-muted-foreground hover:text-primary" /> 
            <h1 className="text-xl md:text-2xl font-semibold text-foreground capitalize">
                {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

const Loader2 = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("animate-spin", className)}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
