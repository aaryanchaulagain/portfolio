import type { Metadata } from "next";
import { SiteImageUploadCard } from "@/components/admin/SiteImageUploadCard";
import { getSiteMediaUrls } from "@/lib/site-media";

export const metadata: Metadata = {
  title: "Site images",
  robots: { index: false, follow: false },
};

export default async function AdminImagesPage() {
  const media = await getSiteMediaUrls();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Images
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          Landing & About photos
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Upload the home page hero portrait and the About section photo. Changes
          appear on the public site as soon as you publish.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SiteImageUploadCard
          slot="hero"
          title="Home / landing image"
          description="Shown in the hero section on the homepage."
          currentUrl={media.hero}
          fileName={media.heroFileName}
          updatedAt={media.heroUpdatedAt}
          hasCustom={Boolean(media.heroFileName)}
        />
        <SiteImageUploadCard
          slot="about"
          title="About us image"
          description="Shown in the About section beside your biography."
          currentUrl={media.about}
          fileName={media.aboutFileName}
          updatedAt={media.aboutUpdatedAt}
          hasCustom={Boolean(media.aboutFileName)}
        />
      </div>
    </div>
  );
}
