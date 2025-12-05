import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  " inline-flex items-center cursor-pointer justify-center gap-[8px] whitespace-nowrap rounded-full text-md font-semibold transition-all duration-150 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-orange-primary text-white hover:bg-orange-secondary",
        secondary:
          "bg-orange-secondary text-orange-primary hover:bg-orange-primary hover:text-white",
        "green-primary": "bg-green-primary text-white hover:bg-green-secondary",
        "green-secondary":
          "bg-green-secondary text-green-primary hover:bg-green-primary hover:text-white",
        "green-outline":
          "outline outline-solid outline-1 -outline-offset-1 outline-green-primary bg-white text-green-primary shadow-xs hover:bg-green-secondary dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        destructive:
          "bg-red-secondary text-red-primary hover:bg-red-secondary/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          " outline outline-solid outline-1 -outline-offset-1 outline-orange-primary bg-white text-orange-primary shadow-xs hover:bg-orange-secondary dark:bg-input/30 dark:border-input dark:hover:bg-input/50",

        ghost:
          "hover:bg-foreground-secondary text-text-primary dark:hover:bg-accent/50",
        "destructive-ghost":
          "hover:bg-red-secondary text-red-primary dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[44px] px-[24px] has-[>svg]:px-[16px]",
        icon: "size-[36px]",
        "icon-sm": "size-[32px]",
        "icon-lg": "size-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
