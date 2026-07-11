import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { EnquiryStatus, type Prisma } from "@prisma/client";
import { EnquiryFilters } from "@/components/admin/EnquiryFilters";
import { EnquiryTable } from "@/components/admin/EnquiryTable";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const metadata: Metadata = {
  title: "Contacts",
  robots: { index: false, follow: false },
};

const STATUS_VALUES = new Set<string>(Object.values(EnquiryStatus));

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    service?: string;
    budget?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  if (!isDatabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm">
        Database is not configured. Set <code>DATABASE_URL</code>, run
        migrations, then refresh this page.
      </div>
    );
  }

  const q = params.q?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const service = params.service?.trim() ?? "";
  const budget = params.budget?.trim() ?? "";
  const from = params.from?.trim() ?? "";
  const to = params.to?.trim() ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const pageSize = 20;

  const where: Prisma.EnquiryWhereInput = {};
  if (status && STATUS_VALUES.has(status)) {
    where.status = status as EnquiryStatus;
  }
  if (service) where.service = service;
  if (budget) where.budgetRange = budget;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { referenceNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  let filteredTotal = 0;
  let items: Awaited<ReturnType<typeof prisma.enquiry.findMany>> = [];

  try {
    [filteredTotal, items] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
  } catch {
    return (
      <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm">
        Could not load contacts. Check your database connection and try again.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));

  function pageHref(nextPage: number) {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (status) next.set("status", status);
    if (service) next.set("service", service);
    if (budget) next.set("budget", budget);
    if (from) next.set("from", from);
    if (to) next.set("to", to);
    if (nextPage > 1) next.set("page", String(nextPage));
    const qs = next.toString();
    return qs ? `/admin/contacts?${qs}` : "/admin/contacts";
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Contacts
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          Project enquiries
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Approve to notify the client by email, or reject requests that are not
          a fit. Open a reference for full details and notes.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted">Loading filters…</div>}>
        <EnquiryFilters />
      </Suspense>

      <EnquiryTable items={items} showActions />

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          Page {page} of {totalPages} · {filteredTotal} result
          {filteredTotal === 1 ? "" : "s"}
        </p>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="rounded-lg border border-border px-3 py-1.5 hover:bg-surface"
            >
              Previous
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="rounded-lg border border-border px-3 py-1.5 hover:bg-surface"
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
