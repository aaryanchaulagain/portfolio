import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Reveal, MotionDiv, staggerContainer, fadeUp } from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Testimonials } from "@/components/sections/Testimonials";
import { clientAudiences, trustPoints } from "@/data/testimonials";
import { getIcon } from "@/lib/icons";

export async function Trust() {
  return (
    <>
      <Section id="trust" ariaLabelledby="trust-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="trust-heading"
              eyebrow="Trust"
              title="Built for reliable delivery"
              description="Clear communication, secure practices, and business-minded execution for Australian and remote clients."
            />
          </Reveal>

          <MotionDiv
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {trustPoints.map((point) => {
              const Icon = getIcon(point.icon);
              return (
                <MotionDiv
                  key={point.id}
                  variants={fadeUp}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className="h-full">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base">{point.title}</CardTitle>
                      <CardDescription>{point.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </MotionDiv>
              );
            })}
          </MotionDiv>

          <Reveal delay={0.15}>
            <div className="mt-12 rounded-2xl border border-border bg-surface p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                Who I work with
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {clientAudiences.map((audience) => (
                  <li
                    key={audience}
                    className="rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground"
                  >
                    {audience}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Testimonials limit={3} className="bg-surface/40" />
    </>
  );
}
