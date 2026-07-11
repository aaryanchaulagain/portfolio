import { describe, expect, it } from "vitest";
import { createPageMetadata } from "@/lib/seo";
import { projects, projectFilters, getProjectBySlug } from "@/data/projects";

describe("SEO metadata", () => {
  it("includes title, description, and canonical path", () => {
    const metadata = createPageMetadata({
      title: "Projects",
      description: "Shipped work and case studies.",
      path: "/projects",
    });

    expect(metadata.title).toContain("Projects");
    expect(metadata.description).toContain("Shipped work");
    expect(metadata.alternates?.canonical).toContain("/projects");
    expect(metadata.openGraph?.url).toContain("/projects");
  });
});

describe("project filtering data", () => {
  it("exposes expected filter categories", () => {
    const ids = projectFilters.map((filter) => filter.id);
    expect(ids).toEqual([
      "all",
      "client",
      "web-app",
      "ecommerce",
      "ai",
      "hackathon",
    ]);
  });

  it("resolves projects by slug", () => {
    const sample = projects[0];
    expect(getProjectBySlug(sample.slug)?.title).toBe(sample.title);
    expect(getProjectBySlug("missing-slug")).toBeUndefined();
  });

  it("marks private client projects explicitly", () => {
    const privateProjects = projects.filter((project) => project.isPrivateClient);
    expect(privateProjects.length).toBeGreaterThan(0);
    privateProjects.forEach((project) => {
      expect(project.status === "private" || project.isPrivateClient).toBe(true);
    });
  });
});
