import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!id || id.length > 64) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Media storage is unavailable." },
      { status: 503 },
    );
  }

  try {
    const media = await prisma.contentImage.findUnique({ where: { id } });
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
