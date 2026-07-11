import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  jsonError,
  serviceCreateSchema,
  zodErrorMessage,
} from "@/lib/cms";
import { mapService } from "@/lib/content";
import { defaultImageForServiceIcon } from "@/data/service-images";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  try {
    const rows = await prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        coverImage: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    return NextResponse.json({
      success: true,
      items: rows.map((row) => ({
        ...mapService(row),
        imageUrl: row.imageUrl,
        coverImageFileName: row.coverImage?.fileName ?? null,
        published: row.published,
        sortOrder: row.sortOrder,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[admin/services] list failed", error);
    return jsonError("Could not load services.", 500);
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

  const parsed = serviceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const data = parsed.data;
  const icon = data.icon ?? "globe";

  try {
    const row = await prisma.service.create({
      data: {
        title: data.title,
        outcome: data.outcome,
        icon,
        imageUrl: data.imageUrl?.trim() || defaultImageForServiceIcon(icon),
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
      include: {
        coverImage: { select: { id: true, updatedAt: true } },
      },
    });

    revalidateContent("services");

    return NextResponse.json(
      {
        success: true,
        item: {
          ...mapService(row),
          published: row.published,
          sortOrder: row.sortOrder,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/services] create failed", error);
    return jsonError("Could not create the service.", 500);
  }
}
