import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  jsonError,
  skillCreateSchema,
  zodErrorMessage,
} from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

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

  const parsed = skillCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const data = parsed.data;

  const category = await prisma.skillCategory.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) {
    return jsonError("Skill category not found.", 404);
  }

  try {
    const row = await prisma.skill.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        level: data.level,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    revalidateContent("skills");

    return NextResponse.json(
      {
        success: true,
        item: {
          id: row.id,
          categoryId: row.categoryId,
          name: row.name,
          level: row.level,
          sortOrder: row.sortOrder,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/skills] create failed", error);
    return jsonError("Could not create the skill.", 500);
  }
}
