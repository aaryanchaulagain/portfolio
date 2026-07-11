import type { Metadata } from "next";
import Link from "next/link";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { isDatabaseConfigured } from "@/lib/database";

export const metadata: Metadata = {
  title: "New project",
  robots: { index: false, follow: false },
};

export default function AdminNewProjectPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <DatabaseNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader />
      <ProjectForm mode="create" />
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Projects
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        New project
      </h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/admin/projects" className="text-accent hover:underline">
          Back to projects
        </Link>
      </p>
    </div>
  );
}
