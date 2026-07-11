"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import type { ContentImageAttachTo } from "@/lib/cms";

type ContentImageUploadProps = {
  title: string;
  description: string;
  attachTo: ContentImageAttachTo;
  entityId: string;
  currentUrl: string | null;
  fileName?: string | null;
};

export function ContentImageUpload({
  title,
  description,
  attachTo,
  entityId,
  currentUrl,
  fileName,
}: ContentImageUploadProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(next ? URL.createObjectURL(next) : null);
  }

  async function onUpload(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      showToast({
        title: "Choose an image",
        description: "Select a JPG, PNG, WEBP, or GIF file first.",
        variant: "error",
      });
      return;
    }

    setPending(true);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("attachTo", attachTo);
      body.set("entityId", entityId);

      const response = await fetch("/api/admin/content-image", {
        method: "POST",
        body,
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Upload failed.");
      }

      showToast({
        title: `${title} updated`,
        description: "The image is attached and ready for the public site.",
        variant: "success",
      });
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      router.refresh();
    } catch (error) {
      showToast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPending(false);
    }
  }

  const displaySrc = preview ?? currentUrl;

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-accent/10 p-2.5 text-accent ring-1 ring-accent/20">
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>

      <div className="relative mt-5 aspect-video max-w-md overflow-hidden rounded-2xl border border-border bg-surface-elevated">
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displaySrc}
            alt={`${title} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image yet
          </div>
        )}
      </div>

      {fileName ? (
        <p className="mt-3 text-xs text-muted">File: {fileName}</p>
      ) : null}

      <form onSubmit={onUpload} className="mt-5 space-y-3">
        <label className="block text-sm font-medium">
          Choose image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-accent"
          />
        </label>
        <Button type="submit" size="sm" disabled={pending}>
          <Upload className="h-4 w-4" aria-hidden="true" />
          {pending ? "Uploading…" : "Upload image"}
        </Button>
      </form>
    </article>
  );
}
