import type { TestimonialPlaceholder, TrustPoint } from "@/types";

/**
 * Testimonials are placeholders only.
 * Replace with real client quotes and permission before publishing.
 * Do not invent fake testimonials or company logos.
 */
export const testimonials: TestimonialPlaceholder[] = [
  {
    id: "placeholder-1",
    quote: "[CLIENT TESTIMONIAL]",
    name: "[CLIENT NAME]",
    companyOrIndustry: "[COMPANY OR INDUSTRY]",
  },
  {
    id: "placeholder-2",
    quote: "[CLIENT TESTIMONIAL]",
    name: "[CLIENT NAME]",
    companyOrIndustry: "[COMPANY OR INDUSTRY]",
  },
  {
    id: "placeholder-3",
    quote: "[CLIENT TESTIMONIAL]",
    name: "[CLIENT NAME]",
    companyOrIndustry: "[COMPANY OR INDUSTRY]",
  },
];

export const trustPoints: TrustPoint[] = [
  {
    id: "australian-clients",
    title: "Australian client experience",
    description:
      "Practical delivery for businesses that need clear communication and dependable outcomes.",
    icon: "map-pin",
  },
  {
    id: "clear-communication",
    title: "Clear communication",
    description:
      "Straightforward updates, sensible recommendations, and transparent project progress.",
    icon: "messages-square",
  },
  {
    id: "secure-development",
    title: "Secure development practices",
    description:
      "Validation, access control, and careful handling of sensitive business information.",
    icon: "shield",
  },
  {
    id: "mobile-first",
    title: "Mobile-first design",
    description:
      "Interfaces that remain usable and polished on phones, tablets, and desktops.",
    icon: "smartphone",
  },
  {
    id: "post-launch",
    title: "Post-launch support",
    description:
      "Help after go-live so small issues are resolved and improvements stay practical.",
    icon: "life-buoy",
  },
  {
    id: "business-focused",
    title: "Business-focused solutions",
    description:
      "Technology decisions guided by process improvement and customer experience.",
    icon: "briefcase",
  },
];

export const clientAudiences = [
  "Australian businesses",
  "Startups",
  "Professional service providers",
  "Community organizations",
  "Small and medium-sized businesses",
];
