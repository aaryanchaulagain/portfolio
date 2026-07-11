import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { getAwards } from "@/lib/content";

export async function Awards() {
  const awards = await getAwards();

  return (
    <Section id="awards" ariaLabelledby="awards-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="awards-heading"
            eyebrow="Recognition"
            title="Awards and Hackathon Recognition"
            description="Official titles and organisers are kept editable until certificate wording is confirmed. Replace placeholders with exact official language before publishing."
          />
        </Reveal>

        <div className="relative mt-12 space-y-8 before:absolute before:left-[1.15rem] before:top-3 before:bottom-3 before:w-px before:bg-border md:before:left-1/2 md:before:-translate-x-px">
          {awards.map((award, index) => (
            <Reveal key={award.id} delay={index * 0.08}>
              <article className="relative grid gap-6 md:grid-cols-2 md:gap-12">
                <div
                  className={`pl-12 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:order-2 md:pl-12"
                  }`}
                >
                  <span
                    className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-xs font-bold text-accent md:left-1/2 md:-translate-x-1/2"
                    aria-hidden="true"
                  >
                    {award.year}
                  </span>
                  <Badge variant="accent" className="mb-3">
                    {award.organizer}
                  </Badge>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {award.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    Project: {award.projectName}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {award.description}
                  </p>
                  {award.verificationLink &&
                  !award.verificationLink.includes("[") ? (
                    <a
                      href={award.verificationLink}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify award
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="mt-4 text-xs text-muted">
                      Verification link placeholder — add official URL when available.
                    </p>
                  )}
                </div>

                <div
                  className={`grid grid-cols-2 gap-3 pl-12 md:pl-0 ${
                    index % 2 === 0 ? "md:pl-12" : "md:order-1 md:pr-12"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
                    <SmartImage
                      src={award.eventImage}
                      alt={`${award.title} event`}
                      fill
                      sizes="200px"
                      placeholderLabel="Event"
                    />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
                    <SmartImage
                      src={award.certificateImage}
                      alt={`${award.title} certificate`}
                      fill
                      sizes="200px"
                      placeholderLabel="Certificate"
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
