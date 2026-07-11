import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-surface-elevated text-foreground border-border",
  accent: "bg-accent/15 text-accent border-accent/25",
  success: "bg-success/15 text-success border-success/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  muted: "bg-muted/10 text-muted border-border",
} as const;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: keyof typeof badgeVariants;
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
