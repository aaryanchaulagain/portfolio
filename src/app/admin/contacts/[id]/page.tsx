import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EnquiryActions } from "@/components/admin/EnquiryActions";
import { EnquiryStatusBadge } from "@/components/admin/EnquiryStatusBadge";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact detail",
  robots: { index: false, follow: false },
};

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm">
        Database is not configured.
      </div>
    );
  }

  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!enquiry) notFound();

  const fields: Array<{ label: string; value: string }> = [
    { label: "Reference", value: enquiry.referenceNumber },
    { label: "Full name", value: enquiry.fullName },
    { label: "Email", value: enquiry.email },
    { label: "Phone", value: enquiry.phone || "—" },
    { label: "Company", value: enquiry.companyName || "—" },
    { label: "Country", value: enquiry.country },
    { label: "Service", value: enquiry.service },
    { label: "Budget", value: enquiry.budgetRange },
    { label: "Timeline", value: enquiry.timeline },
    { label: "Submitted", value: formatDate(enquiry.createdAt) },
    {
      label: "Approved",
      value: enquiry.approvedAt ? formatDate(enquiry.approvedAt) : "—",
    },
    {
      label: "Contacted",
      value: enquiry.contactedAt ? formatDate(enquiry.contactedAt) : "—",
    },
    {
      label: "Confirmation email",
      value: enquiry.confirmationEmailSent ? "Sent" : "Not sent",
    },
    {
      label: "Approval email",
      value: enquiry.approvalEmailSent ? "Sent" : "Not sent",
    },
    {
      label: "Email delivery",
      value: enquiry.emailDeliveryStatus || "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/contacts"
            className="text-xs font-medium text-muted hover:text-foreground"
          >
            ← Back to contacts
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            {enquiry.referenceNumber}
          </h1>
          <div className="mt-2">
            <EnquiryStatusBadge status={enquiry.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Details</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {field.label}
                </dt>
                <dd className="mt-0.5 text-sm break-words">{field.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="text-xs uppercase tracking-wide text-muted">
              Project description
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {enquiry.projectDescription}
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Actions</h2>
          <EnquiryActions enquiry={enquiry} />
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Activity history</h2>
        {enquiry.activities.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No activity recorded yet.</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {enquiry.activities.map((activity) => (
              <li
                key={activity.id}
                className="border-b border-border/60 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{activity.action}</span>
                  <span className="text-xs text-muted">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>
                {activity.detail ? (
                  <p className="mt-1 text-sm text-muted">{activity.detail}</p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
