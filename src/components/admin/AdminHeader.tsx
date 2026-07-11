import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function AdminHeader({ email }: { email?: string | null }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-display text-sm font-semibold tracking-tight text-foreground"
          >
            Enquiry Admin
          </Link>
          <Link
            href="/"
            className="text-xs text-muted hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            View site
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {email ? (
            <span className="hidden text-xs text-muted sm:inline">{email}</span>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
