import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

        if (!adminEmail || !passwordHash) {
          console.error(
            "[auth] ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not configured.",
          );
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        if (email !== adminEmail) return null;

        const valid = await bcrypt.compare(parsed.data.password, passwordHash);
        if (!valid) return null;

        return {
          id: "admin",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "admin";
      }
      return session;
    },
  },
  trustHost: true,
});

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}
