import type { ExperienceItem, WorkStep } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "freelance-au",
    role: "Freelance Software & Web Developer",
    organization: "Independent practice",
    period: "Present",
    description:
      "Working with Australian clients to design and build websites, business systems, dashboards, and custom digital products.",
    highlights: [
      "Translate business requirements into secure, maintainable software",
      "Deliver responsive interfaces with practical SEO foundations",
      "Support clients through planning, launch, and iteration",
    ],
  },
];

export const howIWork: WorkStep[] = [
  {
    step: 1,
    title: "Understand the business problem",
    description:
      "Clarify goals, constraints, users, and success criteria before writing code.",
  },
  {
    step: 2,
    title: "Plan the product and user experience",
    description:
      "Map the structure, flows, and technical approach so delivery stays focused.",
  },
  {
    step: 3,
    title: "Build and test the solution",
    description:
      "Implement the product with attention to security, usability, and maintainability.",
  },
  {
    step: 4,
    title: "Launch, improve, and provide support",
    description:
      "Ship confidently, then refine based on real usage and business feedback.",
  },
];
