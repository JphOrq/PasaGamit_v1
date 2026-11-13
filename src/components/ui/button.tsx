import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-2 border-ink shadow-flyer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-flyer-lg active:translate-x-0 active:translate-y-0 active:shadow-none",
        ink: "bg-ink text-ink-foreground border-2 border-ink shadow-flyer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-flyer-lg",
        mustard:
          "bg-mustard text-mustard-foreground border-2 border-ink shadow-flyer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-flyer-lg",
        forest:
          "bg-forest text-forest-foreground border-2 border-ink shadow-flyer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-flyer-lg",
        destructive: "bg-destructive text-destructive-foreground border-2 border-ink hover:opacity-90",
        outline: "border-2 border-ink bg-paper text-ink hover:bg-mustard",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-ink/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
