import { z } from "zod";

export const serviceOptions = [
  "Business website",
  "Web application",
  "E-commerce platform",
  "Admin dashboard",
  "API integration",
  "Website redesign",
  "Technical consultation",
  "Other",
] as const;

export const budgetOptions = [
  "Under AUD 1,000",
  "AUD 1,000–3,000",
  "AUD 3,000–7,500",
  "AUD 7,500–15,000",
  "Over AUD 15,000",
  "Not sure yet",
] as const;

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  companyName: z.string().trim().max(120).optional().or(z.literal("")),
  country: z
    .string()
    .trim()
    .min(2, "Please enter your country.")
    .max(80),
  service: z.enum(serviceOptions, {
    error: "Please select a service.",
  }),
  budgetRange: z.enum(budgetOptions, {
    error: "Please select a budget range.",
  }),
  timeline: z
    .string()
    .trim()
    .min(2, "Please share your desired timeline.")
    .max(120),
  projectDescription: z
    .string()
    .trim()
    .min(30, "Please provide a bit more detail about the project.")
    .max(5000),
  consentAccepted: z.literal(true, {
    error: "Consent is required before submitting.",
  }),
  // Honeypot — must remain empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
