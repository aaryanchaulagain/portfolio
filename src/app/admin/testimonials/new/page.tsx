import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata: Metadata = {
  title: "New testimonial",
  robots: { index: false, follow: false },
};

export default function AdminNewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Testimonials
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          Add testimonial
        </h1>
        <p className="mt-2 text-sm text-muted">
          <Link href="/admin/testimonials" className="text-accent hover:underline">
            Back to testimonials
          </Link>
        </p>
      </div>
      <TestimonialForm mode="create" />
    </div>
  );
}
