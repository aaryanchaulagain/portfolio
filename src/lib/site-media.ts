import { cache } from "react";
import { unstable_cache } from "next/cache";
import { profile } from "@/data/profile";
import { isDatabaseConfigured, prisma } from "@/lib/database";

export const SITE_MEDIA_SLOTS = ["hero", "about"] as const;
export type SiteMediaSlot = (typeof SITE_MEDIA_SLOTS)[number];

export function isSiteMediaSlot(value: string): value is SiteMediaSlot {
  return (SITE_MEDIA_SLOTS as readonly string[]).includes(value);
}

type SiteMediaUrls = {
  hero: string;
  about: string;
  heroUpdatedAt: string | null;
  aboutUpdatedAt: string | null;
  heroFileName: string | null;
  aboutFileName: string | null;
};

const defaults: SiteMediaUrls = {
  hero: profile.profileImagePath,
  about: profile.aboutImagePath,
  heroUpdatedAt: null,
  aboutUpdatedAt: null,
  heroFileName: null,
  aboutFileName: null,
};

const loadSiteMediaUrls = unstable_cache(
  async (): Promise<SiteMediaUrls> => {
    const rows = await prisma.siteMedia.findMany({
      where: { id: { in: [...SITE_MEDIA_SLOTS] } },
      select: { id: true, updatedAt: true, fileName: true },
    });

    const map = new Map(rows.map((row) => [row.id, row]));
    const hero = map.get("hero");
    const about = map.get("about");

    return {
      hero: hero
        ? `/api/media/hero?v=${hero.updatedAt.getTime()}`
        : defaults.hero,
      about: about
        ? `/api/media/about?v=${about.updatedAt.getTime()}`
        : defaults.about,
      heroUpdatedAt: hero?.updatedAt.toISOString() ?? null,
      aboutUpdatedAt: about?.updatedAt.toISOString() ?? null,
      heroFileName: hero?.fileName ?? null,
      aboutFileName: about?.fileName ?? null,
    };
  },
  ["site-media-urls-v1"],
  { revalidate: 60, tags: ["site-media"] },
);

export const getSiteMediaUrls = cache(async (): Promise<SiteMediaUrls> => {
  if (!isDatabaseConfigured()) return defaults;
  try {
    return await loadSiteMediaUrls();
  } catch {
    return defaults;
  }
});
