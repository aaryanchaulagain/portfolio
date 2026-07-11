import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { footerNavigation } from "@/data/navigation";
import { profile, socialLinks } from "@/data/profile";
import { getServices } from "@/lib/content";
import { getIcon } from "@/lib/icons";

export async function Footer() {
  const services = await getServices();
  const footerServices = services.slice(0, 5);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">
                {profile.fullName}
              </p>
              <p className="mt-1 text-sm text-muted">{profile.title}</p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {profile.brandStatement}
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
              Services
            </p>
            <ul className="space-y-2.5">
              {footerServices.map((service) => (
                <li key={service.id}>
                  <Link
                    href="/services"
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
              Connect
            </p>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => {
                const Icon = getIcon(link.icon);
                const href =
                  link.href.startsWith("[") || link.href.includes("YOUR")
                    ? "#"
                    : link.href;
                return (
                  <li key={link.label}>
                    <a
                      href={href}
                      className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={
                    profile.email.startsWith("[")
                      ? "#"
                      : `mailto:${profile.email}`
                  }
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {profile.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.fullName}. All rights reserved.
          </p>
          <p>Built with care by {profile.fullName}.</p>
        </div>
      </Container>
    </footer>
  );
}
