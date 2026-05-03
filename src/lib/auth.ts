import { prisma } from "../lib/prisma";
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "./email";
import { lastLoginMethod, customSession  } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from "./validations";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const auth = betterAuth({
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("AUTH_SECRET"),
  trustedOrigins: [
  process.env.BETTER_AUTH_URL!,
  "https://*.vercel.app"
],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: requireEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    },
  },

  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your Password",
          text: `Reset: ${url}`,
        });
      } catch {}
    },
  },

  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your email",
          text: `Verify: ${url}`,
        });
      } catch {}
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, newEmail, url }: any) {
        try {
          await sendEmail({
            to: user.email,
            subject: "Approve email change",
            text: `Change to ${newEmail}: ${url}`,
          });
        } catch {}
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },

  plugins: [
  lastLoginMethod(),
   customSession(async ({ user, session }) => {
      const dbUser = await prisma.user.findUnique({
        where: {
          id: session.userId, // ✅ FIXED
        },
        select: {
          username: true,
          role: true,
          solvedProblems: {
            select: {
              problemId: true,
            },
          },
        },
      });

      return {
        user: {
          ...user,
          username: dbUser?.username, 
          role: dbUser?.role || "user",
          solvedProblems: dbUser?.solvedProblems || [],
          newField: "newField",
        },
        session,
      };
    }),
],

  

  hook: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password =
          ctx.body?.password ?? ctx.body?.newPassword;

        if (!password) return;

        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),

    afterSignIn: async ({ user }: { user: User }) => {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;