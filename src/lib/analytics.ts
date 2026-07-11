/**
 * Analytics abstraction.
 * Tracking scripts should only load after consent where required.
 */
type AnalyticsEvent =
  | "contact_form_started"
  | "contact_form_submitted"
  | "project_viewed"
  | "resume_downloaded"
  | "email_link_clicked"
  | "scheduling_link_clicked";

export function trackEvent(
  event: AnalyticsEvent,
  payload?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;

  const consent =
    window.localStorage.getItem("analytics-consent") === "granted";

  if (!consent) {
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics:deferred]", event, payload);
    }
    return;
  }

  // Provider adapters can be wired here later (Plausible, GA4, etc.)
  window.dispatchEvent(
    new CustomEvent("portfolio-analytics", {
      detail: { event, payload, at: new Date().toISOString() },
    }),
  );
}
