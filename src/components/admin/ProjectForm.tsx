"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ContentImageUpload } from "@/components/admin/ContentImageUpload";
import {
  FormImagePicker,
  uploadContentImage,
} from "@/components/admin/FormImagePicker";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  slugify,
} from "@/lib/cms";
import type { ProjectCaseStudy, ProjectCategory, ProjectStatus } from "@/types";

export type ProjectFormValues = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  status: ProjectStatus;
  categories: ProjectCategory[];
  technologies: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  caseStudyUrl: string;
  featured: boolean;
  isPrivateClient: boolean;
  published: boolean;
  sortOrder: number;
  caseStudy?: ProjectCaseStudy | null;
  coverImageUrl?: string | null;
  coverImageFileName?: string | null;
};

const emptyCaseStudy: ProjectCaseStudy = {
  clientProblem: "",
  role: "",
  planning: "",
  solution: "",
  technology: "",
  security: "",
  businessResult: "",
  lessonsLearned: "",
};

const categoryLabels: Record<ProjectCategory, string> = {
  client: "Client",
  "web-app": "Web app",
  ecommerce: "Ecommerce",
  ai: "AI",
  hackathon: "Hackathon",
};

const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  private: "Private",
  prototype: "Prototype",
  "in-development": "In development",
};

function caseStudyPayload(
  study: ProjectCaseStudy,
): ProjectCaseStudy | null {
  const cleaned = Object.fromEntries(
    Object.entries(study).map(([key, value]) => [key, value.trim()]),
  ) as ProjectCaseStudy;
  const hasContent = Object.values(cleaned).some((value) => value.length > 0);
  return hasContent ? cleaned : null;
}

