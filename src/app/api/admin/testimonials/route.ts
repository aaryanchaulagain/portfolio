import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  contentImageUrl,
  jsonError,
  testimonialCreateSchema,
  zodErrorMessage,
} from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

function mapAdminTestimonial(row: {
  id: string;
  name: string;
  roleOrCompany: string;
  quote: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  photo: { id: string; updatedAt: Date; fileName: string } | null;
}) {
  return {
    id: row.id,
    name: row.name,
    roleOrCompany: row.roleOrCompany,
    quote: row.quote,
    sortOrder: row.sortOrder,
    published: row.published,
    image: row.photo
      ? contentImageUrl(row.photo.id, row.photo.updatedAt)
      : "",
    photoFileName: row.photo?.fileName ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  try {
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        photo: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    return NextResponse.json({
      success: true,
      items: rows.map(mapAdminTestimonial),
    });
  } catch (error) {
    console.error("[admin/testimonials] list failed", error);
    return jsonError("Could not load testimonials.", 500);
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

  const parsed = testimonialCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const data = parsed.data;

  try {
    const row = await prisma.testimonial.create({
      data: {
        name: data.name,
        roleOrCompany: data.roleOrCompany?.trim() || "",
        quote: data.quote,
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
      include: {
        photo: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    revalidateContent("testimonials");

    return NextResponse.json(
      { success: true, item: mapAdminTestimonial(row) },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/testimonials] create failed", error);
    return jsonError("Could not create the testimonial.", 500);
  }
}
