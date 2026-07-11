import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  awardUpdateSchema,
  contentImageUrl,
  jsonError,
  zodErrorMessage,
} from "@/lib/cms";
import { mapAward } from "@/lib/content";
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
    const row = await prisma.award.findUnique({
      where: { id },
      include: {
        certificateImage: {
          select: { id: true, updatedAt: true, fileName: true },
        },
        eventImage: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    if (!row) return jsonError("Award not found.", 404);

    return NextResponse.json({
      success: true,
      item: {
        ...mapAward(row),
        published: row.published,
        sortOrder: row.sortOrder,
        certificateImageId: row.certificateImageId,
        eventImageId: row.eventImageId,
        certificateImageUrl: row.certificateImage
          ? contentImageUrl(
              row.certificateImage.id,
              row.certificateImage.updatedAt,
            )
          : null,
        eventImageUrl: row.eventImage
          ? contentImageUrl(row.eventImage.id, row.eventImage.updatedAt)
          : null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[admin/awards/[id]] get failed", error);
    return jsonError("Could not load the award.", 500);
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

  const parsed = awardUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const existing = await prisma.award.findUnique({ where: { id } });
  if (!existing) return jsonError("Award not found.", 404);

  const data = parsed.data;

  try {
    const row = await prisma.award.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.organizer !== undefined ? { organizer: data.organizer } : {}),
        ...(data.year !== undefined ? { year: data.year } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.projectName !== undefined
          ? { projectName: data.projectName }
          : {}),
        ...(data.verificationLink !== undefined
          ? { verificationLink: data.verificationLink }
          : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
      include: {
        certificateImage: { select: { id: true, updatedAt: true } },
        eventImage: { select: { id: true, updatedAt: true } },
      },
    });

    revalidateContent("awards");

    return NextResponse.json({
      success: true,
      item: {
        ...mapAward(row),
        published: row.published,
        sortOrder: row.sortOrder,
      },
    });
  } catch (error) {
    console.error("[admin/awards/[id]] patch failed", error);
    return jsonError("Could not update the award.", 500);
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
    const existing = await prisma.award.findUnique({
      where: { id },
      select: {
        id: true,
        certificateImageId: true,
        eventImageId: true,
      },
    });
    if (!existing) return jsonError("Award not found.", 404);

    await prisma.award.delete({ where: { id } });

    const imageIds = [
      existing.certificateImageId,
      existing.eventImageId,
    ].filter((value): value is string => Boolean(value));

    if (imageIds.length > 0) {
      await prisma.contentImage.deleteMany({
        where: { id: { in: imageIds } },
      });
    }

    revalidateContent("awards");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[admin/awards/[id]] delete failed", error);
    return jsonError("Could not delete the award.", 500);
  }
}
