import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ProjectItem } from "@/types";

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Card hover className="flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-elevated">
        <SmartImage
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholderLabel="Project visual"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <CardHeader className="mb-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {project.isPrivateClient ? (
              <Badge variant="muted">Private client</Badge>
            ) : null}
          </div>
          <CardTitle className="font-display text-xl">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-accent"
            >
              {project.title}
            </Link>
          </CardTitle>
          <CardDescription>{project.summary}</CardDescription>
        </CardHeader>

        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-secondary"
          >
            View case study
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
