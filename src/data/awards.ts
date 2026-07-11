import type { AwardItem } from "@/types";

/**
 * IMPORTANT BEFORE PUBLISHING:
 * Replace organizer names, award titles, and descriptions with the exact
 * official award wording from certificates or organiser announcements.
 * Do not invent event locations, project names, judges, rankings, or categories.
 */
export const awards: AwardItem[] = [
  {
    id: "best-idea-2026",
    title: "Best Idea Award",
    organizer: "KMC / IIC Hackathon",
    year: 2026,
    description:
      "Recognized for presenting an innovative, practical, and impact-focused technology idea during a hackathon environment.",
    projectName: "[PROJECT_NAME_2026]",
    certificateImage: "/images/awards/[CERTIFICATE_IMAGE]",
    eventImage: "/images/awards/[HACKATHON_IMAGE_2026]",
    verificationLink: "[VERIFICATION_LINK_2026]",
  },
  {
    id: "code-it-best-idea-2025",
    title: "Code IT Best Idea Award",
    organizer: "[ORGANIZER_2025]",
    year: 2025,
    description:
      "Recognized for contributing an original technology concept focused on solving a meaningful real-world problem.",
    projectName: "[PROJECT_NAME_2025]",
    certificateImage: "/images/awards/[CERTIFICATE_IMAGE]",
    eventImage: "/images/awards/[AWARD_IMAGE_2025]",
    verificationLink: "[VERIFICATION_LINK_2025]",
  },
];
