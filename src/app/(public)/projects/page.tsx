import { Contact } from "@/components/sections/Contact";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Reveal } from "@/components/ui/Motion";
import { Container, SectionHeading } from "@/components/ui/Section";
import { getProjects } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "Browse shipped client work, prototypes, and product concepts — filtered by category.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <div className="border-b border-border">
        <Container className="section-padding">
          <Reveal>
            <SectionHeading
              eyebrow="Portfolio"
              title="Projects Shipped"
              description="Explore client deliveries, web applications, e-commerce builds, AI prototypes, and hackathon concepts. Private client engagements are clearly labelled."
            />
          </Reveal>
          <div className="mt-12">
            <ProjectGrid projects={projects} />
          </div>
        </Container>
      </div>
      <Contact />
    </>
  );
}
