import Image from "next/image";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Show name beside the mark (navbar). */
  showWordmark?: boolean;
  /** Pixel size of the circular mark. */
  size?: number;
  priority?: boolean;
};

export function Logo({
  className,
  showWordmark = true,
  size = 40,
  priority = true,
}: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={`${profile.fullName} home`}
    >
      <span
        className="relative shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_18px_-6px_rgba(34,211,238,0.45)]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo-mark.png"
          alt=""
          width={size}
          height={size}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </span>

      {showWordmark ? (
        <span className="hidden min-w-0 flex-col leading-none sm:flex">
          <span className="font-display text-[0.95rem] font-semibold tracking-[0.04em] text-foreground">
            ARYAN
          </span>
          <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-accent">
            Chaulagain
          </span>
        </span>
      ) : null}
    </span>
  );
}
