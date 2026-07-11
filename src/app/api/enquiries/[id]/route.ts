import { EnquiryStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import {
  DatabaseUnavailableError,
  isDatabaseConfigured,
  prisma,
} from "@/lib/database";
import { sendApprovalEmail } from "@/lib/email";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

const patchSchema = z.object({
  action: z.enum([
    "approve",
    "reject",
    "contacted",
    "closed",
    "spam",
    "update",
    "delete",
  ]),
  adminNote: z.string().max(5000).optional().nullable(),
  clientMessage: z.string().max(5000).optional().nullable(),
  status: z
    .enum([
      EnquiryStatus.PENDING,
      EnquiryStatus.APPROVED,
      EnquiryStatus.REJECTED,
      EnquiryStatus.CONTACTED,
      EnquiryStatus.CLOSED,
      EnquiryStatus.SPAM,
    ])
    .optional(),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdminSession();
    if (!session) return jsonError("Unauthorized.", 401);

    if (!isDatabaseConfigured()) {
      return jsonError("Database is not configured.", 503);
    }

    const { id } = await context.params;
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!enquiry) return jsonError("Enquiry not found.", 404);

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return jsonError("Database is not configured.", 503);
    }
    console.error(
      "[api/enquiries/id]",
      error instanceof Error ? error.message : error,
    );
    return jsonError("Unable to load enquiry.", 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdminSession();
    if (!session) return jsonError("Unauthorized.", 401);

    if (!isDatabaseConfigured()) {
      return jsonError("Database is not configured.", 503);
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid request.", 400);
    }

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) return jsonError("Enquiry not found.", 404);

    const { action, adminNote, clientMessage, status } = parsed.data;

    if (action === "delete") {
      await prisma.enquiry.delete({ where: { id } });
      return NextResponse.json({ success: true, deleted: true });
    }

    if (action === "update") {
      const enquiry = await prisma.enquiry.update({
        where: { id },
        data: {
          ...(adminNote !== undefined ? { adminNote } : {}),
          ...(clientMessage !== undefined ? { clientMessage } : {}),
          ...(status ? { status } : {}),
        },
        include: {
          activities: { orderBy: { createdAt: "desc" } },
        },
      });

      await prisma.activityLog.create({
        data: {
          enquiryId: id,
          action: "UPDATED",
          detail: "Admin updated enquiry fields",
        },
      });

      return NextResponse.json({ success: true, enquiry });
    }

    if (action === "approve") {
      if (existing.approvalEmailSent) {
        const enquiry = await prisma.enquiry.update({
          where: { id },
          data: {
            status: EnquiryStatus.APPROVED,
            approvedAt: existing.approvedAt ?? new Date(),
            ...(adminNote !== undefined ? { adminNote } : {}),
            ...(clientMessage !== undefined ? { clientMessage } : {}),
          },
          include: {
            activities: { orderBy: { createdAt: "desc" } },
          },
        });

        return NextResponse.json({
          success: true,
          enquiry,
          message: "Already approved; approval email was not resent.",
        });
      }

      const message =
        clientMessage !== undefined ? clientMessage : existing.clientMessage;
      const note = adminNote !== undefined ? adminNote : existing.adminNote;

      const emailResult = await sendApprovalEmail(
        {
          ...existing,
          clientMessage: message ?? existing.clientMessage,
        },
        message,
      );

      const enquiry = await prisma.enquiry.update({
        where: { id },
        data: {
          status: EnquiryStatus.APPROVED,
          approvedAt: new Date(),
          adminNote: note,
          clientMessage: message,
          approvalEmailSent: emailResult.success,
          emailDeliveryStatus: emailResult.success
            ? emailResult.skipped
              ? "approval:skipped"
              : "approval:sent"
            : `approval:failed:${emailResult.error ?? "unknown"}`,
        },
        include: {
          activities: { orderBy: { createdAt: "desc" } },
        },
      });

      await prisma.activityLog.create({
        data: {
          enquiryId: id,
          action: "APPROVED",
          detail: emailResult.success
            ? emailResult.skipped
              ? "Approved; approval email skipped (no Resend key)"
              : "Approved and approval email sent"
            : `Approved but email failed: ${emailResult.error ?? "unknown"}`,
        },
      });

      if (!emailResult.success && process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            success: false,
            error: "Enquiry approved but the approval email failed to send.",
            enquiry,
          },
          { status: 502 },
        );
      }

      return NextResponse.json({ success: true, enquiry });
    }

    const statusMap = {
      reject: EnquiryStatus.REJECTED,
      contacted: EnquiryStatus.CONTACTED,
      closed: EnquiryStatus.CLOSED,
      spam: EnquiryStatus.SPAM,
    } as const;

    const nextStatus = statusMap[action];
    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: {
        status: nextStatus,
        ...(adminNote !== undefined ? { adminNote } : {}),
        ...(clientMessage !== undefined ? { clientMessage } : {}),
        ...(action === "contacted" ? { contactedAt: new Date() } : {}),
      },
      include: {
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    await prisma.activityLog.create({
      data: {
        enquiryId: id,
        action: nextStatus,
        detail: `Status set to ${nextStatus}`,
      },
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return jsonError("Database is not configured.", 503);
    }
    console.error(
      "[api/enquiries/id PATCH]",
      error instanceof Error ? error.message : error,
    );
    return jsonError("Unable to update enquiry.", 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const patched = await PATCH(
    new Request(request.url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete" }),
    }),
    context,
  );
  return patched;
}
