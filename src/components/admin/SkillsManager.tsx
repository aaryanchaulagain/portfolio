"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { SKILL_LEVELS } from "@/lib/cms";
import type { SkillLevel } from "@/types";

export type AdminSkill = {
  id: string;
  name: string;
  level: SkillLevel;
  sortOrder: number;
  categoryId: string;
};

export type AdminSkillCategory = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  skills: AdminSkill[];
};

const levelLabels: Record<SkillLevel, string> = {
  core: "Core",
  experienced: "Experienced",
  working: "Working",
};

export function SkillsManager({
  initialCategories,
}: {
  initialCategories: AdminSkillCategory[];
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [categories, setCategories] = useState(initialCategories);

  const [catTitle, setCatTitle] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catSortOrder, setCatSortOrder] = useState("0");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [newSkillName, setNewSkillName] = useState<Record<string, string>>({});
  const [newSkillLevel, setNewSkillLevel] = useState<Record<string, SkillLevel>>(
    {},
  );
  const [pendingSkill, setPendingSkill] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  function syncFromServer() {
    router.refresh();
  }

  async function createCategory(event: FormEvent) {
    event.preventDefault();
    setCreatingCategory(true);
    try {
      const response = await fetch("/api/admin/skill-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: catTitle.trim(),
          description: catDescription.trim(),
          sortOrder: Number(catSortOrder) || 0,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        item?: AdminSkillCategory;
      } | null;

      if (!response.ok || !payload?.success || !payload.item) {
        throw new Error(payload?.error ?? "Could not create category.");
      }

      setCategories((current) => [
        ...current,
        { ...payload.item!, skills: payload.item!.skills ?? [] },
      ]);
      setCatTitle("");
      setCatDescription("");
      setCatSortOrder("0");
      showToast({
        title: "Category created",
        description: "You can add skills below.",
        variant: "success",
      });
      syncFromServer();
    } catch (error) {
      showToast({
        title: "Create failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setCreatingCategory(false);
    }
  }

  async function deleteCategory(id: string, title: string) {
    if (!window.confirm(`Delete category “${title}” and all its skills?`)) {
      return;
    }
    setPendingDelete(`category:${id}`);
    try {
      const response = await fetch(`/api/admin/skill-categories/${id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Could not delete category.");
      }
      setCategories((current) => current.filter((item) => item.id !== id));
      showToast({
        title: "Category deleted",
        description: "Category and skills were removed.",
        variant: "success",
      });
      syncFromServer();
    } catch (error) {
      showToast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPendingDelete(null);
    }
  }

  async function addSkill(categoryId: string) {
    const name = (newSkillName[categoryId] ?? "").trim();
    const level = newSkillLevel[categoryId] ?? "working";
    if (!name) {
      showToast({
        title: "Name required",
        description: "Enter a skill name.",
        variant: "error",
      });
      return;
    }

    setPendingSkill(categoryId);
    try {
      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, name, level }),
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        item?: AdminSkill;
      } | null;

      if (!response.ok || !payload?.success || !payload.item) {
        throw new Error(payload?.error ?? "Could not add skill.");
      }

      setCategories((current) =>
        current.map((category) =>
          category.id === categoryId
            ? { ...category, skills: [...category.skills, payload.item!] }
            : category,
        ),
      );
      setNewSkillName((current) => ({ ...current, [categoryId]: "" }));
      showToast({
        title: "Skill added",
        description: `${payload.item.name} was added.`,
        variant: "success",
      });
      syncFromServer();
    } catch (error) {
      showToast({
        title: "Add failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPendingSkill(null);
    }
  }

  async function updateSkill(
    skill: AdminSkill,
    patch: { name?: string; level?: SkillLevel },
  ) {
    try {
      const response = await fetch(`/api/admin/skills/${skill.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        item?: AdminSkill;
      } | null;

      if (!response.ok || !payload?.success || !payload.item) {
        throw new Error(payload?.error ?? "Could not update skill.");
      }

      setCategories((current) =>
        current.map((category) =>
          category.id === skill.categoryId
            ? {
                ...category,
                skills: category.skills.map((item) =>
                  item.id === skill.id ? payload.item! : item,
                ),
              }
            : category,
        ),
      );
      showToast({
        title: "Skill updated",
        description: "Changes are saved.",
        variant: "success",
      });
      syncFromServer();
    } catch (error) {
      showToast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    }
  }

  async function deleteSkill(skill: AdminSkill) {
    if (!window.confirm(`Delete skill “${skill.name}”?`)) return;
    setPendingDelete(`skill:${skill.id}`);
    try {
      const response = await fetch(`/api/admin/skills/${skill.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Could not delete skill.");
      }
      setCategories((current) =>
        current.map((category) =>
          category.id === skill.categoryId
            ? {
                ...category,
                skills: category.skills.filter((item) => item.id !== skill.id),
              }
            : category,
        ),
      );
      showToast({
        title: "Skill deleted",
        description: "The skill was removed.",
        variant: "success",
      });
      syncFromServer();
    } catch (error) {
      showToast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={createCategory}
        className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-soft"
      >
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Add category
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Title"
            name="categoryTitle"
            required
            value={catTitle}
            onChange={(event) => setCatTitle(event.target.value)}
          />
          <Input
            label="Sort order"
            name="categorySortOrder"
            type="number"
            min={0}
            max={10000}
            value={catSortOrder}
            onChange={(event) => setCatSortOrder(event.target.value)}
          />
        </div>
        <Textarea
          label="Description"
          name="categoryDescription"
          required
          value={catDescription}
          onChange={(event) => setCatDescription(event.target.value)}
          className="min-h-24"
        />
        <Button type="submit" size="sm" disabled={creatingCategory}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {creatingCategory ? "Creating…" : "Add category"}
        </Button>
      </form>

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          No skill categories yet. Add one above.
        </p>
      ) : null}

      <div className="space-y-4">
        {categories.map((category) => (
          <section
            key={category.id}
            className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  {category.title}
                </h2>
                <p className="mt-1 text-sm text-muted">{category.description}</p>
                <Badge variant="muted" className="mt-2">
                  Sort {category.sortOrder}
                </Badge>
              </div>
              <Button
                type="button"
                size="sm"
                variant="danger"
                disabled={pendingDelete === `category:${category.id}`}
                onClick={() => void deleteCategory(category.id, category.title)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
            </div>

            <ul className="mt-4 space-y-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-background/40 px-3 py-2"
                >
                  <input
                    aria-label={`${skill.name} name`}
                    className="h-9 min-w-[10rem] flex-1 rounded-lg border border-border bg-background px-2 text-sm outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
                    defaultValue={skill.name}
                    onBlur={(event) => {
                      const next = event.target.value.trim();
                      if (next && next !== skill.name) {
                        void updateSkill(skill, { name: next });
                      } else {
                        event.target.value = skill.name;
                      }
                    }}
                  />
                  <select
                    aria-label={`${skill.name} level`}
                    className="h-9 rounded-lg border border-border bg-background px-2 text-sm outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
                    value={skill.level}
                    onChange={(event) =>
                      void updateSkill(skill, {
                        level: event.target.value as SkillLevel,
                      })
                    }
                  >
                    {SKILL_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {levelLabels[level]}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={pendingDelete === `skill:${skill.id}`}
                    onClick={() => void deleteSkill(skill)}
                    aria-label={`Delete ${skill.name}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-border pt-4">
              <div className="min-w-[12rem] flex-1">
                <Input
                  label="New skill"
                  name={`skill-${category.id}`}
                  value={newSkillName[category.id] ?? ""}
                  onChange={(event) =>
                    setNewSkillName((current) => ({
                      ...current,
                      [category.id]: event.target.value,
                    }))
                  }
                  placeholder="Skill name"
                />
              </div>
              <div className="w-40">
                <Select
                  label="Level"
                  name={`level-${category.id}`}
                  value={newSkillLevel[category.id] ?? "working"}
                  onChange={(event) =>
                    setNewSkillLevel((current) => ({
                      ...current,
                      [category.id]: event.target.value as SkillLevel,
                    }))
                  }
                >
                  {SKILL_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {levelLabels[level]}
                    </option>
                  ))}
                </Select>
              </div>
              <Button
                type="button"
                size="sm"
                disabled={pendingSkill === category.id}
                onClick={() => void addSkill(category.id)}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {pendingSkill === category.id ? "Adding…" : "Add skill"}
              </Button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
