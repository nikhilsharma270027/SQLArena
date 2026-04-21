import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, lastLoginMethodClient } from "better-auth/client/plugins";
import { auth as serverAuth } from "./auth";

export const authClient = createAuthClient({
    plugins: [nextCookies(), inferAdditionalFields<typeof serverAuth>(), lastLoginMethodClient()]
})

// Optional: Add custom session fetcher
export const getSession = async () => {
  try {
    const response = await fetch("/api/auth/get-session");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};

export const auth = authClient;