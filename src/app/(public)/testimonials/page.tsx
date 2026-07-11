import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Testimonials",
  description: `Client feedback for ${profile.fullName} — software and web development for Australian and remote businesses.`,
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <>
      <div className="border-b border-border bg-surface/30">
        <Container className="section-padding pb-12 md:pb-16">
          <Reveal>
            <SectionHeading
              eyebrow="Testimonials"
              title="Client feedback"
              description="Quotes you approve and publish from the admin dashboard appear here with name, role, and photo."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/contact">Start a conversation</LinkButton>
              <LinkButton href="/services" variant="secondary">
                Browse services
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </div>

      <Testimonials showCta={false} />
      <Contact />
    </>
  );
}
