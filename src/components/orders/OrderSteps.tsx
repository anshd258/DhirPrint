
"use client";

import { CheckCircle, Loader, Package, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface Step {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ReactNode;
  date?: string;
}

interface OrderStepsProps {
  currentStatus: OrderStatus;
  createdAt?: Date; // Assuming Order type has createdAt
  shippedAt?: Date;
  deliveredAt?: Date;
}

const statusToStepName: Record<OrderStatus, string> = {
  pending_payment: 'Payment Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

const getStepStatus = (stepOrder: number, currentOrder: number): Step['status'] => {
  if (stepOrder < currentOrder) return 'completed';
  if (stepOrder === currentOrder) return 'current';
  return 'upcoming';
};

export default function OrderSteps({ currentStatus, createdAt, shippedAt, deliveredAt }: OrderStepsProps) {
  const statusHierarchy: OrderStatus[] = ['pending_payment', 'processing', 'shipped', 'delivered'];
  let currentStepOrder = statusHierarchy.indexOf(currentStatus);
  if (currentStatus === 'cancelled' || currentStatus === 'failed') {
    // Handle cancelled/failed states - maybe show a specific message instead of steps
    return (
      <div className="p-4 border rounded-md bg-destructive/10 text-destructive text-center">
        <p className="font-semibold text-lg">Order {statusToStepName[currentStatus]}</p>
        <p className="text-sm">If you have any questions, please contact support.</p>
      </div>
    );
  }


  const definedSteps: { name: OrderStatus; icon: React.ReactNode; date?: Date }[] = [
    { name: 'processing', icon: <Loader className="h-6 w-6" />, date: createdAt },
    { name: 'shipped', icon: <Truck className="h-6 w-6" />, date: shippedAt },
    { name: 'delivered', icon: <Home className="h-6 w-6" />, date: deliveredAt },
  ];
  
  // Adjust if payment is pending
  if (currentStatus === 'pending_payment') {
      definedSteps.unshift({ name: 'pending_payment', icon: <CreditCard className="h-6 w-6" />, date: createdAt});
      currentStepOrder = 0; // payment pending is the first step
  } else if (currentStepOrder === -1 && currentStatus === 'processing') { // If processing is the first known state
      currentStepOrder = 0; 
  } else if (currentStepOrder > 0 && definedSteps[0].name !== 'pending_payment') {
    // If processing is not the first step, but it's already processed, shift currentStepOrder
  }


  const steps: Step[] = definedSteps.map((s, index) => ({
    name: statusToStepName[s.name],
    status: getStepStatus(index, currentStepOrder),
    icon: s.icon,
    date: s.date?.toLocaleDateString(),
  }));


  return (
    <div className="w-full p-2 md:p-4">
      <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">                  
        {steps.map((step, index) => (
          <li key={step.name} className="mb-10 ms-6">            
            <span className={cn(
              "absolute flex items-center justify-center w-10 h-10 rounded-full -start-5 ring-4 ring-white dark:ring-gray-900",
              step.status === 'completed' && "bg-green-200 dark:bg-green-900 text-green-600 dark:text-green-400",
              step.status === 'current' && "bg-primary/20 dark:bg-primary/80 text-primary dark:text-primary-foreground",
              step.status === 'upcoming' && "bg-gray-100 dark:bg-gray-700 text-gray-500"
            )}>
              {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step.icon}
            </span>
            <div className="ml-4">
              <h3 className={cn(
                "font-medium leading-tight text-lg",
                step.status === 'current' && "text-primary dark:text-primary-foreground",
                step.status === 'completed' && "text-green-700 dark:text-green-300"
              )}>
                {step.name}
              </h3>
              {step.date && <p className="text-sm">{step.date}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
