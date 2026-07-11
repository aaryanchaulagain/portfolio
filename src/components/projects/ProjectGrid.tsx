"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projectFilters } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { ProjectCategory, ProjectItem } from "@/types";

type FilterId = (typeof projectFilters)[number]["id"];

export function ProjectGrid({ projects }: { projects: ProjectItem[] }) {
  const [active, setActive] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((project) =>
      project.category.includes(active as ProjectCategory),
    );
  }, [active, projects]);

  return (
    <div className="space-y-8">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter projects"
      >
        {projectFilters.map((filter) => {
          const isActive = active === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(filter.id)}
              className={cn(
                "rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:border-accent/30 hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface px-6 py-10 text-center text-muted">
          No projects in this category yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
