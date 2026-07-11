import { afterEach, describe, expect, it } from "vitest";
import { rateLimit, resetRateLimitStore } from "@/lib/rate-limit";

describe("rateLimit", () => {
  afterEach(() => {
    resetRateLimitStore();
  });

  it("allows requests under the limit", () => {
    const first = rateLimit({ key: "test-a", limit: 3, windowMs: 60_000 });
    const second = rateLimit({ key: "test-a", limit: 3, windowMs: 60_000 });

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(1);
  });

  it("blocks requests over the limit", () => {
    rateLimit({ key: "test-b", limit: 2, windowMs: 60_000 });
    rateLimit({ key: "test-b", limit: 2, windowMs: 60_000 });
    const blocked = rateLimit({ key: "test-b", limit: 2, windowMs: 60_000 });

    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("tracks keys independently", () => {
    rateLimit({ key: "one", limit: 1, windowMs: 60_000 });
    const other = rateLimit({ key: "two", limit: 1, windowMs: 60_000 });

    expect(other.success).toBe(true);
  });
});
