import type { ProjectItem } from "@/types";

/**
 * Portfolio projects — editable sample content.
 * Do not publish confidential client information, private URLs,
 * credentials, financial data, or internal screenshots.
 */
export const projects: ProjectItem[] = [
  {
    id: "au-financial-multisite",
    slug: "australian-financial-services-multi-site",
    title: "Australian Financial Services Multi-Site Platform",
    summary:
      "A multi-property web platform for presenting financial service offerings with consistent branding and content structure.",
    problem:
      "A financial services business needed a coherent digital presence across related service areas without maintaining disconnected websites.",
    solution:
      "Delivered a structured multi-site architecture with shared components, clear service pages, and an admin-friendly content model.",
    category: ["client", "web-app"],
    status: "private",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    features: [
      "Shared design system across related sites",
      "Service-focused page templates",
      "SEO-ready metadata structure",
      "Content-ready layout system",
    ],
    image: "/images/projects/financial-multisite.jpg",
    featured: true,
    isPrivateClient: true,
    caseStudy: {
      clientProblem:
        "Related financial service offerings needed a unified digital experience without fragmenting brand trust.",
      role: "Full-stack developer responsible for architecture, UI implementation, and delivery planning.",
      planning:
        "Mapped service information architecture, defined shared components, and agreed content ownership before build.",
      solution:
        "Built a multi-site platform with reusable templates, consistent navigation patterns, and scalable page structure.",
      technology:
        "Next.js, TypeScript, Tailwind CSS, and a database-backed content structure suitable for ongoing updates.",
      security:
        "Protected admin workflows, validated inputs, and avoided exposing sensitive operational data on public pages.",
      businessResult:
        "[VERIFIED RESULT PLACEHOLDER — replace with approved outcome metrics or qualitative results only after client permission.]",
      lessonsLearned:
        "Shared component systems reduce maintenance cost when multiple related brands need consistent delivery quality.",
    },
  },
  {
    id: "ecommerce-ordering",
    slug: "ecommerce-online-ordering-system",
    title: "E-commerce and Online Ordering System",
    summary:
      "An online catalogue and ordering experience designed for product discovery, checkout clarity, and operational handoff.",
    problem:
      "A retailer needed customers to browse products and place orders without relying on manual message-based workflows.",
    solution:
      "Built a product catalogue, cart flow, and order capture process with admin visibility for fulfilment teams.",
    category: ["ecommerce", "web-app", "client"],
    status: "private",
    technologies: ["Laravel", "PHP", "MySQL", "Tailwind CSS"],
    features: [
      "Product catalogue and categories",
      "Cart and checkout flow",
      "Order management views",
      "Mobile-friendly shopping experience",
    ],
    image: "/images/projects/ecommerce-ordering.jpg",
    isPrivateClient: true,
  },
  {
    id: "nepali-community-au",
    slug: "community-platform-nepalis-australia",
    title: "Community Platform for Nepalis in Australia",
    summary:
      "A community-oriented web platform concept for connecting people, events, and local information.",
    problem:
      "Community members needed a clearer digital place to discover relevant events, resources, and local connections.",
    solution:
      "Designed and built a community platform structure focused on discoverability, trust, and mobile usability.",
    category: ["web-app", "hackathon"],
    status: "prototype",
    technologies: ["React.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    features: [
      "Community content sections",
      "Event-oriented information architecture",
      "Responsive member-facing layouts",
      "Moderation-ready content structure",
    ],
    image: "/images/projects/community-platform.jpg",
    githubUrl: "[GITHUB_URL_COMMUNITY_PLATFORM]",
  },
  {
    id: "public-money-transparency",
    slug: "public-money-transparency-platform",
    title: "Public Money Transparency Platform",
    summary:
      "A transparency-focused application concept for presenting public spending information in a clearer format.",
    problem:
      "Public financial information is often difficult for everyday users to explore and understand.",
    solution:
      "Created a structured presentation layer for financial transparency data with searchable and readable views.",
    category: ["web-app", "hackathon"],
    status: "prototype",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Charting"],
    features: [
      "Readable spending summaries",
      "Search and filter patterns",
      "Transparent data presentation",
      "Accessible information hierarchy",
    ],
    image: "/images/projects/transparency-platform.jpg",
    githubUrl: "[GITHUB_URL_TRANSPARENCY]",
  },
  {
    id: "ai-financial-safety",
    slug: "ai-powered-financial-safety-application",
    title: "AI-Powered Financial Safety Application",
    summary:
      "An AI-assisted concept focused on helping users review financial documents with clearer risk signals.",
    problem:
      "People often struggle to interpret financial documents quickly and identify potential concerns.",
    solution:
      "Prototyped an AI-assisted workflow that summarises document insights and highlights areas needing attention.",
    category: ["ai", "web-app", "hackathon"],
    status: "prototype",
    technologies: ["Python", "FastAPI", "React.js", "OpenAI API"],
    features: [
      "Document upload workflow",
      "AI-assisted summary generation",
      "Risk-oriented highlight presentation",
      "Review-friendly interface",
    ],
    image: "/images/projects/ai-financial-safety.jpg",
    githubUrl: "[GITHUB_URL_AI_SAFETY]",
  },
  {
    id: "bank-statement-converter",
    slug: "bank-statement-pdf-to-csv-converter",
    title: "Bank Statement PDF-to-CSV Converter",
    summary:
      "A utility that converts bank statement PDFs into structured CSV output for accounting workflows.",
    problem:
      "Manual transcription of statement data slows bookkeeping and increases the chance of human error.",
    solution:
      "Built a conversion tool that extracts statement data into CSV format for spreadsheet and accounting use.",
    category: ["web-app", "ai"],
    status: "in-development",
    technologies: ["Python", "FastAPI", "PDF parsing", "React.js"],
    features: [
      "PDF upload interface",
      "Structured CSV export",
      "Preview before download",
      "Error handling for unsupported formats",
    ],
    image: "/images/projects/pdf-csv-converter.jpg",
    githubUrl: "[GITHUB_URL_PDF_CSV]",
  },
  {
    id: "admin-client-portal",
    slug: "business-admin-client-management-portal",
    title: "Business Admin and Client Management Portal",
    summary:
      "An internal portal for managing clients, records, and operational workflows from one dashboard.",
    problem:
      "Teams were coordinating client information across spreadsheets and disconnected tools.",
    solution:
      "Delivered a role-aware admin portal with client records, workflow views, and practical reporting surfaces.",
    category: ["client", "web-app"],
    status: "private",
    technologies: ["Laravel", "MySQL", "Vue.js", "REST API"],
    features: [
      "Client record management",
      "Role-based access patterns",
      "Operational dashboard views",
      "Internal notes and status tracking",
    ],
    image: "/images/projects/admin-portal.jpg",
    isPrivateClient: true,
  },
];

export const projectFilters = [
  { id: "all", label: "All" },
  { id: "client", label: "Client Work" },
  { id: "web-app", label: "Web Applications" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "ai", label: "AI Projects" },
  { id: "hackathon", label: "Hackathon Projects" },
] as const;

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProject(): ProjectItem | undefined {
  return projects.find((project) => project.featured);
}
