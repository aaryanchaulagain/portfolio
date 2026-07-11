import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl?.startsWith("/admin") &&
    !params.callbackUrl.startsWith("/admin/login")
      ? params.callbackUrl
      : "/admin";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Access is limited to the configured administrator account.
        </p>
        <div className="mt-6">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
