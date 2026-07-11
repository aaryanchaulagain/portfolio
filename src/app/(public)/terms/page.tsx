import { Container, SectionHeading } from "@/components/ui/Section";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${profile.fullName}'s professional portfolio website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="section-padding max-w-3xl">
      <SectionHeading
        eyebrow="Legal"
        title="Terms of Use"
        description="Guidelines for using this portfolio website."
      />
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted md:text-base">
        <p>
          By using this website you agree to review content for informational
          purposes related to professional software and web development services
          offered by {profile.fullName}.
        </p>
        <p>
          Project descriptions, case studies, and portfolio materials may
          summarise work without disclosing confidential client information.
          Private client engagements are labelled accordingly. Do not treat
          placeholder content as verified public claims until personal details
          and outcomes have been finalised for publication.
        </p>
        <p>
          Submitting the contact form does not create a binding contract.
          Engagement terms, scope, fees, and timelines are agreed separately in
          writing before paid work begins.
        </p>
        <p>
          Website content is provided without warranty of uninterrupted
          availability. For questions, contact{" "}
          <a
            href={`mailto:${profile.email}`}
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {profile.email}
          </a>
          .
        </p>
        <p className="text-xs text-muted">
          This is a concise professional stub. Expand with counsel review before
          launch if required for your jurisdiction.
        </p>
      </div>
    </Container>
  );
}
