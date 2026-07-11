import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const metadata: Metadata = {
  title: "Awards",
  robots: { index: false, follow: false },
};

export default async function AdminAwardsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <Header />
        <DatabaseNotice />
      </div>
    );
  }

  const rows = await prisma.award.findMany({
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    include: {
      certificateImage: { select: { id: true } },
      eventImage: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-6">
      <Header />

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          No awards yet. Add recognition and attach certificate photos.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((award) => (
            <article
              key={award.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      {award.title}
                    </h2>
                    <span className="text-sm font-medium text-accent">
                      {award.year}
                    </span>
                    <Badge variant={award.published ? "success" : "warning"}>
                      {award.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{award.organizer}</p>
                  <p className="mt-2 max-w-3xl text-sm text-muted">
                    {award.description}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    sort {award.sortOrder} · certificate{" "}
                    {award.certificateImage ? "set" : "missing"} · event{" "}
                    {award.eventImage ? "set" : "missing"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <LinkButton
                    href={`/admin/awards/${award.id}`}
                    size="sm"
                    variant="secondary"
                  >
                    Edit
                  </LinkButton>
                  <DeleteEntityButton
                    endpoint={`/api/admin/awards/${award.id}`}
                    label="Award"
                    confirmMessage={`Delete award “${award.title}”?`}
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
          Awards
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          Hackathons and recognition
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Manage award copy and upload certificate or event images.
        </p>
      </div>
      <LinkButton href="/admin/awards/new" size="sm">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add award
      </LinkButton>
    </div>
  );
}
