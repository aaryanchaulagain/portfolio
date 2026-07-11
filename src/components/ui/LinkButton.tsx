import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClassName, type ButtonVariantProps } from "@/lib/variants";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentProps<typeof Link> &
  ButtonVariantProps & {
    className?: string;
  };

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonClassName({ variant, size }), className)}
      {...props}
    />
  );
}
