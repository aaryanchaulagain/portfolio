import type { Metadata } from "next";
import Link from "next/link";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { isDatabaseConfigured } from "@/lib/database";

export const metadata: Metadata = {
  title: "New service",
  robots: { index: false, follow: false },
};

export default function AdminNewServicePage() {
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
      <ServiceForm mode="create" />
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Services
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        New service
      </h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/admin/services" className="text-accent hover:underline">
          Back to services
        </Link>
      </p>
    </div>
  );
}
