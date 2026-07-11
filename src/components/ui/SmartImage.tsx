"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholderLabel?: string;
}

function isUnresolvedPath(src: string) {
  return !src || src.includes("[") || src.includes("]");
}

export function SmartImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
  placeholderLabel,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = failed || isUnresolvedPath(src);

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-surface-elevated via-surface to-accent/10 text-center",
          fill && "absolute inset-0 h-full w-full",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {placeholderLabel ?? "Image coming soon"}
        </span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={
          src.startsWith("/api/media/") ||
          src.startsWith("/api/content-image/")
        }
        className={cn("object-cover", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 1000}
      sizes={sizes}
      priority={priority}
      unoptimized={
        src.startsWith("/api/media/") ||
        src.startsWith("/api/content-image/")
      }
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
