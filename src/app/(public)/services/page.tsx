import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Services",
  description: `Websites, custom apps, e-commerce, dashboards, and integrations from ${profile.fullName} — built for Australian and remote businesses.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <div className="border-b border-border bg-surface/30">
        <Container className="section-padding pb-12 md:pb-16">
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title="Full-stack delivery for growing businesses"
              description="Every engagement is scoped around a clear outcome — a site that converts, a system your team can run, or an integration that removes manual work."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/contact">Request a quote</LinkButton>
              <LinkButton href="/projects" variant="secondary">
                See projects shipped
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </div>

      <Services showCta={false} className="bg-transparent" />
      <Contact />
    </>
  );
}
