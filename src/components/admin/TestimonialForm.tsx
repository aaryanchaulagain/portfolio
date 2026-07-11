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

export type TestimonialFormValues = {
  id?: string;
  name: string;
  roleOrCompany: string;
  quote: string;
  sortOrder: number;
  published: boolean;
  photoUrl?: string | null;
  photoFileName?: string | null;
};

export function TestimonialForm({
  initial,
  mode,
}: {
  initial?: TestimonialFormValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, setPending] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [roleOrCompany, setRoleOrCompany] = useState(
    initial?.roleOrCompany ?? "",
  );
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [published, setPublished] = useState(initial?.published ?? true);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const body = {
      name: name.trim(),
      roleOrCompany: roleOrCompany.trim(),
      quote: quote.trim(),
      sortOrder: Number(sortOrder) || 0,
      published,
    };

    setPending(true);
    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/testimonials"
          : `/api/admin/testimonials/${initial?.id}`,
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
        throw new Error(payload?.error ?? "Could not save the testimonial.");
      }

      const testimonialId = payload.item.id;

      if (photoFile) {
        await uploadContentImage({
          file: photoFile,
          attachTo: "testimonialPhoto",
          entityId: testimonialId,
        });
      }

      showToast({
        title: mode === "create" ? "Testimonial created" : "Testimonial updated",
        description: photoFile
          ? "Quote and photo are saved."
          : "Changes are saved.",
        variant: "success",
      });

      if (mode === "create") {
        router.push(`/admin/testimonials/${testimonialId}`);
      } else {
        setPhotoFile(null);
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
          label="Name"
          name="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Role or company"
          name="roleOrCompany"
          hint="Optional — e.g. Founder, Melbourne retail"
          value={roleOrCompany}
          onChange={(event) => setRoleOrCompany(event.target.value)}
        />
        <Textarea
          label="Quote / description"
          name="quote"
          required
          value={quote}
          onChange={(event) => setQuote(event.target.value)}
        />

        <FormImagePicker
          title="Photo"
          description="Upload a headshot or company photo for this testimonial."
          currentUrl={initial?.photoUrl}
          fileName={initial?.photoFileName}
          file={photoFile}
          onFileChange={setPhotoFile}
          aspectClassName="aspect-square max-w-xs"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Sort order"
            name="sortOrder"
            type="number"
            min={0}
            max={10000}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
          <label className="inline-flex items-center gap-2 self-end pb-3 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="accent-[var(--accent)]"
            />
            Published
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create testimonial"
                : "Save changes"}
          </Button>
          <Link
            href="/admin/testimonials"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold hover:bg-surface-elevated"
          >
            Cancel
          </Link>
        </div>
      </form>

      {mode === "edit" && initial?.id ? (
        <ContentImageUpload
          title="Replace photo"
          description="Optional quick replace without editing other fields."
          attachTo="testimonialPhoto"
          entityId={initial.id}
          currentUrl={initial.photoUrl ?? null}
          fileName={initial.photoFileName}
        />
      ) : null}
    </div>
  );
}
