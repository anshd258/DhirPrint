
"use client";

import { useState, useEffect } from 'react';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Loader2, Search, Filter, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import OrderSteps from '@/components/orders/OrderSteps';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';


// Mock function to fetch orders. Replace with actual Firestore fetching.
async function getAdminOrders(): Promise<Order[]> {
  // TODO: Replace with actual Firestore fetching
  return [
    { id: 'order_123', userId: 'userA', items: [{id:'p1',productId:'flex001',productName:'Banner',productImage:'https://placehold.co/50x50.png',size:'S',material:'Flex',customizationDetails:{},quantity:1,unitPrice:25,totalPrice:25}], shippingAddress: {fullName:'Alice', addressLine1:'1 St', city:'City', state:'ST', postalCode:'123', country:'US', phoneNumber:'111'}, totalAmount: 25, paymentMethod: 'stripe', status: 'processing', createdAt: new Date(Date.now() - 1*24*60*60*1000), updatedAt: new Date() },
    { id: 'order_456', userId: 'userB', items: [{id:'p2',productId:'acrylic001',productName:'Sign',productImage:'https://placehold.co/50x50.png',size:'M',material:'Acrylic',customizationDetails:{},quantity:2,unitPrice:50,totalPrice:100}], shippingAddress: {fullName:'Bob', addressLine1:'2 Ave', city:'Town', state:'ST', postalCode:'456', country:'US', phoneNumber:'222'}, totalAmount: 100, paymentMethod: 'razorpay_upi', status: 'shipped', trackingLink:'https://track.example/xyz', createdAt: new Date(Date.now() - 3*24*60*60*1000), updatedAt: new Date() },
    { id: 'order_789', userId: 'userC', items: [{id:'p3',productId:'neon001',productName:'Neon',productImage:'https://placehold.co/50x50.png',size:'L',material:'Neon',customizationDetails:{},quantity:1,unitPrice:150,totalPrice:150}], shippingAddress: {fullName:'Charlie', addressLine1:'3 Rd', city:'Village', state:'ST', postalCode:'789', country:'US', phoneNumber:'333'}, totalAmount: 150, paymentMethod: 'stripe', status: 'delivered', createdAt: new Date(Date.now() - 7*24*60*60*1000), updatedAt: new Date() },
  ];
}

