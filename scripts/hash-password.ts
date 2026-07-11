import bcrypt from "bcryptjs";

/**
 * Generate a bcrypt hash for ADMIN_PASSWORD_HASH.
 *
 * Usage:
 *   npx tsx scripts/hash-password.ts "your-secure-password"
 *
 * Note: Next.js expands $VAR in .env files, so `$` in bcrypt hashes
 * must be escaped as `\$`.
 */
async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error('Usage: npx tsx scripts/hash-password.ts "your-password"');
    process.exit(1);
  }

  if (password.length < 10) {
    console.warn(
      "Warning: prefer passwords of at least 10 characters for admin accounts.",
    );
  }

  const hash = await bcrypt.hash(password, 12);
  const escaped = hash.replaceAll("$", "\\$");

  console.log("\nAdd this to your .env.local:\n");
  console.log(`ADMIN_PASSWORD_HASH="${escaped}"\n`);
  console.log(
    "Important: keep the backslashes before each $. Next.js env loading expands unescaped $ characters and would corrupt the hash.\n",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
