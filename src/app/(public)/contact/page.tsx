import { Contact } from "@/components/sections/Contact";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Motion";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description: `Start a project with ${profile.fullName}. Share your goals and get a clear next step.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <div className="border-b border-border bg-surface/30">
        <Container className="section-padding pb-10 md:pb-12">
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title="Let’s talk about your project"
              description="Share what you need built, your timeline, and how you prefer to work — I’ll reply with a clear next step."
            />
          </Reveal>
        </Container>
      </div>
      <Contact />
    </>
  );
}
