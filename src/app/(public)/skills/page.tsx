import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Skills",
  description: `Technical skills and stack experience from ${profile.fullName} — honest levels based on real client delivery.`,
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <>
      <div className="border-b border-border bg-surface/30">
        <Container className="section-padding pb-12 md:pb-16">
          <Reveal>
            <SectionHeading
              eyebrow="Skills"
              title="Technical capabilities"
              description="Core tools I use on client work, plus experienced and working knowledge across the modern web stack."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/projects">See projects shipped</LinkButton>
              <LinkButton href="/contact" variant="secondary">
                Discuss your stack
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </div>

      <Skills />
      <Contact />
    </>
  );
}
