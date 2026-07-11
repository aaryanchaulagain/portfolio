import Link from "next/link";
import type { EnquiryStatus } from "@prisma/client";
import { ContactRowActions } from "@/components/admin/ContactRowActions";
import { EnquiryStatusBadge } from "@/components/admin/EnquiryStatusBadge";
import { formatDate } from "@/lib/utils";

export type EnquiryListItem = {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  companyName: string | null;
  country: string;
  service: string;
  budgetRange: string;
  status: EnquiryStatus;
  approvalEmailSent: boolean;
  createdAt: Date | string;
};

export function EnquiryTable({
  items,
  showActions = false,
}: {
  items: EnquiryListItem[];
  showActions?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
        No enquiries match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-elevated/50 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3.5 font-medium">Reference</th>
            <th className="px-4 py-3.5 font-medium">Client</th>
            <th className="px-4 py-3.5 font-medium">Service</th>
            <th className="px-4 py-3.5 font-medium">Budget</th>
            <th className="px-4 py-3.5 font-medium">Status</th>
            <th className="px-4 py-3.5 font-medium">Submitted</th>
            {showActions ? (
              <th className="px-4 py-3.5 font-medium">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border/70 last:border-0 hover:bg-surface-elevated/35"
            >
              <td className="px-4 py-3.5 font-mono text-xs">
                <Link
                  href={`/admin/contacts/${item.id}`}
                  className="text-accent hover:underline"
                >
                  {item.referenceNumber}
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <div className="font-medium text-foreground">{item.fullName}</div>
                <div className="text-xs text-muted">{item.email}</div>
                {item.companyName ? (
                  <div className="text-xs text-muted">{item.companyName}</div>
                ) : null}
              </td>
              <td className="px-4 py-3.5">{item.service}</td>
              <td className="px-4 py-3.5">{item.budgetRange}</td>
              <td className="px-4 py-3.5">
                <EnquiryStatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3.5 text-muted">
                {formatDate(item.createdAt)}
              </td>
              {showActions ? (
                <td className="px-4 py-3.5">
                  <ContactRowActions
                    id={item.id}
                    status={item.status}
                    email={item.email}
                    fullName={item.fullName}
                    approvalEmailSent={item.approvalEmailSent}
                  />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
