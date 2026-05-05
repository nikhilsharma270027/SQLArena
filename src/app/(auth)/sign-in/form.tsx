"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, GitCommitHorizontalIcon, Lock, User } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { authClient } from "@/src/lib/auth-client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/src/components/ui/field";

// ----------------------
// Schema
// ----------------------
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

// ----------------------
// Component
// ----------------------
export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const lastMethod = authClient.getLastUsedLoginMethod();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { formState } = form;

  function fillDemoCredentials() {
    form.setValue("email", "nikhilsharma270027@gmail.com");
    form.setValue("password", "Nikhil@123");
  }

  // ----------------------
  // Email Login
  // ----------------------
  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    form.clearErrors();
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        form.setError("root", {
          message: error.message || "Authentication failed",
        });
        return;
      }

      console.log("Sign in successful page", data);
      toast.success("Signed in successfully");
      router.push(redirect ?? "/");
    } catch (err) {
      console.error(err);
      form.setError("root", {
        message: "Unexpected error. Try again.",
      });
      toast.error("Unexpected error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ----------------------
  // Social Login
  // ----------------------
  async function handleSocialSignIn(provider: "google" | "github") {
    form.clearErrors();

    setSocialLoading((prev) => ({ ...prev, [provider]: true }));

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: redirect ?? "/",
      });

      if (error) {
        form.setError("root", {
          message: error.message || `${provider} login failed`,
        });
      }
    } catch {
      form.setError("root", {
        message: `${provider} authentication failed`,
      });
    } finally {
      setSocialLoading((prev) => ({ ...prev, [provider]: false }));
    }
  }

  // ----------------------
  // UI
  // ----------------------
  return (
    <Card className="max-w-full min-w-[24rem] mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg md:text-2xl">
          Sign In
        </CardTitle>
        <CardDescription>
          Enter your email to login
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Email */}
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              placeholder="your@email.com"
              className="rounded-xl"
              {...form.register("email")}
            />
            {formState.errors.email && (
              <FieldError>
                {formState.errors.email.message}
              </FieldError>
            )}
          </Field>

          {/* Password */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel>Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm underline"
              >
                Forgot?
              </Link>
            </div>

            <Input
              type="password"
              placeholder="Password"
              className="rounded-xl"
              {...form.register("password")}
            />

            {formState.errors.password && (
              <FieldError>
                {formState.errors.password.message}
              </FieldError>
            )}
          </Field>

          {/* Remember Me */}
          <Field>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.watch("rememberMe")}
                onCheckedChange={(val) =>
                  form.setValue("rememberMe", !!val)
                }
              />
              <FieldLabel>Remember me</FieldLabel>
            </div>
          </Field>

          {/* Root Error */}
          {formState.errors.root && (
            <FieldError>{formState.errors.root.message}</FieldError>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full rounded-2xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
          <Button
            className="w-full rounded-2xl"
            onClick={fillDemoCredentials}
          >
            Fill Demo Credentials
          </Button>

          {/* Social */}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant={lastMethod === "google" ? "default" : "outline"}
              className="w-full flex items-center justify-center gap-2"
              disabled={socialLoading.google}
              onClick={() => handleSocialSignIn("google")}
            >
              <Mail className="w-4 h-4" />
              {socialLoading.google
                ? "Signing in..."
                : "Sign in with Google"}
              {lastMethod === "google" && !socialLoading.google && (
                <Badge variant="secondary">Last used</Badge>
              )}
            </Button>

            <Button
              type="button"
              variant={lastMethod === "github" ? "default" : "outline"}
              className="w-full flex items-center justify-center gap-2"
              disabled={socialLoading.github}
              onClick={() => handleSocialSignIn("github")}
            >
              <GitCommitHorizontalIcon className="w-4 h-4" />
              {socialLoading.github
                ? "Signing in..."
                : "Sign in with GitHub"}
              {lastMethod === "github" && !socialLoading.github && (
                <Badge variant="secondary">Last used</Badge>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-center border-t pt-4">
          <p className="text-muted-foreground text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}