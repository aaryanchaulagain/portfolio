import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import {
  Reveal,
  MotionDiv,
  staggerContainer,
  fadeUp,
} from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/LinkButton";
import { getServices } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type ServicesProps = {
  /** Limit cards on the homepage; omit for the full /services page. */
  limit?: number;
  showCta?: boolean;
  className?: string;
};

export async function Services({
  limit,
  showCta = true,
  className,
}: ServicesProps) {
  const all = await getServices();
  const services = typeof limit === "number" ? all.slice(0, limit) : all;
  const hasMore = typeof limit === "number" && all.length > limit;

  return (
    <Section
      id="services"
      ariaLabelledby="services-heading"
      className={cn("bg-surface/40", className)}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title="How I Can Help Your Business"
            description="Outcome-focused engagement — from credible websites to custom systems that match how your team actually works."
          />
        </Reveal>

        <MotionDiv
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={staggerContainer}
        >
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <MotionDiv
                key={service.id}
                variants={fadeUp}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="group h-full"
              >
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_20px_50px_-28px_rgba(34,211,238,0.35)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
                    <SmartImage
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 2}
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      placeholderLabel="Service image"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95"
                      aria-hidden="true"
                    />
                    <div className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-background/70 text-accent shadow-soft backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {service.outcome}
                    </p>
                    <Link
                      href="/contact"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
                    >
                      Discuss this service
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              </MotionDiv>
            );
          })}
        </MotionDiv>

        {showCta ? (
          <Reveal delay={0.12}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {hasMore ? (
                <LinkButton href="/services" variant="secondary">
                  View all services
                </LinkButton>
              ) : null}
              <LinkButton href="/contact">Start a project</LinkButton>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
