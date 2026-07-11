export type SkillLevel = "core" | "experienced" | "working";

export type ProjectStatus =
  | "live"
  | "private"
  | "prototype"
  | "in-development";

export type ProjectCategory =
  | "client"
  | "web-app"
  | "ecommerce"
  | "ai"
  | "hackathon";

export type EnquiryStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CONTACTED"
  | "CLOSED"
  | "SPAM";

export interface NavItem {
  label: string;
  href: string;
  sectionId?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "github" | "email" | "whatsapp";
}

export interface ProfileData {
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  headline: string;
  alternativeHeadline: string;
  summary: string;
  availabilityLabel: string;
  location: string;
  serviceRegion: string;
  email: string;
  phoneOrWhatsApp: string;
  linkedInUrl: string;
  githubUrl: string;
  schedulingLink: string;
  profileImagePath: string;
  aboutImagePath: string;
  resumeFilePath: string;
  yearsExperienceLabel: string;
  trustIndicators: string[];
  brandStatement: string;
}

export interface SkillItem {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface ServiceItem {
  id: string;
  title: string;
  outcome: string;
  icon: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  roleOrCompany: string;
  quote: string;
  image: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organizer: string;
  year: number;
  description: string;
  projectName: string;
  certificateImage: string;
  eventImage: string;
  verificationLink: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface WorkStep {
  step: number;
  title: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  category: ProjectCategory[];
  status: ProjectStatus;
  technologies: string[];
  features: string[];
  image: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  isPrivateClient?: boolean;
  caseStudy?: ProjectCaseStudy;
}

export interface ProjectCaseStudy {
  clientProblem: string;
  role: string;
  planning: string;
  solution: string;
  technology: string;
  security: string;
  businessResult: string;
  lessonsLearned: string;
}

export interface TestimonialPlaceholder {
  id: string;
  quote: string;
  name: string;
  companyOrIndustry: string;
}

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  locale: string;
  defaultOgImage: string;
}
