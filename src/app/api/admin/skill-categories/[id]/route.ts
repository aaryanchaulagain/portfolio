import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  jsonError,
  skillCategoryUpdateSchema,
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

  const parsed = skillCategoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const existing = await prisma.skillCategory.findUnique({ where: { id } });
  if (!existing) return jsonError("Skill category not found.", 404);

  const data = parsed.data;

  try {
    const row = await prisma.skillCategory.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
      include: {
        skills: { orderBy: { sortOrder: "asc" } },
      },
    });

    revalidateContent("skills");

    return NextResponse.json({
      success: true,
      item: {
        id: row.id,
        title: row.title,
        description: row.description,
        sortOrder: row.sortOrder,
        skills: row.skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          sortOrder: skill.sortOrder,
          categoryId: skill.categoryId,
        })),
      },
    });
  } catch (error) {
    console.error("[admin/skill-categories/[id]] patch failed", error);
    return jsonError("Could not update the skill category.", 500);
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
    const existing = await prisma.skillCategory.findUnique({ where: { id } });
    if (!existing) return jsonError("Skill category not found.", 404);

    await prisma.skillCategory.delete({ where: { id } });

    revalidateContent("skills");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[admin/skill-categories/[id]] delete failed", error);
    return jsonError("Could not delete the skill category.", 500);
  }
}
