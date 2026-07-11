import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getFeaturedProject, getProjects } from "@/lib/content";

export async function Projects() {
  const [featured, allProjects] = await Promise.all([
    getFeaturedProject(),
    getProjects(),
  ]);
  const homepageProjects = allProjects.slice(0, 6);

  return (
    <Section
      id="projects"
      ariaLabelledby="projects-heading"
      className="bg-surface/40"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="projects-heading"
            eyebrow="Portfolio"
            title="Projects Shipped"
            description="Selected client deliveries, prototypes, and product concepts. Private client work is labelled carefully — confidential details stay out of public view."
          />
        </Reveal>

        {featured?.caseStudy ? (
          <Reveal delay={0.08}>
            <aside className="mt-10 rounded-2xl border border-border bg-background p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">Featured case study</Badge>
                {featured.isPrivateClient ? (
                  <Badge variant="muted">Private client</Badge>
                ) : null}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
                {featured.caseStudy.clientProblem}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                <span className="font-semibold text-foreground">Approach: </span>
                {featured.caseStudy.solution}
              </p>
              <Link
                href={`/projects/${featured.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
              >
                Read full case study
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          </Reveal>
        ) : null}

        <div className="mt-12">
          <ProjectGrid projects={homepageProjects} />
        </div>

        <div className="mt-10 flex justify-center">
          <LinkButton href="/projects" variant="secondary">
            View all projects
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
