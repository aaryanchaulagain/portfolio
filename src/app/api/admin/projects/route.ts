import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  contentImageUrl,
  emptyToNull,
  jsonError,
  projectCreateSchema,
  slugify,
  zodErrorMessage,
} from "@/lib/cms";
import { mapProject } from "@/lib/content";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  try {
    const rows = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        coverImage: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    return NextResponse.json({
      success: true,
      items: rows.map((row) => ({
        ...mapProject(row),
        published: row.published,
        sortOrder: row.sortOrder,
        coverImageId: row.coverImageId,
        coverImageFileName: row.coverImage?.fileName ?? null,
        coverImageUrl: row.coverImage
          ? contentImageUrl(row.coverImage.id, row.coverImage.updatedAt)
          : null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[admin/projects] list failed", error);
    return jsonError("Could not load projects.", 500);
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const data = parsed.data;
  const slug = slugify(data.slug || data.title);
  if (!slug) {
    return jsonError("Could not generate a valid slug from the title.", 400);
  }

  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    return jsonError("A project with this slug already exists.", 409);
  }

  try {
    const row = await prisma.project.create({
      data: {
        slug,
        title: data.title,
        summary: data.summary,
        problem: data.problem,
        solution: data.solution,
        categories: data.categories,
        status: data.status,
        technologies: data.technologies,
        features: data.features,
        liveUrl: emptyToNull(data.liveUrl) ?? null,
        caseStudyUrl: emptyToNull(data.caseStudyUrl) ?? null,
        githubUrl: emptyToNull(data.githubUrl) ?? null,
        featured: data.featured ?? false,
        isPrivateClient: data.isPrivateClient ?? false,
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
        caseStudy:
          data.caseStudy === undefined || data.caseStudy === null
            ? undefined
            : (data.caseStudy as Prisma.InputJsonValue),
      },
      include: {
        coverImage: { select: { id: true, updatedAt: true } },
      },
    });

    revalidateContent("projects");

    return NextResponse.json(
      {
        success: true,
        item: {
          ...mapProject(row),
          published: row.published,
          sortOrder: row.sortOrder,
          coverImageId: row.coverImageId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/projects] create failed", error);
    return jsonError("Could not create the project.", 500);
  }
}