const orderStatuses: Order['status'][] = ['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);
  const [editingOrderForStatus, setEditingOrderForStatus] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status'] | ''>('');

  const { toast } = useToast();

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      const fetchedOrders = await getAdminOrders();
      setOrders(fetchedOrders);
      setIsLoading(false);
    }
    loadOrders();
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailViewOpen(true);
  };

  const openStatusUpdateForm = (order: Order) => {
    setEditingOrderForStatus(order);
    setNewStatus(order.status);
    setIsStatusFormOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!editingOrderForStatus || !newStatus) return;
    // TODO: Implement Firestore update logic for order status
    setOrders(orders.map(o => o.id === editingOrderForStatus.id ? { ...o, status: newStatus as Order['status'], updatedAt: new Date() } : o));
    toast({ title: "Order Status Updated", description: `Order ${editingOrderForStatus.id.substring(0,12)}... status changed to ${newStatus}.` });
    setIsStatusFormOpen(false);
    setEditingOrderForStatus(null);
    setNewStatus('');
  };
  
  const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'delivered': return 'default'; // Blueish-Green for success
      case 'shipped': return 'secondary'; // Another shade of blue
      case 'processing': return 'outline'; // Yellow/Orange (or keep as outline if theme doesn't support well)
      case 'pending_payment': return 'outline'; // Default outline
      case 'cancelled': return 'destructive';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };


  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card rounded-lg shadow">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground"/>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Order['status'] | 'all')}>
                <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-xs">Status</SelectLabel>
                    <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                    {orderStatuses.map(status => (
                        <SelectItem key={status} value={status} className="capitalize text-xs">{status.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
            </Select>
        </div>
      </div>

      <Card className="shadow-lg border-border/70">
        <Table>
         <TableHeader>
          <TableRow className="border-b-border/50">
            <TableHead className="text-xs">Order ID</TableHead>
            <TableHead className="text-xs">Customer</TableHead>
            <TableHead className="text-xs">Date</TableHead>
            <TableHead className="text-right text-xs">Total</TableHead>
            <TableHead className="text-center text-xs">Status</TableHead>
            <TableHead className="text-center w-[80px] text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <TableRow key={order.id} className="text-sm">
                <TableCell className="font-medium text-primary hover:underline">
                  <button onClick={() => handleViewDetails(order)} className="text-xs">{order.id.substring(0,12)}...</button>
                </TableCell>
                <TableCell className="text-xs">{order.shippingAddress.fullName} <span className="text-xs text-muted-foreground">({order.userId.substring(0,6)}...)</span></TableCell>
                <TableCell className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right text-xs">${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-[10px] px-2 py-0.5">{order.status.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 w-7 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(order)} className="text-xs">
                        <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openStatusUpdateForm(order)} className="text-xs">
                        <Edit className="mr-2 h-3.5 w-3.5" /> Update Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                      No orders found matching your criteria.
                    </TableCell>
                  </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Order Detail View Dialog */}
      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col bg-card border-border/70">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="text-xl font-semibold">Order Details: {selectedOrder?.id.substring(0,15)}...</DialogTitle>
            <DialogDescription className="text-xs">
              Customer: {selectedOrder?.shippingAddress.fullName} ({selectedOrder?.userId.substring(0,8)}...)
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-4 text-sm">
              <OrderSteps 
                currentStatus={selectedOrder.status} 
                createdAt={new Date(selectedOrder.createdAt)}
                shippedAt={(selectedOrder as any).shippedAt ? new Date((selectedOrder as any).shippedAt) : undefined} // Assuming direct Date objects for mock
                deliveredAt={(selectedOrder as any).deliveredAt ? new Date((selectedOrder as any).deliveredAt) : undefined}
              />
              <h3 className="font-semibold text-md mt-4">Items:</h3>
              <ul className="space-y-2">
                {selectedOrder.items.map(item => (
                  <li key={item.id} className="flex gap-3 p-3 border border-border/50 rounded-md items-center bg-background/30">
                    <Image src={item.productImage || 'https://placehold.co/60x60.png'} alt={item.productName} width={50} height={50} className="rounded object-cover" data-ai-hint="product photo"/>
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} - ${item.unitPrice.toFixed(2)} each</p>
                      <p className="text-xs text-muted-foreground">{item.material} / {item.size}</p>
                    </div>
                    <p className="font-semibold text-sm">${item.totalPrice.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <Separator className="my-3 bg-border/50"/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold text-md">Shipping Address:</h3>
                    <address className="not-italic text-xs text-muted-foreground leading-normal">
                        <p>{selectedOrder.shippingAddress.fullName}</p>
                        <p>{selectedOrder.shippingAddress.addressLine1}</p>
                        {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                        <p>{selectedOrder.shippingAddress.country} | Phone: {selectedOrder.shippingAddress.phoneNumber}</p>
                    </address>
                </div>
                 <div>
                    <h3 className="font-semibold text-md">Payment Details:</h3>
                    <p className="text-xs text-muted-foreground">Method: {selectedOrder.paymentMethod}</p>
                    <p className="text-xs text-muted-foreground">Total: ${selectedOrder.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Status: <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="capitalize text-[10px] px-2 py-0.5">{selectedOrder.status.replace('_',' ')}</Badge></p>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isStatusFormOpen} onOpenChange={setIsStatusFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/70">
          <DialogHeader>
            <DialogTitle className="font-semibold">Update Order Status</DialogTitle>
            <DialogDescription className="text-xs">Order ID: {editingOrderForStatus?.id.substring(0,15)}...</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="status-select" className="text-xs">New Status</Label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
              <SelectTrigger id="status-select" className="h-9 text-xs">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-xs">Statuses</SelectLabel>
                  {orderStatuses.map(status => (
                    <SelectItem key={status} value={status} className="capitalize text-xs">{status.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusFormOpen(false)} size="sm">Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={!newStatus || newStatus === editingOrderForStatus?.status} size="sm">
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Added CreditCard icon for consistency, ensure it's imported from lucide-react
// Make sure OrderSteps handles the new date types correctly (Timestamp to Date)
