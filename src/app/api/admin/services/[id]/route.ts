import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  jsonError,
  serviceUpdateSchema,
  zodErrorMessage,
} from "@/lib/cms";
import { mapService } from "@/lib/content";
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
    const row = await prisma.service.findUnique({
      where: { id },
      include: {
        coverImage: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });
    if (!row) return jsonError("Service not found.", 404);

    return NextResponse.json({
      success: true,
      item: {
        ...mapService(row),
        imageUrl: row.imageUrl,
        coverImageFileName: row.coverImage?.fileName ?? null,
        published: row.published,
        sortOrder: row.sortOrder,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[admin/services/[id]] get failed", error);
    return jsonError("Could not load the service.", 500);
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

  const parsed = serviceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return jsonError("Service not found.", 404);

  const data = parsed.data;

  try {
    const row = await prisma.service.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.outcome !== undefined ? { outcome: data.outcome } : {}),
        ...(data.icon !== undefined ? { icon: data.icon } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
      include: {
        coverImage: { select: { id: true, updatedAt: true } },
      },
    });

    revalidateContent("services");

    return NextResponse.json({
      success: true,
      item: {
        ...mapService(row),
        published: row.published,
        sortOrder: row.sortOrder,
      },
    });
  } catch (error) {
    console.error("[admin/services/[id]] patch failed", error);
    return jsonError("Could not update the service.", 500);
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
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return jsonError("Service not found.", 404);

    await prisma.service.delete({ where: { id } });
    revalidateContent("services");
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[admin/services/[id]] delete failed", error);
    return jsonError("Could not delete the service.", 500);
  }
}
