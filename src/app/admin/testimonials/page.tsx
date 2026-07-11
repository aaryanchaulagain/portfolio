import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { contentImageUrl } from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <Header />
        <DatabaseNotice />
      </div>
    );
  }

  const rows = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      photo: { select: { id: true, updatedAt: true } },
    },
  });

  return (
    <div className="space-y-6">
      <Header />

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          No testimonials yet. Add a name, quote, and optional photo.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-surface-elevated">
                  {item.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={contentImageUrl(item.photo.id, item.photo.updatedAt)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-accent">
                      {item.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      {item.name}
                    </h2>
                    <Badge variant={item.published ? "success" : "warning"}>
                      {item.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  {item.roleOrCompany ? (
                    <p className="mt-1 text-sm text-muted">{item.roleOrCompany}</p>
                  ) : null}
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {item.quote}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    sort {item.sortOrder} · photo {item.photo ? "set" : "missing"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton
                  href={`/admin/testimonials/${item.id}`}
                  size="sm"
                  variant="secondary"
                >
                  Edit
                </LinkButton>
                <DeleteEntityButton
                  endpoint={`/api/admin/testimonials/${item.id}`}
                  label="Testimonial"
                  confirmMessage={`Delete testimonial from “${item.name}”?`}
                />
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
          Testimonials
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          Client feedback
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Manage name, quote, photo, and publish state for the public testimonials
          page.
        </p>
      </div>
      <LinkButton href="/admin/testimonials/new" size="sm">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add testimonial
      </LinkButton>
    </div>
  );
}
