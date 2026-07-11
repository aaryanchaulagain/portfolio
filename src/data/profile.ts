import type { ProfileData, SiteConfig, SocialLink } from "@/types";

/**
 * Edit this file to update personal brand details across the entire site.
 * Replace every placeholder value before publishing.
 */
export const profile: ProfileData = {
  // Replace with your legal full name before launch
  fullName: "Aryan Chaulagain",
  firstName: "Aryan",
  lastName: "Chaulagain",
  initials: "AC",
  title: "Software & Web Developer",
  headline: "Building professional digital products for modern businesses.",
  alternativeHeadline:
    "I build modern digital products that help businesses operate, grow, and serve their customers better.",
  summary:
    "I am a professional software and web developer with experience building modern websites, business systems, dashboards, e-commerce platforms, mobile-friendly applications, and custom digital solutions. I currently work as a freelancer with Australian clients, helping businesses transform their requirements into secure, scalable, and user-friendly software.\n\nI combine software development, design awareness, marketing knowledge, and business thinking. My goal is not only to write code, but to create digital products that solve genuine problems, improve business processes, and deliver measurable value.",
  availabilityLabel: "Available for selected freelance projects",
  location: "[LOCATION]",
  serviceRegion: "Australia & remote international clients",
  email: "aryanchaulagain35@gmail.com",
  phoneOrWhatsApp: "[PHONE_OR_WHATSAPP]",
  linkedInUrl: "[LINKEDIN_URL]",
  githubUrl: "[GITHUB_URL]",
  schedulingLink: "[SCHEDULING_LINK]",
  profileImagePath: "/images/profile.svg",
  aboutImagePath: "/images/about-work.jpg",
  resumeFilePath: "/resume/[RESUME_FILE_PATH].pdf",
  yearsExperienceLabel: "Freelance delivery for Australian clients",
  trustIndicators: [
    "Australian client experience",
    "Award-winning ideas",
    "Full-stack development",
    "Business-focused solutions",
  ],
  brandStatement:
    "Secure, scalable software built with clear communication and measurable business outcomes.",
};

export const siteConfig: SiteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: `${profile.fullName} | Software & Web Developer`,
  locale: "en_AU",
  defaultOgImage: "/images/og-default.jpg",
};

export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: profile.linkedInUrl,
    icon: "linkedin",
  },
  {
    label: "GitHub",
    href: profile.githubUrl,
    icon: "github",
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: "email",
  },
  {
    label: "WhatsApp",
    href: profile.phoneOrWhatsApp,
    icon: "whatsapp",
  },
];
