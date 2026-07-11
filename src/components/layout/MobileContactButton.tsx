"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function MobileContactButton() {
  return (
    <Link
      href="/contact"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:brightness-110 active:scale-[0.98] md:hidden"
      aria-label="Contact me"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      Contact
    </Link>
  );
}
