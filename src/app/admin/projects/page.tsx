import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import type { ProjectStatus } from "@/types";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <Header />
        <DatabaseNotice />
      </div>
    );
  }

  const rows = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: {
      coverImage: { select: { id: true, updatedAt: true } },
    },
  });

  return (
    <div className="space-y-6">
      <Header />

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          No projects yet. Create your first project to manage portfolio CMS
          content.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      {project.title}
                    </h2>
                    <StatusBadge status={project.status as ProjectStatus} />
                    <Badge variant={project.published ? "success" : "warning"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm text-muted">
                    {project.summary}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    /{project.slug} · sort {project.sortOrder} ·{" "}
                    {project.coverImage ? "cover set" : "no cover"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <LinkButton
                    href={`/admin/projects/${project.id}`}
                    size="sm"
                    variant="secondary"
                  >
                    Edit
                  </LinkButton>
                  {project.published ? (
                    <LinkButton
                      href={`/projects/${project.slug}`}
                      size="sm"
                      variant="ghost"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </LinkButton>
                  ) : null}
                  <DeleteEntityButton
                    endpoint={`/api/admin/projects/${project.id}`}
                    label="Project"
                    confirmMessage={`Delete project “${project.title}”?`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Projects
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          Portfolio projects
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Create, edit, publish, and attach cover images for case studies.
        </p>
      </div>
      <LinkButton href="/admin/projects/new" size="sm">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add project
      </LinkButton>
    </div>
  );
}
