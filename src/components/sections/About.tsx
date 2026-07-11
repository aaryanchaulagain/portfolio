import { Download, MessageSquare } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { experience, howIWork } from "@/data/experience";
import { profile } from "@/data/profile";
import { getSiteMediaUrls } from "@/lib/site-media";

export async function About({ expanded = false }: { expanded?: boolean }) {
  const paragraphs = profile.summary.split("\n\n").filter(Boolean);
  const media = await getSiteMediaUrls();

  return (
    <Section id="about" ariaLabelledby="about-heading" className="bg-surface/40">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              id="about-heading"
              eyebrow="About"
              title={`Hi, I'm ${profile.firstName}`}
              description={profile.yearsExperienceLabel}
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              {(expanded ? paragraphs : paragraphs.slice(0, 2)).map(
                (paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ),
              )}
            </div>

            {expanded ? (
              <div className="mt-8 space-y-4">
                {experience.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border bg-background p-5"
                  >
                    <p className="font-display text-lg font-semibold">
                      {item.role}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {item.organization} · {item.period}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-2 text-sm text-foreground"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton
                href={profile.resumeFilePath}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Resume
              </LinkButton>
              <LinkButton href="/contact" variant="primary">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Discuss Your Project
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
              <div className="relative aspect-[4/3]">
                <SmartImage
                  src={media.about}
                  alt={`${profile.fullName} at work`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholderLabel="Work photo"
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                How I work
              </h3>
              <ol className="mt-5 space-y-4">
                {howIWork.map((step) => (
                  <li
                    key={step.step}
                    className="grid grid-cols-[auto_1fr] gap-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 font-display text-sm font-bold text-accent">
                      {step.step}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
