import { SmartImage } from "@/components/ui/SmartImage";
import {
  Reveal,
  MotionDiv,
  staggerContainer,
  fadeUp,
} from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/LinkButton";
import { getTestimonials } from "@/lib/content";
import { cn } from "@/lib/utils";

type TestimonialsProps = {
  limit?: number;
  showCta?: boolean;
  className?: string;
};

function isPlaceholder(quote: string, name: string) {
  return quote.includes("[") || name.includes("[");
}

export async function Testimonials({
  limit,
  showCta = true,
  className,
}: TestimonialsProps) {
  const all = await getTestimonials();
  const items = typeof limit === "number" ? all.slice(0, limit) : all;
  const hasMore = typeof limit === "number" && all.length > limit;
  const showingPlaceholders = items.every((item) =>
    isPlaceholder(item.quote, item.name),
  );

  return (
    <Section
      id="testimonials"
      ariaLabelledby="testimonials-heading"
      className={cn(className)}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="testimonials-heading"
            eyebrow="Testimonials"
            title="What clients say"
            description={
              showingPlaceholders
                ? "Real client quotes appear here once you add them from the admin dashboard."
                : "Feedback from people and teams I have worked with on live projects."
            }
          />
        </Reveal>

        <MotionDiv
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {items.map((item) => (
            <MotionDiv
              key={item.id}
              variants={fadeUp}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="h-full"
            >
              <blockquote className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-accent/30">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-surface-elevated">
                    {item.image ? (
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        placeholderLabel="Photo"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-accent">
                        {item.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <footer>
                    <cite className="not-italic font-semibold text-foreground">
                      {item.name}
                    </cite>
                    {item.roleOrCompany ? (
                      <p className="text-sm text-muted">{item.roleOrCompany}</p>
                    ) : null}
                  </footer>
                </div>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-muted">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </blockquote>
            </MotionDiv>
          ))}
        </MotionDiv>

        {showCta ? (
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {hasMore ? (
                <LinkButton href="/testimonials" variant="secondary">
                  More testimonials
                </LinkButton>
              ) : null}
              <LinkButton href="/contact">Work with me</LinkButton>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
