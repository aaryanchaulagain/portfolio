"use client";

import { useState, type ChangeEvent } from "react";
import { ImageIcon } from "lucide-react";
import type { ContentImageAttachTo } from "@/lib/cms";

type FormImagePickerProps = {
  title: string;
  description: string;
  currentUrl?: string | null;
  fileName?: string | null;
  file: File | null;
  onFileChange: (file: File | null) => void;
  aspectClassName?: string;
};

export function FormImagePicker({
  title,
  description,
  currentUrl,
  fileName,
  file,
  onFileChange,
  aspectClassName = "aspect-video",
}: FormImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(next ? URL.createObjectURL(next) : null);
    onFileChange(next);
  }

  const displaySrc = preview ?? currentUrl ?? null;

  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-accent/10 p-2.5 text-accent ring-1 ring-accent/20">
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
      </div>

      <div
        className={`relative mt-4 overflow-hidden rounded-xl border border-border bg-surface-elevated ${aspectClassName}`}
      >
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displaySrc}
            alt={`${title} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
            Choose an image from your computer
          </div>
        )}
      </div>

      {(file?.name || fileName) && (
        <p className="mt-2 truncate text-xs text-muted">
          File: {file?.name ?? fileName}
        </p>
      )}

      <label className="mt-3 block text-sm font-medium">
        Choose from desktop
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          className="mt-1.5 block w-full cursor-pointer text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-accent"
        />
      </label>
    </div>
  );
}

export async function uploadContentImage({
  file,
  attachTo,
  entityId,
}: {
  file: File;
  attachTo: ContentImageAttachTo;
  entityId: string;
}) {
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
    throw new Error(payload?.error ?? `Could not upload ${attachTo}.`);
  }
}
