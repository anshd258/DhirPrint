
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        primary: "bg-foreground text-background hover:bg-foreground/90 shadow-md hover:shadow-lg", // White/Light button with dark text
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-sm",
        secondary: // For less prominent actions, using themed blue or subtle dark
          "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 shadow-sm",
        ghost: "hover:bg-white/10 hover:text-foreground", // Subtle actions on dark bg
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        darkLozange: "bg-card hover:bg-card/80 text-card-foreground border border-white/10 px-4 py-2 text-sm h-auto rounded-lg justify-between", // For hero card lozenges
        iconDark: "bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full h-9 w-9 p-0", // For small dark icon buttons
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3", // slightly less rounded for sm
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-10 w-10 rounded-xl p-0", // Ensure p-0 for true icon button behavior
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
