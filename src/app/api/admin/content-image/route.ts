import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  CONTENT_IMAGE_ATTACH,
  contentImageUrl,
  jsonError,
  type ContentImageAttachTo,
} from "@/lib/cms";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 5 * 1024 * 1024;

function isAttachTo(value: string): value is ContentImageAttachTo {
  return (CONTENT_IMAGE_ATTACH as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized.", 401);

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form data.", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("Please choose an image file.", 400);
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonError("Only JPG, PNG, WEBP, or GIF images are allowed.", 400);
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return jsonError("Image must be under 5 MB.", 400);
  }

  const attachToRaw = String(formData.get("attachTo") ?? "").trim();
  const entityId = String(formData.get("entityId") ?? "").trim();

  if (attachToRaw && !isAttachTo(attachToRaw)) {
    return jsonError(
      "attachTo must be a supported content image attachment.",
      400,
    );
  }

  if (attachToRaw && !entityId) {
    return jsonError("entityId is required when attachTo is set.", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName =
    file.name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || "upload.jpg";

  try {
    const image = await prisma.contentImage.create({
      data: {
        mimeType: file.type,
        fileName,
        data: buffer,
      },
    });

    let previousImageId: string | null = null;

    if (attachToRaw && entityId) {
      const attachTo = attachToRaw as ContentImageAttachTo;

      if (attachTo === "projectCover") {
        const project = await prisma.project.findUnique({
          where: { id: entityId },
          select: { id: true, coverImageId: true },
        });
        if (!project) {
          await prisma.contentImage.delete({ where: { id: image.id } });
          return jsonError("Project not found.", 404);
        }
        previousImageId = project.coverImageId;
        await prisma.project.update({
          where: { id: entityId },
          data: { coverImageId: image.id },
        });
      } else if (attachTo === "awardCertificate") {
        const award = await prisma.award.findUnique({
          where: { id: entityId },
          select: { id: true, certificateImageId: true },
        });
        if (!award) {
          await prisma.contentImage.delete({ where: { id: image.id } });
          return jsonError("Award not found.", 404);
        }
        previousImageId = award.certificateImageId;
        await prisma.award.update({
          where: { id: entityId },
          data: { certificateImageId: image.id },
        });
      } else if (attachTo === "awardEvent") {
        const award = await prisma.award.findUnique({
          where: { id: entityId },
          select: { id: true, eventImageId: true },
        });
        if (!award) {
          await prisma.contentImage.delete({ where: { id: image.id } });
          return jsonError("Award not found.", 404);
        }
        previousImageId = award.eventImageId;
        await prisma.award.update({
          where: { id: entityId },
          data: { eventImageId: image.id },
        });
      } else if (attachTo === "serviceCover") {
        const service = await prisma.service.findUnique({
          where: { id: entityId },
          select: { id: true, coverImageId: true },
        });
        if (!service) {
          await prisma.contentImage.delete({ where: { id: image.id } });
          return jsonError("Service not found.", 404);
        }
        previousImageId = service.coverImageId;
        await prisma.service.update({
          where: { id: entityId },
          data: { coverImageId: image.id },
        });
      } else if (attachTo === "testimonialPhoto") {
        const testimonial = await prisma.testimonial.findUnique({
          where: { id: entityId },
          select: { id: true, photoId: true },
        });
        if (!testimonial) {
          await prisma.contentImage.delete({ where: { id: image.id } });
          return jsonError("Testimonial not found.", 404);
        }
        previousImageId = testimonial.photoId;
        await prisma.testimonial.update({
          where: { id: entityId },
          data: { photoId: image.id },
        });
      }

      if (previousImageId && previousImageId !== image.id) {
        await prisma.contentImage.deleteMany({
          where: { id: previousImageId },
        });
      }
    }

    if (attachToRaw === "projectCover") {
      revalidateContent("projects");
    } else if (
      attachToRaw === "awardCertificate" ||
      attachToRaw === "awardEvent"
    ) {
      revalidateContent("awards");
    } else if (attachToRaw === "serviceCover") {
      revalidateContent("services");
    } else if (attachToRaw === "testimonialPhoto") {
      revalidateContent("testimonials");
    }

    return NextResponse.json(
      {
        success: true,
        id: image.id,
        fileName: image.fileName,
        mimeType: image.mimeType,
        url: contentImageUrl(image.id, image.updatedAt),
        attachTo: attachToRaw || null,
        entityId: entityId || null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/content-image] upload failed", error);
    return jsonError("Could not save the image. Please try again.", 500);
  }
}
