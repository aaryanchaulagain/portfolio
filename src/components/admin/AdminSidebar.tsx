"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  Code2,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquareQuote,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/images", label: "Images", icon: ImageIcon },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/awards", label: "Awards", icon: Award },
] as const;

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {navItems.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent/15 text-accent ring-1 ring-accent/25"
                : "text-muted hover:bg-surface-elevated hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo showWordmark={false} size={36} />
          <span className="font-display text-sm font-semibold">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-b border-border bg-surface p-4 lg:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
            <p className="truncate text-xs text-muted">{email}</p>
            <LogoutButton />
          </div>
        </div>
      ) : null}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <Logo showWordmark={false} size={40} priority={false} />
          <div className="min-w-0">
            <p className="font-display truncate text-sm font-semibold tracking-tight">
              {profile.fullName}
            </p>
            <p className="truncate text-xs text-muted">Admin console</p>
          </div>
        </div>

        <div className="flex-1 px-3 py-4">
          <NavLinks pathname={pathname} />
        </div>

        <div className="space-y-3 border-t border-border px-4 py-4">
          <p className="truncate text-xs text-muted">{email}</p>
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-accent hover:underline"
            >
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
