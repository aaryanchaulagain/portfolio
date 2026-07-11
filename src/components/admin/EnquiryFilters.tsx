"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { budgetOptions, serviceOptions } from "@/lib/validation";

const statuses = [
  "",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CONTACTED",
  "CLOSED",
  "SPAM",
] as const;

export function EnquiryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();
    for (const key of ["q", "status", "service", "budget", "from", "to"] as const) {
      const value = String(formData.get(key) ?? "").trim();
      if (value) params.set(key, value);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const exportHref = `/api/export?${searchParams.toString()}`;

  return (
    <form
      className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-soft"
      action={applyFilters}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Search"
          name="q"
          placeholder="Name, email, company, reference"
          defaultValue={searchParams.get("q") ?? ""}
        />
        <Select
          label="Status"
          name="status"
          defaultValue={searchParams.get("status") ?? ""}
        >
          <option value="">All statuses</option>
          {statuses.filter(Boolean).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Select
          label="Service"
          name="service"
          defaultValue={searchParams.get("service") ?? ""}
        >
          <option value="">All services</option>
          {serviceOptions.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </Select>
        <Select
          label="Budget"
          name="budget"
          defaultValue={searchParams.get("budget") ?? ""}
        >
          <option value="">All budgets</option>
          {budgetOptions.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </Select>
        <Input
          label="From"
          name="from"
          type="date"
          defaultValue={searchParams.get("from") ?? ""}
        />
        <Input
          label="To"
          name="to"
          type="date"
          defaultValue={searchParams.get("to") ?? ""}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Filtering…" : "Apply filters"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={clearFilters}
          disabled={pending}
        >
          Clear
        </Button>
        <Link
          href={exportHref}
          className="inline-flex h-9 items-center rounded-xl border border-border bg-surface px-3 text-sm font-semibold hover:bg-surface-elevated"
        >
          Export CSV
        </Link>
      </div>
    </form>
  );
}
