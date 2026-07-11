import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  contentImageUrl,
  jsonError,
  testimonialUpdateSchema,
  zodErrorMessage,
} from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

type RouteContext = { params: Promise<{ id: string }> };

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

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  const { id } = await context.params;

  try {
    const row = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        photo: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });
    if (!row) return jsonError("Testimonial not found.", 404);

    return NextResponse.json({
      success: true,
      item: mapAdminTestimonial(row),
    });
  } catch (error) {
    console.error("[admin/testimonials/[id]] get failed", error);
    return jsonError("Could not load the testimonial.", 500);
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

  const parsed = testimonialUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error), 400);
  }

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return jsonError("Testimonial not found.", 404);

  const data = parsed.data;

  try {
    const row = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.roleOrCompany !== undefined
          ? { roleOrCompany: data.roleOrCompany.trim() }
          : {}),
        ...(data.quote !== undefined ? { quote: data.quote } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
      include: {
        photo: { select: { id: true, updatedAt: true, fileName: true } },
      },
    });

    revalidateContent("testimonials");

    return NextResponse.json({
      success: true,
      item: mapAdminTestimonial(row),
    });
  } catch (error) {
    console.error("[admin/testimonials/[id]] patch failed", error);
    return jsonError("Could not update the testimonial.", 500);
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
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return jsonError("Testimonial not found.", 404);

    await prisma.testimonial.delete({ where: { id } });

    revalidateContent("testimonials");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[admin/testimonials/[id]] delete failed", error);
    return jsonError("Could not delete the testimonial.", 500);
  }
}
