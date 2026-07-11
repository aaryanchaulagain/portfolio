import { z } from "zod";

export const PROJECT_STATUSES = [
  "live",
  "private",
  "prototype",
  "in-development",
] as const;

export const PROJECT_CATEGORIES = [
  "client",
  "web-app",
  "ecommerce",
  "ai",
  "hackathon",
] as const;

export const SKILL_LEVELS = ["core", "experienced", "working"] as const;

export const CONTENT_IMAGE_ATTACH = [
  "projectCover",
  "awardCertificate",
  "awardEvent",
  "serviceCover",
  "testimonialPhoto",
] as const;

export type ContentImageAttachTo = (typeof CONTENT_IMAGE_ATTACH)[number];

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function contentImageUrl(id: string, updatedAt: Date | string | number) {
  const v =
    updatedAt instanceof Date
      ? updatedAt.getTime()
      : typeof updatedAt === "number"
        ? updatedAt
        : new Date(updatedAt).getTime();
  return `/api/content-image/${id}?v=${v}`;
}

const stringArray = z.array(z.string().trim().min(1).max(120)).max(40);

const caseStudySchema = z
  .object({
    clientProblem: z.string().trim().max(5000),
    role: z.string().trim().max(2000),
    planning: z.string().trim().max(5000),
    solution: z.string().trim().max(5000),
    technology: z.string().trim().max(2000),
    security: z.string().trim().max(2000),
    businessResult: z.string().trim().max(5000),
    lessonsLearned: z.string().trim().max(5000),
  })
  .partial()
  .nullable()
  .optional();

export const projectCreateSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(120).optional(),
  summary: z.string().trim().min(1).max(5000),
  problem: z.string().trim().min(1).max(5000),
  solution: z.string().trim().min(1).max(5000),
  categories: z.array(z.enum(PROJECT_CATEGORIES)).min(1).max(10),
  status: z.enum(PROJECT_STATUSES),
  technologies: stringArray.default([]),
  features: stringArray.default([]),
  liveUrl: z.union([z.string().trim().url().max(500), z.literal(""), z.null()]).optional(),
  caseStudyUrl: z
    .union([z.string().trim().url().max(500), z.literal(""), z.null()])
    .optional(),
  githubUrl: z
    .union([z.string().trim().max(500), z.literal(""), z.null()])
    .optional(),
  featured: z.boolean().optional(),
  isPrivateClient: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  caseStudy: caseStudySchema,
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const awardCreateSchema = z.object({
  title: z.string().trim().min(2).max(200),
  organizer: z.string().trim().min(1).max(200),
  year: z.number().int().min(1990).max(2100),
  description: z.string().trim().min(1).max(5000),
  projectName: z.string().trim().max(200).optional(),
  verificationLink: z.string().trim().max(500).optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  published: z.boolean().optional(),
});

export const awardUpdateSchema = awardCreateSchema.partial();

export const serviceCreateSchema = z.object({
  title: z.string().trim().min(2).max(200),
  outcome: z.string().trim().min(1).max(5000),
  icon: z.string().trim().min(1).max(60).optional(),
  imageUrl: z.string().trim().max(1000).optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  published: z.boolean().optional(),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const testimonialCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  roleOrCompany: z.string().trim().max(200).optional(),
  quote: z.string().trim().min(10).max(2000),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  published: z.boolean().optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

export const skillCategoryCreateSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(1).max(2000),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});

export const skillCategoryUpdateSchema = skillCategoryCreateSchema.partial();

export const skillCreateSchema = z.object({
  categoryId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  level: z.enum(SKILL_LEVELS),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});

export const skillUpdateSchema = z.object({
  categoryId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  level: z.enum(SKILL_LEVELS).optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});

export function emptyToNull(value: string | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function jsonError(message: string, status: number) {
  return Response.json({ success: false, error: message }, { status });
}

export function zodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid request body.";
}