export function ProjectForm({
  initial,
  mode,
}: {
  initial?: ProjectFormValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, setPending] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [caseStudyOpen, setCaseStudyOpen] = useState(
    Boolean(
      initial?.caseStudy &&
        Object.values(initial.caseStudy).some((value) => value.trim()),
    ),
  );

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [problem, setProblem] = useState(initial?.problem ?? "");
  const [solution, setSolution] = useState(initial?.solution ?? "");
  const [status, setStatus] = useState<ProjectStatus>(
    initial?.status ?? "prototype",
  );
  const [categories, setCategories] = useState<ProjectCategory[]>(
    initial?.categories ?? [],
  );
  const [technologies, setTechnologies] = useState(
    (initial?.technologies ?? []).join(", "),
  );
  const [features, setFeatures] = useState(
    (initial?.features ?? []).join("\n"),
  );
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [caseStudyUrl, setCaseStudyUrl] = useState(
    initial?.caseStudyUrl ?? "",
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [isPrivateClient, setIsPrivateClient] = useState(
    initial?.isPrivateClient ?? false,
  );
  const [published, setPublished] = useState(initial?.published ?? true);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [caseStudy, setCaseStudy] = useState<ProjectCaseStudy>({
    ...emptyCaseStudy,
    ...initial?.caseStudy,
  });

  function toggleCategory(category: ProjectCategory) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (categories.length === 0) {
      showToast({
        title: "Categories required",
        description: "Select at least one project category.",
        variant: "error",
      });
      return;
    }

    const techList = technologies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const featureList = features
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const body = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      summary: summary.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      status,
      categories,
      technologies: techList,
      features: featureList,
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      caseStudyUrl: caseStudyUrl.trim(),
      featured,
      isPrivateClient,
      published,
      sortOrder: Number(sortOrder) || 0,
      caseStudy: caseStudyPayload(caseStudy),
    };

    setPending(true);
    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        item?: { id: string };
      } | null;

      if (!response.ok || !payload?.success || !payload.item) {
        throw new Error(payload?.error ?? "Could not save the project.");
      }

      const projectId = payload.item.id;

      if (coverFile) {
        await uploadContentImage({
          file: coverFile,
          attachTo: "projectCover",
          entityId: projectId,
        });
      }

      showToast({
        title: mode === "create" ? "Project created" : "Project updated",
        description: coverFile
          ? "Project details and cover image are saved."
          : "Changes are saved.",
        variant: "success",
      });

      if (mode === "create") {
        router.push(`/admin/projects/${projectId}`);
      } else {
        setCoverFile(null);
        router.refresh();
      }
    } catch (error) {
      showToast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Title"
            name="title"
            required
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
          <Input
            label="Slug"
            name="slug"
            hint="Optional — auto-generated from the title"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </div>

        <FormImagePicker
          title="Project cover image"
          description="Shown on the Projects Shipped cards and project detail page. Upload from your desktop."
          currentUrl={initial?.coverImageUrl}
          fileName={initial?.coverImageFileName}
          file={coverFile}
          onFileChange={setCoverFile}
          aspectClassName="aspect-[16/10]"
        />

        <Textarea
          label="Summary"
          name="summary"
          required
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
        <Textarea
          label="Problem"
          name="problem"
          required
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
        />
        <Textarea
          label="Solution"
          name="solution"
          required
          value={solution}
          onChange={(event) => setSolution(event.target.value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Status"
            name="status"
            required
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectStatus)
            }
          >
            {PROJECT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusLabels[value]}
              </option>
            ))}
          </Select>
          <Input
            label="Sort order"
            name="sortOrder"
            type="number"
            min={0}
            max={10000}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Categories</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {PROJECT_CATEGORIES.map((category) => (
              <label
                key={category}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="accent-[var(--accent)]"
                />
                {categoryLabels[category]}
              </label>
            ))}
          </div>
        </fieldset>

        <Input
          label="Technologies"
          name="technologies"
          hint="Comma-separated"
          value={technologies}
          onChange={(event) => setTechnologies(event.target.value)}
          placeholder="Next.js, PostgreSQL, Prisma"
        />
        <div className="space-y-1.5">
          <Textarea
            label="Features"
            name="features"
            value={features}
            onChange={(event) => setFeatures(event.target.value)}
            className="min-h-28"
            placeholder="One feature per line"
          />
          <p className="text-xs text-muted">One feature per line</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Live URL"
            name="liveUrl"
            type="url"
            value={liveUrl}
            onChange={(event) => setLiveUrl(event.target.value)}
          />
          <Input
            label="GitHub URL"
            name="githubUrl"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
          />
          <Input
            label="Case study URL"
            name="caseStudyUrl"
            type="url"
            value={caseStudyUrl}
            onChange={(event) => setCaseStudyUrl(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="accent-[var(--accent)]"
            />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPrivateClient}
              onChange={(event) => setIsPrivateClient(event.target.checked)}
              className="accent-[var(--accent)]"
            />
            Private client
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="accent-[var(--accent)]"
            />
            Published
          </label>
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/40">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium"
            onClick={() => setCaseStudyOpen((open) => !open)}
          >
            Case study details (optional)
            {caseStudyOpen ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          {caseStudyOpen ? (
            <div className="space-y-4 border-t border-border px-4 py-4">
              {(
                [
                  ["clientProblem", "Client problem"],
                  ["role", "Role"],
                  ["planning", "Planning"],
                  ["solution", "Solution"],
                  ["technology", "Technology"],
                  ["security", "Security"],
                  ["businessResult", "Business result"],
                  ["lessonsLearned", "Lessons learned"],
                ] as const
              ).map(([key, label]) => (
                <Textarea
                  key={key}
                  label={label}
                  name={key}
                  value={caseStudy[key]}
                  onChange={(event) =>
                    setCaseStudy((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="min-h-24"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create project"
                : "Save changes"}
          </Button>
          <Link
            href="/admin/projects"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold hover:bg-surface-elevated"
          >
            Cancel
          </Link>
        </div>
      </form>

      {mode === "edit" && initial?.id ? (
        <ContentImageUpload
          title="Replace cover image"
          description="Optional: upload a new cover image without editing other fields."
          attachTo="projectCover"
          entityId={initial.id}
          currentUrl={initial.coverImageUrl ?? null}
          fileName={initial.coverImageFileName}
        />
      ) : null}
    </div>
  );
}
