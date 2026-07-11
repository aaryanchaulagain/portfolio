import { revalidateTag } from "next/cache";

export type ContentTag =
  | "projects"
  | "awards"
  | "skills"
  | "services"
  | "testimonials"
  | "site-media";

/** Bust public CMS caches after admin creates/updates/deletes content. */
export function revalidateContent(...tags: ContentTag[]) {
  for (const tag of tags) {
    // Immediate expiry so the next public visit refetches (admin route handlers).
    revalidateTag(tag, { expire: 0 });
  }
}
