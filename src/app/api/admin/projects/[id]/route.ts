import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  contentImageUrl,
  emptyToNull,
  jsonError,
  projectUpdateSchema,
  slugify,
  zodErrorMessage,
} from "@/lib/cms";
import { mapProject } from "@/lib/content";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  const { id } = await context.params;

  try {
    const row = await prisma.project.findUnique({
      where: { id },
      include: {
        coverImage: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    if (!row) return jsonError("Project not found.", 404);

    return NextResponse.json({
      success: true,
      item: {
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
      },
    });
  } catch (error) {
    console.error("[admin/projects/[id]] get failed", error);
    return jsonError("Could not load the project.", 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return jsonError("Project not found.", 404);

  const data = parsed.data;
  let slug = existing.slug;
  if (data.slug !== undefined || data.title !== undefined) {
    slug = slugify(data.slug || data.title || existing.title);
    if (!slug) {
      return jsonError("Could not generate a valid slug.", 400);
    }
    if (slug !== existing.slug) {
      const clash = await prisma.project.findUnique({ where: { slug } });
      if (clash) {
        return jsonError("A project with this slug already exists.", 409);
      }
    }
  }

  try {
    const row = await prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        slug,
        ...(data.summary !== undefined ? { summary: data.summary } : {}),
        ...(data.problem !== undefined ? { problem: data.problem } : {}),
        ...(data.solution !== undefined ? { solution: data.solution } : {}),
        ...(data.categories !== undefined
          ? { categories: data.categories }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.technologies !== undefined
          ? { technologies: data.technologies }
          : {}),
        ...(data.features !== undefined ? { features: data.features } : {}),
        ...(data.liveUrl !== undefined
          ? { liveUrl: emptyToNull(data.liveUrl) ?? null }
          : {}),
        ...(data.caseStudyUrl !== undefined
          ? { caseStudyUrl: emptyToNull(data.caseStudyUrl) ?? null }
          : {}),
        ...(data.githubUrl !== undefined
          ? { githubUrl: emptyToNull(data.githubUrl) ?? null }
          : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.isPrivateClient !== undefined
          ? { isPrivateClient: data.isPrivateClient }
          : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.caseStudy !== undefined
          ? {
              caseStudy:
                data.caseStudy === null
                  ? Prisma.JsonNull
                  : (data.caseStudy as Prisma.InputJsonValue),
            }
          : {}),
      },
      include: {
        coverImage: { select: { id: true, updatedAt: true } },
      },
    });

    revalidateContent("projects");

    return NextResponse.json({
      success: true,
      item: {
        ...mapProject(row),
        published: row.published,
        sortOrder: row.sortOrder,
        coverImageId: row.coverImageId,
      },
    });
  } catch (error) {
    console.error("[admin/projects/[id]] patch failed", error);
    return jsonError("Could not update the project.", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { id: true, coverImageId: true },
    });
    if (!existing) return jsonError("Project not found.", 404);

    await prisma.project.delete({ where: { id } });

    if (existing.coverImageId) {
      await prisma.contentImage.deleteMany({
        where: { id: existing.coverImageId },
      });
    }

    revalidateContent("projects");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[admin/projects/[id]] delete failed", error);
    return jsonError("Could not delete the project.", 500);
  }
}
