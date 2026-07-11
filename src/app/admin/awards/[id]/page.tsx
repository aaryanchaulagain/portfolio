import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AwardForm, type AwardFormValues } from "@/components/admin/AwardForm";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { contentImageUrl } from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const metadata: Metadata = {
  title: "Edit award",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditAwardPage({ params }: PageProps) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit award" />
        <DatabaseNotice />
      </div>
    );
  }

  const row = await prisma.award.findUnique({
    where: { id },
    include: {
      certificateImage: {
        select: { id: true, updatedAt: true, fileName: true },
      },
      eventImage: { select: { id: true, updatedAt: true, fileName: true } },
    },
  });

  if (!row) notFound();

  const initial: AwardFormValues = {
    id: row.id,
    title: row.title,
    organizer: row.organizer,
    year: row.year,
    description: row.description,
    projectName: row.projectName,
    verificationLink: row.verificationLink,
    sortOrder: row.sortOrder,
    published: row.published,
    certificateImageUrl: row.certificateImage
      ? contentImageUrl(row.certificateImage.id, row.certificateImage.updatedAt)
      : null,
    eventImageUrl: row.eventImage
      ? contentImageUrl(row.eventImage.id, row.eventImage.updatedAt)
      : null,
    certificateImageFileName: row.certificateImage?.fileName ?? null,
    eventImageFileName: row.eventImage?.fileName ?? null,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={row.title} />
        <DeleteEntityButton
          endpoint={`/api/admin/awards/${row.id}`}
          label="Award"
          confirmMessage={`Delete award “${row.title}”?`}
          redirectTo="/admin/awards"
        />
      </div>
      <AwardForm mode="edit" initial={initial} />
    </div>
  );
}

function PageHeader({ title }: { title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Awards
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/admin/awards" className="text-accent hover:underline">
          Back to awards
        </Link>
      </p>
    </div>
  );
}
