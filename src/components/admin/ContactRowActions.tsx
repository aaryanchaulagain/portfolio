"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EnquiryStatus } from "@prisma/client";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";

export function ContactRowActions({
  id,
  status,
  email,
  fullName,
  approvalEmailSent,
}: {
  id: string;
  status: EnquiryStatus;
  email: string;
  fullName: string;
  approvalEmailSent: boolean;
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, setPending] = useState<"approve" | "reject" | null>(null);

  async function run(action: "approve" | "reject") {
    setPending(action);
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
        enquiry?: { approvalEmailSent?: boolean; emailDeliveryStatus?: string | null };
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Action failed.");
      }

      if (action === "approve") {
        const delivery = payload.enquiry?.emailDeliveryStatus ?? "";
        const skipped = delivery.includes("skipped");
        showToast({
          title: skipped
            ? "Enquiry approved"
            : "Approval email sent",
          description: skipped
            ? `${fullName} was approved. Email was skipped locally (add RESEND_API_KEY to send for real).`
            : `A professional approval email was sent to ${email}.`,
          variant: "success",
        });
      } else {
        showToast({
          title: "Enquiry rejected",
          description: `${fullName}'s enquiry was marked as rejected.`,
          variant: "success",
        });
      }

      router.refresh();
    } catch (error) {
      showToast({
        title: action === "approve" ? "Approval failed" : "Reject failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setPending(null);
    }
  }

  const approvedLocked = status === "APPROVED" && approvalEmailSent;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        disabled={pending !== null || approvedLocked}
        onClick={() => void run("approve")}
      >
        {pending === "approve"
          ? "Sending…"
          : approvedLocked
            ? "Approved"
            : "Approve"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={pending !== null || status === "REJECTED"}
        onClick={() => void run("reject")}
      >
        {pending === "reject" ? "…" : "Reject"}
      </Button>
    </div>
  );
}
