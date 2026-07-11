import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import {
  ProjectForm,
  type ProjectFormValues,
} from "@/components/admin/ProjectForm";
import { contentImageUrl } from "@/lib/cms";
import { mapProject } from "@/lib/content";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import type { ProjectCaseStudy, ProjectCategory } from "@/types";

export const metadata: Metadata = {
  title: "Edit project",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditProjectPage({ params }: PageProps) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit project" />
        <DatabaseNotice />
      </div>
    );
  }

  const row = await prisma.project.findUnique({
    where: { id },
    include: {
      coverImage: { select: { id: true, updatedAt: true, fileName: true } },
    },
  });

  if (!row) notFound();

  const mapped = mapProject(row);
  const initial: ProjectFormValues = {
    id: row.id,
    title: mapped.title,
    slug: mapped.slug,
    summary: mapped.summary,
    problem: mapped.problem,
    solution: mapped.solution,
    status: mapped.status,
    categories: mapped.category as ProjectCategory[],
    technologies: mapped.technologies,
    features: mapped.features,
    liveUrl: mapped.liveUrl ?? "",
    githubUrl: mapped.githubUrl ?? "",
    caseStudyUrl: mapped.caseStudyUrl ?? "",
    featured: mapped.featured ?? false,
    isPrivateClient: mapped.isPrivateClient ?? false,
    published: row.published,
    sortOrder: row.sortOrder,
    caseStudy: (mapped.caseStudy ?? null) as ProjectCaseStudy | null,
    coverImageUrl: row.coverImage
      ? contentImageUrl(row.coverImage.id, row.coverImage.updatedAt)
      : null,
    coverImageFileName: row.coverImage?.fileName ?? null,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={row.title} />
        <DeleteEntityButton
          endpoint={`/api/admin/projects/${row.id}`}
          label="Project"
          confirmMessage={`Delete project “${row.title}”?`}
          redirectTo="/admin/projects"
        />
      </div>
      <ProjectForm mode="edit" initial={initial} />
    </div>
  );
}

function PageHeader({ title }: { title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Projects
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/admin/projects" className="text-accent hover:underline">
          Back to projects
        </Link>
      </p>
    </div>
  );
}
