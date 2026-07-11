/**
 * Optional Cloudflare Turnstile verification.
 * Skipped when TURNSTILE_SECRET_KEY is unset.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: true };
  }

  if (!token?.trim()) {
    return { ok: false, error: "Bot verification is required." };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      remoteip: ip === "unknown" ? "" : ip,
    });

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );

    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!result.success) {
      return { ok: false, error: "Bot verification failed." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Bot verification failed." };
  }
}
