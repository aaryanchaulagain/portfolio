import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/ui/Motion";
import { Container } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { profile } from "@/data/profile";
import { getSiteMediaUrls } from "@/lib/site-media";

export async function Hero() {
  const media = await getSiteMediaUrls();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border"
    >
      <div className="pointer-events-none absolute inset-0 grid-atmosphere opacity-70" />
      <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full ambient-glow blur-2xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full ambient-glow blur-2xl" />

      <Container className="relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
        <Reveal className="order-2 space-y-8 lg:order-1">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {profile.availabilityLabel}
            </p>
            <h1
              id="hero-heading"
              className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              {profile.fullName}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              {profile.headline}
            </p>
            <p className="max-w-xl text-base leading-relaxed text-muted">
              {profile.alternativeHeadline}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <LinkButton href="/#projects" variant="primary" size="lg">
              View Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/#contact" variant="secondary" size="lg">
              Start a Project
            </LinkButton>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6 text-sm text-muted">
            {profile.trustIndicators.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] ambient-glow opacity-80" />
            <div className="gradient-border relative overflow-hidden rounded-[1.75rem] bg-surface p-2 shadow-elevated">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-surface-elevated">
                <SmartImage
                  src={media.hero}
                  alt={`Professional portrait of ${profile.fullName}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  placeholderLabel="Portrait"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-border/80 bg-background/85 p-4 backdrop-blur-md">
                <p className="font-display text-sm font-semibold">
                  {profile.title}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {profile.serviceRegion}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
