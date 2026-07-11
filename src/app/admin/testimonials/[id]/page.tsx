import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import {
  TestimonialForm,
  type TestimonialFormValues,
} from "@/components/admin/TestimonialForm";
import { contentImageUrl } from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const metadata: Metadata = {
  title: "Edit testimonial",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditTestimonialPage({ params }: PageProps) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit testimonial" />
        <DatabaseNotice />
      </div>
    );
  }

  const row = await prisma.testimonial.findUnique({
    where: { id },
    include: {
      photo: { select: { id: true, updatedAt: true, fileName: true } },
    },
  });
  if (!row) notFound();

  const initial: TestimonialFormValues = {
    id: row.id,
    name: row.name,
    roleOrCompany: row.roleOrCompany,
    quote: row.quote,
    sortOrder: row.sortOrder,
    published: row.published,
    photoUrl: row.photo
      ? contentImageUrl(row.photo.id, row.photo.updatedAt)
      : null,
    photoFileName: row.photo?.fileName ?? null,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={row.name} />
        <DeleteEntityButton
          endpoint={`/api/admin/testimonials/${row.id}`}
          label="Testimonial"
          confirmMessage={`Delete testimonial from “${row.name}”?`}
          redirectTo="/admin/testimonials"
        />
      </div>
      <TestimonialForm mode="edit" initial={initial} />
    </div>
  );
}

function PageHeader({ title }: { title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Testimonials
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/admin/testimonials" className="text-accent hover:underline">
          Back to testimonials
        </Link>
      </p>
    </div>
  );
}
