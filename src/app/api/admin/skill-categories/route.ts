import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  jsonError,
  skillCategoryCreateSchema,
  zodErrorMessage,
} from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  try {
    const rows = await prisma.skillCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        skills: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json({
      success: true,
      items: rows.map((row) => ({
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
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[admin/skill-categories] list failed", error);
    return jsonError("Could not load skill categories.", 500);
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

  const parsed = skillCategoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const data = parsed.data;

  try {
    const row = await prisma.skillCategory.create({
      data: {
        title: data.title,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { skills: true },
    });

    revalidateContent("skills");

    return NextResponse.json(
      {
        success: true,
        item: {
          id: row.id,
          title: row.title,
          description: row.description,
          sortOrder: row.sortOrder,
          skills: [],
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/skill-categories] create failed", error);
    return jsonError("Could not create the skill category.", 500);
  }
}
