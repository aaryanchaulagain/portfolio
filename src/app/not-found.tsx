import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center">
      <Container className="py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          404
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you requested does not exist or may have moved. You can return
          home or explore shipped projects.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/">Back to home</LinkButton>
          <LinkButton href="/projects" variant="secondary">
            View projects
          </LinkButton>
        </div>
        <p className="mt-8 text-sm text-muted">
          Need help?{" "}
          <Link href="/contact" className="text-accent underline-offset-2 hover:underline">
            Send an enquiry
          </Link>
          .
        </p>
      </Container>
    </main>
  );
}
