import { cache } from "react";
import { unstable_cache } from "next/cache";
import { awards as staticAwards } from "@/data/awards";
import { projects as staticProjects } from "@/data/projects";
import { defaultImageForServiceIcon } from "@/data/service-images";
import { services as staticServices } from "@/data/services";
import { skillCategories as staticSkillCategories } from "@/data/skills";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { contentImageUrl } from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import type {
  AwardItem,
  ProjectCaseStudy,
  ProjectCategory,
  ProjectItem,
  ProjectStatus,
  ServiceItem,
  SkillCategory,
  SkillLevel,
  TestimonialItem,
} from "@/types";

/** Public CMS cache — admin writes call revalidateTag to refresh sooner. */
const REVALIDATE_SECONDS = 60;

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asProjectCategories(value: unknown): ProjectCategory[] {
  return asStringArray(value) as ProjectCategory[];
}

function asProjectStatus(value: unknown): ProjectStatus {
  const allowed: ProjectStatus[] = [
    "live",
    "private",
    "prototype",
    "in-development",
  ];
  return allowed.includes(value as ProjectStatus)
    ? (value as ProjectStatus)
    : "prototype";
}

function asSkillLevel(value: unknown): SkillLevel {
  const allowed: SkillLevel[] = ["core", "experienced", "working"];
  return allowed.includes(value as SkillLevel)
    ? (value as SkillLevel)
    : "working";
}

function asCaseStudy(value: unknown): ProjectCaseStudy | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  const pick = (key: keyof ProjectCaseStudy) =>
    typeof row[key] === "string" ? (row[key] as string) : "";
  return {
    clientProblem: pick("clientProblem"),
    role: pick("role"),
    planning: pick("planning"),
    solution: pick("solution"),
    technology: pick("technology"),
    security: pick("security"),
    businessResult: pick("businessResult"),
    lessonsLearned: pick("lessonsLearned"),
  };
}

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  categories: unknown;
  status: string;
  technologies: unknown;
  features: unknown;
  liveUrl: string | null;
  caseStudyUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  isPrivateClient: boolean;
  caseStudy: unknown;
  coverImage: { id: string; updatedAt: Date } | null;
};

export function mapProject(row: ProjectRow): ProjectItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    problem: row.problem,
    solution: row.solution,
    category: asProjectCategories(row.categories),
    status: asProjectStatus(row.status),
    technologies: asStringArray(row.technologies),
    features: asStringArray(row.features),
    image: row.coverImage
      ? contentImageUrl(row.coverImage.id, row.coverImage.updatedAt)
      : "",
    liveUrl: row.liveUrl ?? undefined,
    caseStudyUrl: row.caseStudyUrl ?? undefined,
    githubUrl: row.githubUrl ?? undefined,
    featured: row.featured,
    isPrivateClient: row.isPrivateClient,
    caseStudy: asCaseStudy(row.caseStudy),
  };
}

type AwardRow = {
  id: string;
  title: string;
  organizer: string;
  year: number;
  description: string;
  projectName: string;
  verificationLink: string;
  certificateImage: { id: string; updatedAt: Date } | null;
  eventImage: { id: string; updatedAt: Date } | null;
};

export function mapAward(row: AwardRow): AwardItem {
  return {
    id: row.id,
    title: row.title,
    organizer: row.organizer,
    year: row.year,
    description: row.description,
    projectName: row.projectName,
    certificateImage: row.certificateImage
      ? contentImageUrl(row.certificateImage.id, row.certificateImage.updatedAt)
      : "",
    eventImage: row.eventImage
      ? contentImageUrl(row.eventImage.id, row.eventImage.updatedAt)
      : "",
    verificationLink: row.verificationLink,
  };
}

type SkillCategoryRow = {
  id: string;
  title: string;
  description: string;
  skills: Array<{ name: string; level: string; sortOrder: number }>;
};

export function mapSkillCategory(row: SkillCategoryRow): SkillCategory {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    skills: [...row.skills]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((skill) => ({
        name: skill.name,
        level: asSkillLevel(skill.level),
      })),
  };
}

type ServiceRow = {
  id: string;
  title: string;
  outcome: string;
  icon: string;
  imageUrl?: string | null;
  coverImage?: { id: string; updatedAt: Date } | null;
};

export function mapService(row: ServiceRow): ServiceItem {
  const uploaded = row.coverImage
    ? contentImageUrl(row.coverImage.id, row.coverImage.updatedAt)
    : "";
  const remote = row.imageUrl?.trim() || "";
  return {
    id: row.id,
    title: row.title,
    outcome: row.outcome,
    icon: row.icon,
    image: uploaded || remote || defaultImageForServiceIcon(row.icon),
  };
}

