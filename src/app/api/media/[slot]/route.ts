import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/database";
import { isSiteMediaSlot } from "@/lib/site-media";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slot: string }> },
) {
  const { slot } = await context.params;

  if (!isSiteMediaSlot(slot)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Media storage is unavailable." },
      { status: 503 },
    );
  }

  try {
    const media = await prisma.siteMedia.findUnique({ where: { id: slot } });
    if (!media) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(media.data), {
      status: 200,
      headers: {
        "Content-Type": media.mimeType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Disposition": `inline; filename="${media.fileName.replace(/"/g, "")}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load media." },
      { status: 500 },
    );
  }
}
