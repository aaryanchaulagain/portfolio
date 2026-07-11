import type { Metadata } from "next";
import Link from "next/link";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { AwardForm } from "@/components/admin/AwardForm";
import { isDatabaseConfigured } from "@/lib/database";

export const metadata: Metadata = {
  title: "New award",
  robots: { index: false, follow: false },
};

export default function AdminNewAwardPage() {
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
      <AwardForm mode="create" />
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Awards
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        New award
      </h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/admin/awards" className="text-accent hover:underline">
          Back to awards
        </Link>
      </p>
    </div>
  );
}
