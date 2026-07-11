"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ContentImageUpload } from "@/components/admin/ContentImageUpload";
import {
  FormImagePicker,
  uploadContentImage,
} from "@/components/admin/FormImagePicker";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export type ServiceFormValues = {
  id?: string;
  title: string;
  outcome: string;
  icon: string;
  sortOrder: number;
  published: boolean;
  imageUrl?: string;
  coverImageUrl?: string | null;
  coverImageFileName?: string | null;
};

export function ServiceForm({
  initial,
  mode,
}: {
  initial?: ServiceFormValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, setPending] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [outcome, setOutcome] = useState(initial?.outcome ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "globe");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [published, setPublished] = useState(initial?.published ?? true);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const body = {
      title: title.trim(),
      outcome: outcome.trim(),
      icon: icon.trim() || "globe",
      sortOrder: Number(sortOrder) || 0,
      published,
    };

    setPending(true);
    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/services"
          : `/api/admin/services/${initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        item?: { id: string };
      } | null;

      if (!response.ok || !payload?.success || !payload.item) {
        throw new Error(payload?.error ?? "Could not save the service.");
      }

      const serviceId = payload.item.id;

      if (coverFile) {
        await uploadContentImage({
          file: coverFile,
          attachTo: "serviceCover",
          entityId: serviceId,
        });
      }

      showToast({
        title: mode === "create" ? "Service created" : "Service updated",
        description: coverFile
          ? "Service and image are saved."
          : "Changes are saved.",
        variant: "success",
      });

      if (mode === "create") {
        router.push(`/admin/services/${serviceId}`);
      } else {
        setCoverFile(null);
        router.refresh();
      }
    } catch (error) {
      showToast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <Input
          label="Title"
          name="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Textarea
          label="Outcome"
          name="outcome"
          required
          value={outcome}
          onChange={(event) => setOutcome(event.target.value)}
        />

        <FormImagePicker
          title="Service image"
          description="Upload a high-quality image for this service card (homepage and /services page)."
          currentUrl={initial?.coverImageUrl || initial?.imageUrl || null}
          fileName={initial?.coverImageFileName}
          file={coverFile}
          onFileChange={setCoverFile}
          aspectClassName="aspect-[16/10]"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Icon"
            name="icon"
            hint="Icon key used by the public site (e.g. globe, layout, shopping-bag)"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
          />
          <Input
            label="Sort order"
            name="sortOrder"
            type="number"
            min={0}
            max={10000}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="accent-[var(--accent)]"
          />
          Published
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create service"
                : "Save changes"}
          </Button>
          <Link
            href="/admin/services"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold hover:bg-surface-elevated"
          >
            Cancel
          </Link>
        </div>
      </form>

      {mode === "edit" && initial?.id ? (
        <ContentImageUpload
          title="Replace service image"
          description="Optional quick replace without editing other fields."
          attachTo="serviceCover"
          entityId={initial.id}
          currentUrl={initial.coverImageUrl ?? null}
          fileName={initial.coverImageFileName}
        />
      ) : null}
    </div>
  );
}
