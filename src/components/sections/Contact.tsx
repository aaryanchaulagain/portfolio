import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { profile, socialLinks } from "@/data/profile";
import { getIcon } from "@/lib/icons";

export function Contact() {
  return (
    <Section
      id="contact"
      ariaLabelledby="contact-heading"
      className="bg-surface/40"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              id="contact-heading"
              eyebrow="Contact"
              title="Let's discuss your project"
              description="Share a little about your goals and constraints. I'll review your enquiry and respond with next steps."
            />

            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-start gap-3 text-sm transition-colors hover:text-accent"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-medium text-foreground">
                      Email
                    </span>
                    <span className="text-muted">{profile.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={profile.phoneOrWhatsApp}
                  className="inline-flex items-start gap-3 text-sm transition-colors hover:text-accent"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-medium text-foreground">
                      Phone / WhatsApp
                    </span>
                    <span className="text-muted">{profile.phoneOrWhatsApp}</span>
                  </span>
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-sm">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium text-foreground">
                    Location
                  </span>
                  <span className="text-muted">
                    {profile.location} · {profile.serviceRegion}
                  </span>
                </span>
              </li>
              <li className="inline-flex items-start gap-3 text-sm">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium text-foreground">
                    Availability
                  </span>
                  <span className="text-muted">{profile.availabilityLabel}</span>
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = getIcon(link.icon);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    aria-label={link.label}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative rounded-2xl border border-border bg-background p-6 shadow-soft md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
