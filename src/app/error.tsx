"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/LinkButton";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? error.name);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center">
      <Container className="py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Something went wrong
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight">
          We could not load this page
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          An unexpected error occurred. Please try again, or return to the
          homepage while the issue is reviewed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <LinkButton href="/" variant="secondary">
            Go home
          </LinkButton>
        </div>
      </Container>
    </main>
  );
}
