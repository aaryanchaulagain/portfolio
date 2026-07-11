import { Container, SectionHeading } from "@/components/ui/Section";
import { profile } from "@/data/profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${profile.fullName}'s professional website and contact enquiries.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="section-padding max-w-3xl">
      <SectionHeading
        eyebrow="Legal"
        title="Privacy Policy"
        description="How enquiry information is handled on this website."
      />
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted md:text-base">
        <p>
          This privacy notice explains how {profile.fullName} collects and uses
          information submitted through the contact form on this website.
        </p>
        <p>
          When you send an enquiry, you may provide your name, email address,
          phone number, company details, location, project description, and
          related commercial information. This data is used solely to review
          your request, respond to you, and manage potential project
          conversations.
        </p>
        <p>
          Enquiry records are stored securely and are not sold. Access is limited
          to operational needs for responding to and managing enquiries. Spam
          protection measures such as rate limiting and honeypot fields may be
          used to protect the form.
        </p>
        <p>
          For privacy questions, contact{" "}
          <a
            href={`mailto:${profile.email}`}
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {profile.email}
          </a>
          .
        </p>
        <p className="text-xs text-muted">
          This is a concise professional stub. Expand with jurisdiction-specific
          requirements before public launch if needed.
        </p>
      </div>
    </Container>
  );
}
