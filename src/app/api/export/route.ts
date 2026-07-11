import { EnquiryStatus, type Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  DatabaseUnavailableError,
  isDatabaseConfigured,
  prisma,
} from "@/lib/database";

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

const STATUS_VALUES = new Set<string>(Object.values(EnquiryStatus));

function csvEscape(value: string | number | null | undefined) {
  const raw = value == null ? "" : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replaceAll('"', '""')}"`;
  }
  return raw;
}

export async function GET(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return jsonError("Unauthorized.", 401);

    if (!isDatabaseConfigured()) {
      return jsonError("Database is not configured.", 503);
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
    const status = searchParams.get("status")?.trim() ?? "";
    const service = searchParams.get("service")?.trim() ?? "";
    const budget = searchParams.get("budget")?.trim() ?? "";
    const q = searchParams.get("q")?.trim() ?? "";
    const from = searchParams.get("from")?.trim() ?? "";
    const to = searchParams.get("to")?.trim() ?? "";

    const where: Prisma.EnquiryWhereInput = {};

    if (ids.length > 0) {
      where.id = { in: ids };
    } else {
      if (status && STATUS_VALUES.has(status)) {
        where.status = status as EnquiryStatus;
      }
      if (service) where.service = service;
      if (budget) where.budgetRange = budget;
      if (from || to) {
        where.createdAt = {};
        if (from) where.createdAt.gte = new Date(from);
        if (to) {
          const end = new Date(to);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }
      if (q) {
        where.OR = [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { companyName: { contains: q, mode: "insensitive" } },
          { referenceNumber: { contains: q, mode: "insensitive" } },
        ];
      }
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 1000,
    });

    const headers = [
      "referenceNumber",
      "fullName",
      "email",
      "phone",
      "companyName",
      "country",
      "service",
      "budgetRange",
      "timeline",
      "status",
      "createdAt",
      "approvedAt",
      "contactedAt",
      "projectDescription",
      "adminNote",
      "clientMessage",
    ];

    const rows = enquiries.map((enquiry) =>
      [
        enquiry.referenceNumber,
        enquiry.fullName,
        enquiry.email,
        enquiry.phone,
        enquiry.companyName,
        enquiry.country,
        enquiry.service,
        enquiry.budgetRange,
        enquiry.timeline,
        enquiry.status,
        enquiry.createdAt.toISOString(),
        enquiry.approvedAt?.toISOString() ?? "",
        enquiry.contactedAt?.toISOString() ?? "",
        enquiry.projectDescription,
        enquiry.adminNote,
        enquiry.clientMessage,
      ]
        .map(csvEscape)
        .join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const filename = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return jsonError("Database is not configured.", 503);
    }
    console.error("[api/export]", error instanceof Error ? error.message : error);
    return jsonError("Unable to export enquiries.", 500);
  }
}
