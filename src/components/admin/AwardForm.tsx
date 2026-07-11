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

export type AwardFormValues = {
  id?: string;
  title: string;
  organizer: string;
  year: number;
  description: string;
  projectName: string;
  verificationLink: string;
  sortOrder: number;
  published: boolean;
  certificateImageUrl?: string | null;
  eventImageUrl?: string | null;
  certificateImageFileName?: string | null;
  eventImageFileName?: string | null;
};

export function AwardForm({
  initial,
  mode,
}: {
  initial?: AwardFormValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, setPending] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [eventFile, setEventFile] = useState<File | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [organizer, setOrganizer] = useState(initial?.organizer ?? "");
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [projectName, setProjectName] = useState(initial?.projectName ?? "");
  const [verificationLink, setVerificationLink] = useState(
    initial?.verificationLink ?? "",
  );
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [published, setPublished] = useState(initial?.published ?? true);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const body = {
      title: title.trim(),
      organizer: organizer.trim(),
      year: Number(year),
      description: description.trim(),
      projectName: projectName.trim(),
      verificationLink: verificationLink.trim(),
      sortOrder: Number(sortOrder) || 0,
      published,
    };

    setPending(true);
    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/awards"
          : `/api/admin/awards/${initial?.id}`,
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
        throw new Error(payload?.error ?? "Could not save the award.");
      }

      const awardId = payload.item.id;

      if (certificateFile) {
        await uploadContentImage({
          file: certificateFile,
          attachTo: "awardCertificate",
          entityId: awardId,
        });
      }

      if (eventFile) {
        await uploadContentImage({
          file: eventFile,
          attachTo: "awardEvent",
          entityId: awardId,
        });
      }

      const uploadedCount =
        Number(Boolean(certificateFile)) + Number(Boolean(eventFile));

      showToast({
        title: mode === "create" ? "Award created" : "Award updated",
        description:
          uploadedCount > 0
            ? `Saved with ${uploadedCount} image${uploadedCount === 1 ? "" : "s"}.`
            : "Changes are saved.",
        variant: "success",
      });

      if (mode === "create") {
        router.push(`/admin/awards/${awardId}`);
      } else {
        setCertificateFile(null);
        setEventFile(null);
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
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Title"
            name="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            label="Organizer"
            name="organizer"
            required
            value={organizer}
            onChange={(event) => setOrganizer(event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Year"
            name="year"
            type="number"
            required
            min={1990}
            max={2100}
            value={year}
            onChange={(event) => setYear(event.target.value)}
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
          <Input
            label="Project name"
            name="projectName"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <Input
          label="Verification link"
          name="verificationLink"
          value={verificationLink}
          onChange={(event) => setVerificationLink(event.target.value)}
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <FormImagePicker
            title="Certificate image"
            description="Upload the official certificate or badge photo from your desktop."
            currentUrl={initial?.certificateImageUrl}
            fileName={initial?.certificateImageFileName}
            file={certificateFile}
            onFileChange={setCertificateFile}
            aspectClassName="aspect-[4/3]"
          />
          <FormImagePicker
            title="Event image"
            description="Upload a photo from the award or hackathon event."
            currentUrl={initial?.eventImageUrl}
            fileName={initial?.eventImageFileName}
            file={eventFile}
            onFileChange={setEventFile}
            aspectClassName="aspect-[4/3]"
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
                ? "Create award"
                : "Save changes"}
          </Button>
          <Link
            href="/admin/awards"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold hover:bg-surface-elevated"
          >
            Cancel
          </Link>
        </div>
      </form>

      {mode === "edit" && initial?.id ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <ContentImageUpload
            title="Replace certificate"
            description="Optional quick replace without editing other fields."
            attachTo="awardCertificate"
            entityId={initial.id}
            currentUrl={initial.certificateImageUrl ?? null}
            fileName={initial.certificateImageFileName}
          />
          <ContentImageUpload
            title="Replace event photo"
            description="Optional quick replace without editing other fields."
            attachTo="awardEvent"
            entityId={initial.id}
            currentUrl={initial.eventImageUrl ?? null}
            fileName={initial.eventImageFileName}
          />
        </div>
      ) : null}
    </div>
  );
}
