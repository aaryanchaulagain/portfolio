import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const metadata: Metadata = {
  title: "Services",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <Header />
        <DatabaseNotice />
      </div>
    );
  }

  const rows = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <Header />

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          No services yet. Add the outcomes you offer clients.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      {service.title}
                    </h2>
                    <Badge variant="accent">{service.icon}</Badge>
                    <Badge variant={service.published ? "success" : "warning"}>
                      {service.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {service.outcome}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    sort {service.sortOrder}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton
                  href={`/admin/services/${service.id}`}
                  size="sm"
                  variant="secondary"
                >
                  Edit
                </LinkButton>
                <DeleteEntityButton
                  endpoint={`/api/admin/services/${service.id}`}
                  label="Service"
                  confirmMessage={`Delete service “${service.title}”?`}
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
          Services
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          How you help clients
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Manage service titles, outcomes, images, icons, and publish state.
        </p>
      </div>
      <LinkButton href="/admin/services/new" size="sm">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add service
      </LinkButton>
    </div>
  );
}
