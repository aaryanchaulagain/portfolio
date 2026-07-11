import Link from "next/link";
import type { Metadata } from "next";
import { EnquiryStatus } from "@prisma/client";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Code2,
  FolderKanban,
  ImageIcon,
  Mail,
  MessageSquareQuote,
} from "lucide-react";
import { EnquiryStatusBadge } from "@/components/admin/EnquiryStatusBadge";
import { StatsCards } from "@/components/admin/StatsCards";
import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/data/profile";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  let stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    thisMonth: 0,
  };
  let recent: Array<{
    id: string;
    referenceNumber: string;
    fullName: string;
    email: string;
    service: string;
    status: EnquiryStatus;
    createdAt: Date;
  }> = [];
  let dbReady = isDatabaseConfigured();
  let projectCount = 0;
  let awardCount = 0;
  let serviceCount = 0;
  let skillCount = 0;
  let skillCategoryCount = 0;
  let testimonialCount = 0;

  if (dbReady) {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const [
        total,
        pending,
        approved,
        rejected,
        thisMonth,
        items,
        projects,
        awards,
        services,
        skills,
        categories,
        testimonials,
      ] = await Promise.all([
        prisma.enquiry.count(),
        prisma.enquiry.count({ where: { status: EnquiryStatus.PENDING } }),
        prisma.enquiry.count({ where: { status: EnquiryStatus.APPROVED } }),
        prisma.enquiry.count({ where: { status: EnquiryStatus.REJECTED } }),
        prisma.enquiry.count({ where: { createdAt: { gte: monthStart } } }),
        prisma.enquiry.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            referenceNumber: true,
            fullName: true,
            email: true,
            service: true,
            status: true,
            createdAt: true,
          },
        }),
        prisma.project.count(),
        prisma.award.count(),
        prisma.service.count(),
        prisma.skill.count(),
        prisma.skillCategory.count(),
        prisma.testimonial.count(),
      ]);
      stats = { total, pending, approved, rejected, thisMonth };
      recent = items;
      projectCount = projects;
      awardCount = awards;
      serviceCount = services;
      skillCount = skills;
      skillCategoryCount = categories;
      testimonialCount = testimonials;
    } catch {
      dbReady = false;
    }
  }

  const contentCards = [
    {
      href: "/admin/contacts",
      title: "Contacts",
      value: dbReady ? String(stats.pending) : "—",
      detail: "Pending enquiries to review",
      icon: Mail,
    },
    {
      href: "/admin/images",
      title: "Images",
      value: "2",
      detail: "Home hero & About photos",
      icon: ImageIcon,
    },
    {
      href: "/admin/services",
      title: "Services",
      value: dbReady ? String(serviceCount) : "—",
      detail: "Published service offers",
      icon: Briefcase,
    },
    {
      href: "/admin/testimonials",
      title: "Testimonials",
      value: dbReady ? String(testimonialCount) : "—",
      detail: "Client quotes and photos",
      icon: MessageSquareQuote,
    },
    {
      href: "/admin/projects",
      title: "Projects",
      value: dbReady ? String(projectCount) : "—",
      detail: "Projects shipped on the site",
      icon: FolderKanban,
    },
    {
      href: "/admin/skills",
      title: "Skills",
      value: dbReady ? String(skillCount) : "—",
      detail: dbReady
        ? `${skillCategoryCount} skill categories`
        : "Skill categories",
      icon: Code2,
    },
    {
      href: "/admin/awards",
      title: "Awards",
      value: dbReady ? String(awardCount) : "—",
      detail: "Hackathon and award entries",
      icon: Award,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <div className="pointer-events-none absolute inset-0 grid-atmosphere opacity-60" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ambient-glow blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Overview
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {profile.firstName}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Manage enquiries, review portfolio content, and keep your public
              profile aligned with the work you want to attract.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/admin/contacts">Review contacts</LinkButton>
            <LinkButton href="/" variant="secondary">
              View live site
            </LinkButton>
          </div>
        </div>
      </section>

      {dbReady ? <StatsCards stats={stats} /> : (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-5 text-sm text-muted">
          Database is not connected. Contact stats will appear after{" "}
          <code className="text-foreground">DATABASE_URL</code> is configured.
        </div>
      )}

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Workspace
            </h2>
            <p className="mt-1 text-sm text-muted">
              Jump into each content area from the sidebar or these cards.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {contentCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-2xl border border-border bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-elevated"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-xl bg-accent/10 p-2.5 text-accent ring-1 ring-accent/20">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-accent" />
                </div>
                <p className="mt-4 text-sm font-medium text-muted">{card.title}</p>
                <p className="mt-1 font-display text-3xl font-semibold tracking-tight">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-muted">{card.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Recent contacts
            </h2>
            <p className="mt-1 text-sm text-muted">
              Latest enquiries waiting for your attention.
            </p>
          </div>
          <Link
            href="/admin/contacts"
            className="text-sm font-medium text-accent hover:underline"
          >
            Open contacts
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">
              No enquiries yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/contacts/${item.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-surface-elevated/40"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {item.fullName}
                      </p>
                      <p className="text-xs text-muted">
                        {item.referenceNumber} · {item.service} · {item.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <EnquiryStatusBadge status={item.status} />
                      <span className="text-xs text-muted">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
