import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description: `Learn more about ${profile.fullName} — ${profile.title} working with Australian and remote clients.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <div className="border-b border-border bg-surface/30">
        <Container className="section-padding pb-12 md:pb-16">
          <Reveal>
            <SectionHeading
              eyebrow="About"
              title={profile.fullName}
              description={profile.alternativeHeadline}
            />
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
              {profile.brandStatement}
            </p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Focus
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {profile.title}
                </dd>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Serving
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {profile.serviceRegion}
                </dd>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Status
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {profile.availabilityLabel}
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/skills">View skills</LinkButton>
              <LinkButton href="/contact" variant="secondary">
                Get in touch
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </div>

      <About expanded />
      <Contact />
    </>
  );
}
