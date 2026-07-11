import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";

const refAlphabet = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 4);

/** Hash a client IP with AUTH_SECRET so raw IPs are never stored. */
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET ?? "local-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function hashSubmission(email: string, description: string): string {
  const normalized = `${email.trim().toLowerCase()}|${description.trim()}`;
  return createHash("sha256").update(normalized).digest("hex");
}

/** Format: ENQ-YYYYMMDD-XXXX */
export function createReferenceNumber(date = new Date()): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `ENQ-${yyyy}${mm}${dd}-${refAlphabet()}`;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
