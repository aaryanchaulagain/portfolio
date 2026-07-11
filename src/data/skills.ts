import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    description:
      "Interfaces that feel fast, clear, and reliable across devices.",
    skills: [
      { name: "React.js", level: "core" },
      { name: "Next.js", level: "core" },
      { name: "JavaScript", level: "core" },
      { name: "TypeScript", level: "experienced" },
      { name: "Tailwind CSS", level: "core" },
      { name: "Responsive UI Development", level: "core" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description:
      "APIs and application logic designed for security and maintainability.",
    skills: [
      { name: "Laravel", level: "experienced" },
      { name: "PHP", level: "experienced" },
      { name: "Node.js", level: "experienced" },
      { name: "Express.js", level: "experienced" },
      { name: "Python", level: "working" },
      { name: "FastAPI", level: "working" },
      { name: "REST API Development", level: "core" },
    ],
  },
  {
    id: "database-infrastructure",
    title: "Database and Infrastructure",
    description:
      "Data storage, version control, and practical deployment workflows.",
    skills: [
      { name: "MySQL", level: "experienced" },
      { name: "PostgreSQL", level: "experienced" },
      { name: "Supabase", level: "working" },
      { name: "Firebase", level: "working" },
      { name: "Git", level: "core" },
      { name: "GitHub", level: "core" },
      { name: "VPS deployment", level: "experienced" },
      { name: "Domain and hosting configuration", level: "experienced" },
    ],
  },
  {
    id: "creative-business",
    title: "Creative and Business Skills",
    description:
      "Communication and product thinking that keep delivery aligned to outcomes.",
    skills: [
      { name: "Digital marketing", level: "working" },
      { name: "Search engine optimization", level: "experienced" },
      { name: "Graphic design", level: "working" },
      { name: "UI/UX thinking", level: "experienced" },
      { name: "Business requirement analysis", level: "core" },
      { name: "Client communication", level: "core" },
    ],
  },
];

export const skillLevelLabels: Record<
  SkillCategory["skills"][number]["level"],
  string
> = {
  core: "Core skill",
  experienced: "Experienced",
  working: "Working knowledge",
};
