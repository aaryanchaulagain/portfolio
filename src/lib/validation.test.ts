import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/lib/validation";

describe("contactFormSchema", () => {
  it("rejects empty required fields", () => {
    const result = contactFormSchema.safeParse({
      fullName: "",
      email: "",
      country: "",
      service: "Business website",
      budgetRange: "Not sure yet",
      timeline: "",
      projectDescription: "Too short",
      consentAccepted: false,
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid enquiry payload", () => {
    const result = contactFormSchema.safeParse({
      fullName: "Alex Example",
      email: "alex@example.com",
      phone: "",
      companyName: "Example Co",
      country: "Australia",
      service: "Web application",
      budgetRange: "AUD 3,000–7,500",
      timeline: "Next quarter",
      projectDescription:
        "We need a custom client portal for managing bookings, invoices, and staff access across two locations.",
      consentAccepted: true,
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects honeypot submissions", () => {
    const result = contactFormSchema.safeParse({
      fullName: "Bot User",
      email: "bot@example.com",
      country: "Australia",
      service: "Other",
      budgetRange: "Not sure yet",
      timeline: "ASAP",
      projectDescription:
        "This submission should fail because the honeypot field is populated with spam content.",
      consentAccepted: true,
      website: "https://spam.example",
    });

    expect(result.success).toBe(false);
  });
});
