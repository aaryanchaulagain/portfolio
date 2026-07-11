import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminToastProvider } from "@/components/admin/AdminToast";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const isLogin = !session?.user;

  if (isLogin) {
    return (
      <AdminProviders session={session}>
        <div className="min-h-screen bg-background">{children}</div>
      </AdminProviders>
    );
  }

  return (
    <AdminProviders session={session}>
      <AdminToastProvider>
        <div className="min-h-screen bg-background lg:flex">
          <AdminSidebar email={session.user.email} />
          <div className="min-w-0 flex-1">
            <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
              {children}
            </main>
          </div>
        </div>
      </AdminToastProvider>
    </AdminProviders>
  );
}
