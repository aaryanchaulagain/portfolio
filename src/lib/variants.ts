import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground shadow-glow hover:brightness-110 active:scale-[0.98]",
        secondary:
          "border border-border bg-surface text-foreground hover:bg-surface-elevated active:scale-[0.98]",
        ghost: "text-foreground hover:bg-surface-elevated",
        outline:
          "border border-accent/40 text-accent hover:bg-accent/10 active:scale-[0.98]",
        danger:
          "bg-danger text-white hover:brightness-110 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function buttonClassName(
  variants?: ButtonVariantProps,
  className?: string,
) {
  return cn(buttonVariants(variants), className);
}
