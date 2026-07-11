import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Awards",
  description: `Awards and hackathon recognition for ${profile.fullName}.`,
  path: "/awards",
});

export default function AwardsPage() {
  return (
    <>
      <div className="border-b border-border bg-surface/30">
        <Container className="section-padding pb-12 md:pb-16">
          <Reveal>
            <SectionHeading
              eyebrow="Recognition"
              title="Awards and hackathons"
              description="Official titles, organisers, and project context — updated from the admin dashboard as certificates are confirmed."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/projects">Browse projects</LinkButton>
              <LinkButton href="/contact" variant="secondary">
                Start a project
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </div>

      <Awards />
      <Contact />
    </>
  );
}
