"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";

type DeleteEntityButtonProps = {
  endpoint: string;
  label: string;
  confirmMessage: string;
  redirectTo?: string;
  size?: "sm" | "md";
};

export function DeleteEntityButton({
  endpoint,
  label,
  confirmMessage,
  redirectTo,
  size = "sm",
}: DeleteEntityButtonProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!window.confirm(confirmMessage)) return;

    setPending(true);
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Could not delete.");
      }

      showToast({
        title: `${label} deleted`,
        description: "The item was removed.",
        variant: "success",
      });

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (error) {
      showToast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant="danger"
      disabled={pending}
      onClick={() => void onDelete()}
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
