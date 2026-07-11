import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/ui/Motion";
import { Container, SectionHeading } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Contact } from "@/components/sections/Contact";
import { getProjectBySlug, getProjects } from "@/lib/content";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  softwareApplicationJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return createPageMetadata({ title: "Project not found", path: "/projects" });
  }
  return createPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

const caseStudySections = [
  { key: "clientProblem", title: "Client problem" },
  { key: "role", title: "My role" },
  { key: "planning", title: "Planning" },
  { key: "solution", title: "Solution" },
  { key: "technology", title: "Technology" },
  { key: "security", title: "Security" },
  { key: "businessResult", title: "Business result" },
  { key: "lessonsLearned", title: "Lessons learned" },
] as const;

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: project.title, path: `/projects/${project.slug}` },
            ]),
            softwareApplicationJsonLd(project),
          ]),
        }}
      />
      <article>
        <div className="border-b border-border">
          <Container className="section-padding">
            <Reveal>
              <Link
                href="/projects"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All projects
              </Link>

              <div className="mb-4 flex flex-wrap gap-2">
                <StatusBadge status={project.status} />
                {project.isPrivateClient ? (
                  <Badge variant="muted">Private client</Badge>
                ) : null}
                {project.category.map((cat) => (
                  <Badge key={cat} variant="default">
                    {cat}
                  </Badge>
                ))}
              </div>

              <SectionHeading title={project.title} description={project.summary} />

              <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-surface-elevated">
                <SmartImage
                  src={project.image}
                  alt={`${project.title} cover`}
                  fill
                  priority
                  sizes="100vw"
                  placeholderLabel="Project cover"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <LinkButton
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    View live
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </LinkButton>
                ) : null}
                {project.githubUrl && !project.githubUrl.includes("[") ? (
                  <LinkButton
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                  >
                    <Code2 className="h-4 w-4" aria-hidden="true" />
                    Source
                  </LinkButton>
                ) : null}
                <LinkButton href="/contact" variant="outline">
                  Start a similar project
                </LinkButton>
              </div>
            </Reveal>
          </Container>
        </div>

        <Container className="section-padding">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.4fr]">
            <Reveal className="space-y-10">
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Overview
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
                  <p>
                    <span className="font-semibold text-foreground">Problem: </span>
                    {project.problem}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Solution: </span>
                    {project.solution}
                  </p>
                </div>
              </section>

              {project.caseStudy ? (
                <section className="space-y-8">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    Case study
                  </h2>
                  {caseStudySections.map((section) => (
                    <div key={section.key}>
                      <h3 className="text-lg font-semibold text-foreground">
                        {section.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                        {project.caseStudy?.[section.key]}
                      </p>
                    </div>
                  ))}
                </section>
              ) : (
                <p className="rounded-2xl border border-dashed border-border bg-surface/50 p-6 text-sm text-muted">
                  A full written case study for this project is not published yet.
                  The overview above covers the problem and solution at a high level.
                </p>
              )}
            </Reveal>

            <Reveal delay={0.1} className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                  Technologies
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li key={tech}>
                      <Badge>{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                  Features
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-sm text-foreground"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </article>
      <Contact />
    </>
  );
}
