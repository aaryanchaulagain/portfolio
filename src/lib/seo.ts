import { profile, siteConfig } from "@/data/profile";
import { absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next";

export function createPageMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title
    ? `${title} | ${profile.fullName}`
    : siteConfig.siteName;
  const pageDescription =
    description ??
    `Professional software and web developer working with Australian clients. Explore custom websites, web applications, e-commerce platforms, dashboards, AI projects, and freelance development services.`;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? siteConfig.defaultOgImage);

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: profile.fullName,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    jobTitle: profile.title,
    url: siteConfig.siteUrl,
    email: profile.email,
    sameAs: [profile.linkedInUrl, profile.githubUrl].filter(
      (url) => !url.startsWith("["),
    ),
    knowsAbout: [
      "Software development",
      "Web development",
      "Next.js",
      "Laravel",
      "Business systems",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
      addressLocality: profile.location,
    },
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${profile.fullName} — Freelance Software Development`,
    description: profile.alternativeHeadline,
    url: siteConfig.siteUrl,
    areaServed: ["AU", "Remote"],
    serviceType: [
      "Business website development",
      "Custom web application development",
      "E-commerce development",
      "Admin dashboard development",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.fullName,
    url: siteConfig.siteUrl,
    description: profile.alternativeHeadline,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function softwareApplicationJsonLd(project: {
  title: string;
  summary: string;
  slug: string;
  technologies: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    creator: {
      "@type": "Person",
      name: profile.fullName,
      jobTitle: profile.title,
    },
    keywords: project.technologies.join(", "),
    inLanguage: "en-AU",
  };
}
