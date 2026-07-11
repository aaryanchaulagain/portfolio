import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { revalidateContent } from "@/lib/revalidate-content";
import { isSiteMediaSlot, type SiteMediaSlot } from "@/lib/site-media";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 5 * 1024 * 1024;

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form data.", 400);
  }

  const slotValue = String(formData.get("slot") ?? "");
  if (!isSiteMediaSlot(slotValue)) {
    return jsonError("Choose a valid image slot (hero or about).", 400);
  }
  const slot: SiteMediaSlot = slotValue;

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

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || `${slot}.jpg`;

  try {
    const media = await prisma.siteMedia.upsert({
      where: { id: slot },
      create: {
        id: slot,
        mimeType: file.type,
        fileName,
        data: buffer,
      },
      update: {
        mimeType: file.type,
        fileName,
        data: buffer,
      },
    });

    revalidateContent("site-media");

    return NextResponse.json({
      success: true,
      slot,
      fileName: media.fileName,
      url: `/api/media/${slot}?v=${media.updatedAt.getTime()}`,
      updatedAt: media.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("[admin/media] upload failed", error);
    return jsonError("Could not save the image. Please try again.", 500);
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  if (!isDatabaseConfigured()) {
    return jsonError("Database is not configured.", 503);
  }

  const { searchParams } = new URL(request.url);
  const slot = searchParams.get("slot") ?? "";
  if (!isSiteMediaSlot(slot)) {
    return jsonError("Choose a valid image slot.", 400);
  }

  try {
    await prisma.siteMedia.deleteMany({ where: { id: slot } });

    revalidateContent("site-media");

    return NextResponse.json({ success: true, slot });
  } catch {
    return jsonError("Could not remove the image.", 500);
  }
}
