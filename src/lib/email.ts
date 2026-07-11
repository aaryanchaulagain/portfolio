import type { Enquiry } from "@prisma/client";
import { Resend } from "resend";
import { profile, siteConfig } from "@/data/profile";
import { absoluteUrl, formatDate } from "@/lib/utils";

export type EmailResult = {
  success: boolean;
  skipped?: boolean;
  error?: string;
  id?: string;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    `Portfolio <noreply@${new URL(siteConfig.siteUrl).hostname}>`
  );
}

function getAdminInbox() {
  return process.env.ADMIN_EMAIL?.trim() || profile.email;
}

function getSchedulingLink() {
  return (
    process.env.SCHEDULING_LINK?.trim() ||
    (profile.schedulingLink.startsWith("http")
      ? profile.schedulingLink
      : undefined)
  );
}

async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] RESEND_API_KEY missing — soft success in development.");
      console.info(`[email] Would send to ${to}: ${subject}`);
      return { success: true, skipped: true };
    }
    return {
      success: false,
      error: "Email service is not configured.",
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    console.error("[email] Unexpected error:", message);
    return { success: false, error: message };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textToHtml(text: string) {
  return `<div style="font-family:Georgia,serif;line-height:1.6;color:#0f172a;white-space:pre-wrap;">${escapeHtml(text)}</div>`;
}

export async function sendAdminNotification(
  enquiry: Enquiry,
): Promise<EmailResult> {
  const adminUrl = absoluteUrl(`/admin/contacts/${enquiry.id}`);
  const text = [
    "New project enquiry received.",
    "",
    `Reference: ${enquiry.referenceNumber}`,
    `Name: ${enquiry.fullName}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "—"}`,
    `Company: ${enquiry.companyName || "—"}`,
    `Country: ${enquiry.country}`,
    `Service: ${enquiry.service}`,
    `Budget: ${enquiry.budgetRange}`,
    `Timeline: ${enquiry.timeline}`,
    `Submitted: ${formatDate(enquiry.createdAt)}`,
    "",
    "Project description:",
    enquiry.projectDescription,
    "",
    `Open in admin: ${adminUrl}`,
  ].join("\n");

  return sendEmail({
    to: getAdminInbox(),
    subject: `New enquiry ${enquiry.referenceNumber} — ${enquiry.fullName}`,
    text,
    html: textToHtml(text),
  });
}

export async function sendVisitorConfirmation(
  enquiry: Enquiry,
): Promise<EmailResult> {
  const text = [
    `Thank you for contacting ${profile.fullName}. Your project enquiry has been received successfully and is currently being reviewed. Your enquiry reference is ${enquiry.referenceNumber}. You will receive another email after the enquiry has been reviewed.`,
  ].join("\n");

  return sendEmail({
    to: enquiry.email,
    subject: "We received your project enquiry",
    text,
    html: textToHtml(text),
  });
}

export async function sendApprovalEmail(
  enquiry: Enquiry,
  clientMessage?: string | null,
): Promise<EmailResult> {
  const schedulingLink = getSchedulingLink();
  const optionalMessage = clientMessage?.trim()
    ? `\n\n${clientMessage.trim()}\n`
    : "\n";
  const schedulingBlock = schedulingLink
    ? `\nScheduling link: ${schedulingLink}\n`
    : "\n";

  const text = [
    `Hello ${enquiry.fullName},`,
    "",
    "Thank you for sharing your project requirements.",
    "",
    "I have reviewed your enquiry and would be pleased to discuss the project in more detail. The next step is to arrange a short discovery conversation so we can clarify the scope, timeline, priorities, and expected outcome.",
    "",
    `Your enquiry reference is ${enquiry.referenceNumber}.`,
    optionalMessage.trimEnd(),
    "You can reply directly to this email or use the scheduling link below.",
    schedulingBlock.trimEnd(),
    "",
    "Kind regards,",
    profile.fullName,
    profile.title,
  ]
    .filter((line) => line !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return sendEmail({
    to: enquiry.email,
    subject: "Your project enquiry has been reviewed",
    text,
    html: textToHtml(text),
  });
}
