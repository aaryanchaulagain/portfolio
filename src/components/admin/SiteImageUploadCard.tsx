"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import type { SiteMediaSlot } from "@/lib/site-media";

type ImageCardProps = {
  slot: SiteMediaSlot;
  title: string;
  description: string;
  currentUrl: string;
  fileName: string | null;
  updatedAt: string | null;
  hasCustom: boolean;
};

export function SiteImageUploadCard({
  slot,
  title,
  description,
  currentUrl,
  fileName,
  updatedAt,
  hasCustom,
}: ImageCardProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState<"upload" | "remove" | null>(null);

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

    setPending("upload");
    try {
      const body = new FormData();
      body.set("slot", slot);
      body.set("file", file);

      const response = await fetch("/api/admin/media", {
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
        description: "The public website will use this image immediately.",
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
      setPending(null);
    }
  }

  async function onRemove() {
    setPending("remove");
    try {
      const response = await fetch(`/api/admin/media?slot=${slot}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Could not remove image.");
      }

      showToast({
        title: `${title} reset`,
        description: "The default placeholder image will be used again.",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      showToast({
        title: "Remove failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error",
      });
    } finally {
      setPending(null);
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

      <div className="relative mt-5 aspect-[4/5] max-w-sm overflow-hidden rounded-2xl border border-border bg-surface-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displaySrc}
          alt={`${title} preview`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-3 space-y-1 text-xs text-muted">
        <p>
          Source:{" "}
          <span className="text-foreground">
            {hasCustom ? "Dashboard upload" : "Default placeholder"}
          </span>
        </p>
        {fileName ? <p>File: {fileName}</p> : null}
        {updatedAt ? (
          <p>Updated: {new Date(updatedAt).toLocaleString()}</p>
        ) : null}
      </div>

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
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" disabled={pending !== null}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            {pending === "upload" ? "Uploading…" : "Upload & publish"}
          </Button>
          {hasCustom ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={pending !== null}
              onClick={() => void onRemove()}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {pending === "remove" ? "Removing…" : "Reset to default"}
            </Button>
          ) : null}
        </div>
      </form>
    </article>
  );
}
