import type { Metadata } from "next";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import {
  SkillsManager,
  type AdminSkillCategory,
} from "@/components/admin/SkillsManager";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import type { SkillLevel } from "@/types";

export const metadata: Metadata = {
  title: "Skills",
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-6">
        <Header />
        <DatabaseNotice />
      </div>
    );
  }

  const rows = await prisma.skillCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      skills: { orderBy: { sortOrder: "asc" } },
    },
  });

  const categories: AdminSkillCategory[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    sortOrder: row.sortOrder,
    skills: row.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      level: skill.level as SkillLevel,
      sortOrder: skill.sortOrder,
      categoryId: skill.categoryId,
    })),
  }));

  return (
    <div className="space-y-6">
      <Header />
      <SkillsManager initialCategories={categories} />
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Skills
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        Technical and business skills
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Manage categories and skills with Core, Experienced, or Working levels.
      </p>
    </div>
  );
}
