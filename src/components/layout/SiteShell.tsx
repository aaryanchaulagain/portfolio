import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { MobileContactButton } from "@/components/layout/MobileContactButton";
import { Navbar } from "@/components/layout/Navbar";

function FooterFallback() {
  return (
    <div
      className="border-t border-border bg-surface"
      aria-hidden="true"
      style={{ minHeight: "16rem" }}
    />
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Suspense fallback={<FooterFallback />}>
        <Footer />
      </Suspense>
      <MobileContactButton />
    </div>
  );
}
