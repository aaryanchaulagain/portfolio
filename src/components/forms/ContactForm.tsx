"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import {
  budgetOptions,
  contactFormSchema,
  serviceOptions,
  type ContactFormValues,
} from "@/lib/validation";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      country: "",
      timeline: "",
      projectDescription: "",
      website: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitState("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          payload?.error ??
            "Unable to send your enquiry right now. Please try again shortly or email me directly.",
        );
      }

      setSubmitState("success");
      reset();
    } catch (error) {
      setSubmitState("error");
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email me directly.",
      );
    }
  }

  if (submitState === "success") {
    return (
      <div
        className="rounded-2xl border border-success/30 bg-success/10 p-6 md:p-8"
        role="status"
      >
        <p className="font-display text-lg font-semibold text-foreground">
          Enquiry received
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Thank you. Your enquiry has been received and is awaiting review. You
          will receive a confirmation email shortly.
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={() => setSubmitState("idle")}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative space-y-5"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          required
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone / WhatsApp"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Company name"
          autoComplete="organization"
          error={errors.companyName?.message}
          {...register("companyName")}
        />
        <Input
          label="Country"
          required
          autoComplete="country-name"
          error={errors.country?.message}
          {...register("country")}
        />
        <Select
          label="Service needed"
          required
          error={errors.service?.message}
          defaultValue=""
          {...register("service")}
        >
          <option value="" disabled>
            Select a service
          </option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Select
          label="Budget range"
          required
          error={errors.budgetRange?.message}
          defaultValue=""
          {...register("budgetRange")}
        >
          <option value="" disabled>
            Select a budget range
          </option>
          {budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Input
          label="Desired timeline"
          required
          placeholder="e.g. 4–6 weeks"
          error={errors.timeline?.message}
          {...register("timeline")}
        />
      </div>

      <Textarea
        label="Project description"
        required
        placeholder="Share goals, constraints, and what success looks like."
        error={errors.projectDescription?.message}
        {...register("projectDescription")}
      />

      {/* Honeypot — hidden from users */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border text-accent focus-visible:ring-accent"
            {...register("consentAccepted")}
          />
          <span>
            I agree to be contacted about this enquiry and understand my details
            will be handled according to the{" "}
            <a href="/privacy" className="font-medium text-accent underline-offset-2 hover:underline">
              privacy policy
            </a>
            .
          </span>
        </label>
        {errors.consentAccepted?.message ? (
          <p className="text-xs text-danger" role="alert">
            {errors.consentAccepted.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={submitState === "submitting"}
      >
        {submitState === "submitting" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
