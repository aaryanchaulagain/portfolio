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

export async function GET(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return jsonError("Unauthorized.", 401);

    if (!isDatabaseConfigured()) {
      return jsonError("Database is not configured.", 503);
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const service = searchParams.get("service")?.trim() ?? "";
    const budget = searchParams.get("budget")?.trim() ?? "";
    const from = searchParams.get("from")?.trim() ?? "";
    const to = searchParams.get("to")?.trim() ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20),
    );

    const where: Prisma.EnquiryWhereInput = {};

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

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, pending, approved, rejected, thisMonth, items] =
      await Promise.all([
        prisma.enquiry.count({ where }),
        prisma.enquiry.count({ where: { status: EnquiryStatus.PENDING } }),
        prisma.enquiry.count({ where: { status: EnquiryStatus.APPROVED } }),
        prisma.enquiry.count({ where: { status: EnquiryStatus.REJECTED } }),
        prisma.enquiry.count({
          where: { createdAt: { gte: monthStart } },
        }),
        prisma.enquiry.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            id: true,
            referenceNumber: true,
            fullName: true,
            email: true,
            companyName: true,
            country: true,
            service: true,
            budgetRange: true,
            status: true,
            createdAt: true,
            approvalEmailSent: true,
          },
        }),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: await prisma.enquiry.count(),
        pending,
        approved,
        rejected,
        thisMonth,
      },
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      items,
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return jsonError("Database is not configured.", 503);
    }
    console.error("[api/enquiries]", error instanceof Error ? error.message : error);
    return jsonError("Unable to load enquiries.", 500);
  }
}