function mapStaticTestimonials(): TestimonialItem[] {
  return staticTestimonials.map((item) => ({
    id: item.id,
    name: item.name,
    roleOrCompany: item.companyOrIndustry,
    quote: item.quote,
    image: "",
  }));
}

const loadProjects = unstable_cache(
  async (): Promise<ProjectItem[]> => {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        coverImage: { select: { id: true, updatedAt: true } },
      },
    });
    if (rows.length === 0) return staticProjects;
    return rows.map(mapProject);
  },
  ["content-projects-v1"],
  { revalidate: REVALIDATE_SECONDS, tags: ["projects"] },
);

const loadAwards = unstable_cache(
  async (): Promise<AwardItem[]> => {
    const rows = await prisma.award.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
      include: {
        certificateImage: { select: { id: true, updatedAt: true } },
        eventImage: { select: { id: true, updatedAt: true } },
      },
    });
    if (rows.length === 0) return staticAwards;
    return rows.map(mapAward);
  },
  ["content-awards-v1"],
  { revalidate: REVALIDATE_SECONDS, tags: ["awards"] },
);

const loadSkills = unstable_cache(
  async (): Promise<SkillCategory[]> => {
    const rows = await prisma.skillCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        skills: {
          orderBy: { sortOrder: "asc" },
          select: { name: true, level: true, sortOrder: true },
        },
      },
    });
    if (rows.length === 0) return staticSkillCategories;
    return rows.map(mapSkillCategory);
  },
  ["content-skills-v1"],
  { revalidate: REVALIDATE_SECONDS, tags: ["skills"] },
);

const loadServices = unstable_cache(
  async (): Promise<ServiceItem[]> => {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        coverImage: { select: { id: true, updatedAt: true } },
      },
    });
    if (rows.length === 0) return staticServices;
    return rows.map(mapService);
  },
  ["content-services-v1"],
  { revalidate: REVALIDATE_SECONDS, tags: ["services"] },
);

const loadTestimonials = unstable_cache(
  async (): Promise<TestimonialItem[]> => {
    const rows = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        photo: { select: { id: true, updatedAt: true } },
      },
    });
    if (rows.length === 0) return mapStaticTestimonials();
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      roleOrCompany: row.roleOrCompany,
      quote: row.quote,
      image: row.photo
        ? contentImageUrl(row.photo.id, row.photo.updatedAt)
        : "",
    }));
  },
  ["content-testimonials-v1"],
  { revalidate: REVALIDATE_SECONDS, tags: ["testimonials"] },
);

/** Dedupes within a single request (e.g. page + footer). */
export const getProjects = cache(async (): Promise<ProjectItem[]> => {
  if (!isDatabaseConfigured()) return staticProjects;
  try {
    return await loadProjects();
  } catch {
    return staticProjects;
  }
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<ProjectItem | undefined> => {
    if (!isDatabaseConfigured()) {
      return staticProjects.find((project) => project.slug === slug);
    }

    try {
      const row = await prisma.project.findFirst({
        where: { slug, published: true },
        include: {
          coverImage: { select: { id: true, updatedAt: true } },
        },
      });
      if (row) return mapProject(row);

      const count = await prisma.project.count();
      if (count === 0) {
        return staticProjects.find((project) => project.slug === slug);
      }
      return undefined;
    } catch {
      return staticProjects.find((project) => project.slug === slug);
    }
  },
);

export const getFeaturedProject = cache(
  async (): Promise<ProjectItem | undefined> => {
    const projects = await getProjects();
    return projects.find((project) => project.featured) ?? projects[0];
  },
);

export const getAwards = cache(async (): Promise<AwardItem[]> => {
  if (!isDatabaseConfigured()) return staticAwards;
  try {
    return await loadAwards();
  } catch {
    return staticAwards;
  }
});

export const getSkillCategories = cache(async (): Promise<SkillCategory[]> => {
  if (!isDatabaseConfigured()) return staticSkillCategories;
  try {
    return await loadSkills();
  } catch {
    return staticSkillCategories;
  }
});

export const getServices = cache(async (): Promise<ServiceItem[]> => {
  if (!isDatabaseConfigured()) return staticServices;
  try {
    return await loadServices();
  } catch {
    return staticServices;
  }
});

export const getTestimonials = cache(async (): Promise<TestimonialItem[]> => {
  if (!isDatabaseConfigured()) return mapStaticTestimonials();
  try {
    return await loadTestimonials();
  } catch {
    return mapStaticTestimonials();
  }
});
