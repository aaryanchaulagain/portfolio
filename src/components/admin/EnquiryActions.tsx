"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Enquiry, EnquiryStatus } from "@prisma/client";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

type Action =
  | "approve"
  | "reject"
  | "contacted"
  | "closed"
  | "spam"
  | "update"
  | "delete";

export function EnquiryActions({
  enquiry,
}: {
  enquiry: Pick<
    Enquiry,
    | "id"
    | "status"
    | "adminNote"
    | "clientMessage"
    | "approvalEmailSent"
    | "referenceNumber"
    | "email"
    | "fullName"
  >;
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [adminNote, setAdminNote] = useState(enquiry.adminNote ?? "");
  const [clientMessage, setClientMessage] = useState(
    enquiry.clientMessage ?? "",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);

  async function runAction(action: Action) {
    setPendingAction(action);
    setError(null);
    setMessage(null);

    if (action === "delete") {
      const confirmed = window.confirm(
        `Delete enquiry ${enquiry.referenceNumber}? This cannot be undone.`,
      );
      if (!confirmed) {
        setPendingAction(null);
        return;
      }
    }

    try {
      const response = await fetch(`/api/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminNote,
          clientMessage,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
        enquiry?: { emailDeliveryStatus?: string | null };
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Action failed.");
      }

      if (action === "delete") {
        router.push("/admin/contacts");
        router.refresh();
        return;
      }

      if (action === "approve") {
        const delivery = payload.enquiry?.emailDeliveryStatus ?? "";
        const skipped = delivery.includes("skipped");
        showToast({
          title: skipped ? "Enquiry approved" : "Approval email sent",
          description: skipped
            ? `${enquiry.fullName} was approved. Add RESEND_API_KEY to send real emails.`
            : `A professional approval email was sent to ${enquiry.email}.`,
          variant: "success",
        });
      }

      setMessage(payload.message ?? "Saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
      if (action === "approve") {
        showToast({
          title: "Approval failed",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "error",
        });
      }
    } finally {
      setPendingAction(null);
    }
  }

  function onSaveNotes(event: FormEvent) {
    event.preventDefault();
    void runAction("update");
  }

  const busy = pendingAction !== null;
  const status = enquiry.status as EnquiryStatus;

  return (
    <div className="space-y-4">
      <form onSubmit={onSaveNotes} className="space-y-3">
        <Textarea
          label="Private admin note"
          name="adminNote"
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
        />
        <p className="-mt-2 text-xs text-muted">
          Only visible in the admin dashboard.
        </p>
        <Textarea
          label="Client message (optional)"
          name="clientMessage"
          value={clientMessage}
          onChange={(event) => setClientMessage(event.target.value)}
        />
        <p className="-mt-2 text-xs text-muted">
          Included in the approval email when you approve.
        </p>
        <Button type="submit" variant="secondary" size="sm" disabled={busy}>
          {pendingAction === "update" ? "Saving…" : "Save notes"}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={busy || (status === "APPROVED" && enquiry.approvalEmailSent)}
          onClick={() => void runAction("approve")}
        >
          {pendingAction === "approve"
            ? "Sending…"
            : enquiry.approvalEmailSent
              ? "Already approved"
              : "Approve and Send Email"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => void runAction("reject")}
        >
          Reject
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => void runAction("contacted")}
        >
          Mark contacted
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => void runAction("closed")}
        >
          Close
        </Button>
        <Button
          type="button"
          size="sm"
          variant="danger"
          disabled={busy}
          onClick={() => void runAction("spam")}
        >
          Mark spam
        </Button>
        <Button
          type="button"
          size="sm"
          variant="danger"
          disabled={busy}
          onClick={() => void runAction("delete")}
        >
          Delete
        </Button>
      </div>

      {message ? (
        <p className="text-sm text-success" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
