import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import {
  ServiceForm,
  type ServiceFormValues,
} from "@/components/admin/ServiceForm";
import { contentImageUrl } from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const metadata: Metadata = {
  title: "Edit service",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditServicePage({ params }: PageProps) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit service" />
        <DatabaseNotice />
      </div>
    );
  }

  const row = await prisma.service.findUnique({
    where: { id },
    include: {
      coverImage: { select: { id: true, updatedAt: true, fileName: true } },
    },
  });
  if (!row) notFound();

  const initial: ServiceFormValues = {
    id: row.id,
    title: row.title,
    outcome: row.outcome,
    icon: row.icon,
    sortOrder: row.sortOrder,
    published: row.published,
    imageUrl: row.imageUrl,
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
          endpoint={`/api/admin/services/${row.id}`}
          label="Service"
          confirmMessage={`Delete service “${row.title}”?`}
          redirectTo="/admin/services"
        />
      </div>
      <ServiceForm mode="edit" initial={initial} />
    </div>
  );
}

function PageHeader({ title }: { title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Services
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/admin/services" className="text-accent hover:underline">
          Back to services
        </Link>
      </p>
    </div>
  );
}
