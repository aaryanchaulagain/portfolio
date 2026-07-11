import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  awardCreateSchema,
  contentImageUrl,
  jsonError,
  zodErrorMessage,
} from "@/lib/cms";
import { mapAward } from "@/lib/content";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  try {
    const rows = await prisma.award.findMany({
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
      include: {
        certificateImage: {
          select: { id: true, updatedAt: true, fileName: true },
        },
        eventImage: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    return NextResponse.json({
      success: true,
      items: rows.map((row) => ({
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
      })),
    });
  } catch (error) {
    console.error("[admin/awards] list failed", error);
    return jsonError("Could not load awards.", 500);
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

  const parsed = awardCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const data = parsed.data;

  try {
    const row = await prisma.award.create({
      data: {
        title: data.title,
        organizer: data.organizer,
        year: data.year,
        description: data.description,
        projectName: data.projectName ?? "",
        verificationLink: data.verificationLink ?? "",
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
      include: {
        certificateImage: { select: { id: true, updatedAt: true } },
        eventImage: { select: { id: true, updatedAt: true } },
      },
    });

    revalidateContent("awards");

    return NextResponse.json(
      {
        success: true,
        item: {
          ...mapAward(row),
          published: row.published,
          sortOrder: row.sortOrder,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/awards] create failed", error);
    return jsonError("Could not create the award.", 500);
  }
}
