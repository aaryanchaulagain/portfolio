import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  jsonError,
  skillUpdateSchema,
  zodErrorMessage,
} from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

type RouteContext = { params: Promise<{ id: string }> };

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

  const parsed = skillUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) return jsonError("Skill not found.", 404);

  const data = parsed.data;

  if (data.categoryId && data.categoryId !== existing.categoryId) {
    const category = await prisma.skillCategory.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return jsonError("Skill category not found.", 404);
    }
  }

  try {
    const row = await prisma.skill.update({
      where: { id },
      data: {
        ...(data.categoryId !== undefined
          ? { categoryId: data.categoryId }
          : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.level !== undefined ? { level: data.level } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });

    revalidateContent("skills");

    return NextResponse.json({
      success: true,
      item: {
        id: row.id,
        categoryId: row.categoryId,
        name: row.name,
        level: row.level,
        sortOrder: row.sortOrder,
      },
    });
  } catch (error) {
    console.error("[admin/skills/[id]] patch failed", error);
    return jsonError("Could not update the skill.", 500);
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
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) return jsonError("Skill not found.", 404);

    await prisma.skill.delete({ where: { id } });

    revalidateContent("skills");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[admin/skills/[id]] delete failed", error);
    return jsonError("Could not delete the skill.", 500);
  }
}
