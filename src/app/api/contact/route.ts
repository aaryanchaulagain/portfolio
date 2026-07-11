import { NextResponse } from "next/server";
import { EnquiryStatus } from "@prisma/client";
import {
  DatabaseUnavailableError,
  isDatabaseConfigured,
  prisma,
  requireDatabase,
} from "@/lib/database";
import {
  sendAdminNotification,
  sendVisitorConfirmation,
} from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import {
  createReferenceNumber,
  getClientIp,
  hashIp,
  hashSubmission,
} from "@/lib/security";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactFormSchema } from "@/lib/validation";

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError(
        "The enquiry service is temporarily unavailable. Please try again later or email me directly.",
        503,
      );
    }

    requireDatabase();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const raw =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};

    // Honeypot — silent success so bots are not tipped off
    if (typeof raw.website === "string" && raw.website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        referenceNumber: createReferenceNumber(),
      });
    }

    const parsed = contactFormSchema.safeParse(raw);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message ?? "Please check the form and try again.",
        400,
      );
    }

    const values = parsed.data;
    const ip = getClientIp(request.headers);
    const ipHash = hashIp(ip);
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

    const turnstileToken =
      typeof raw.turnstileToken === "string" ? raw.turnstileToken : undefined;
    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.ok) {
      return jsonError(
        turnstile.error ?? "Bot verification failed.",
        400,
      );
    }

    const limited = rateLimit({
      key: `contact:${ipHash}`,
      limit: 5,
      windowMs: 60_000,
    });
    if (!limited.success) {
      return jsonError(
        "Too many submissions. Please wait a moment and try again.",
        429,
      );
    }

    const submissionHash = hashSubmission(
      values.email,
      values.projectDescription,
    );
    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
    const recent = await prisma.enquiry.findMany({
      where: {
        email: { equals: values.email, mode: "insensitive" },
        createdAt: { gte: since },
      },
      select: {
        projectDescription: true,
        referenceNumber: true,
      },
      take: 20,
    });

    const duplicate = recent.find(
      (item) =>
        hashSubmission(values.email, item.projectDescription) ===
        submissionHash,
    );
    if (duplicate) {
      return NextResponse.json({
        success: true,
        referenceNumber: duplicate.referenceNumber,
      });
    }

    let referenceNumber = createReferenceNumber();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const exists = await prisma.enquiry.findUnique({
        where: { referenceNumber },
        select: { id: true },
      });
      if (!exists) break;
      referenceNumber = createReferenceNumber();
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNumber,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || null,
        companyName: values.companyName || null,
        country: values.country,
        service: values.service,
        budgetRange: values.budgetRange,
        timeline: values.timeline,
        projectDescription: values.projectDescription,
        consentAccepted: values.consentAccepted,
        status: EnquiryStatus.PENDING,
        ipHash,
        userAgent,
        activities: {
          create: {
            action: "CREATED",
            detail: "Enquiry submitted via contact form",
          },
        },
      },
    });

    const [adminResult, visitorResult] = await Promise.all([
      sendAdminNotification(enquiry),
      sendVisitorConfirmation(enquiry),
    ]);

    const confirmationEmailSent = visitorResult.success;
    const emailDeliveryStatus = [
      adminResult.success
        ? adminResult.skipped
          ? "admin:skipped"
          : "admin:sent"
        : "admin:failed",
      visitorResult.success
        ? visitorResult.skipped
          ? "visitor:skipped"
          : "visitor:sent"
        : "visitor:failed",
    ].join(",");

    await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: {
        confirmationEmailSent,
        emailDeliveryStatus,
      },
    });

    if (visitorResult.success) {
      await prisma.activityLog.create({
        data: {
          enquiryId: enquiry.id,
          action: "CONFIRMATION_EMAIL_SENT",
          detail: visitorResult.skipped
            ? "Confirmation email skipped (no Resend key in development)"
            : "Visitor confirmation email sent",
        },
      });
    }

    return NextResponse.json({
      success: true,
      referenceNumber: enquiry.referenceNumber,
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return jsonError(
        "The enquiry service is temporarily unavailable. Please try again later or email me directly.",
        503,
      );
    }

    console.error("[api/contact]", error instanceof Error ? error.message : error);
    return jsonError(
      "Unable to send your enquiry right now. Please try again shortly or email me directly.",
      500,
    );
  }
}
