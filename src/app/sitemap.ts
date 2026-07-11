import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { siteConfig } from "@/data/profile";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();
  const projects = await getProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/skills",
    "/services",
    "/awards",
    "/projects",
    "/testimonials",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency:
      path === "" || path === "/projects" || path === "/services"
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/contact" ||
            path === "/projects" ||
            path === "/services"
          ? 0.9
          : 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
