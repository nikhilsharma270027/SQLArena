"use client";

import { passwordSchema } from "@/src/lib/validations";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/src/components/ui/card";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/src/components/ui/field";

// ----------------------
// Schema
// ----------------------
const SignUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof SignUpSchema>;

// ----------------------
// Component
// ----------------------
export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { formState } = form;

  // ----------------------
  // Submit
  // ----------------------
  async function onSubmit({ name, email, password }: SignUpValues) {
    form.clearErrors();
    setIsSubmitting(true);

    try {
      const { error: apiError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (apiError) {
        form.setError("root", {
          message: apiError.message,
        });
        return;
      }

      toast.success("Sign up successful");
      router.push("/dashboard");
    } catch (err) {
      console.error("Sign-up failed:", err);
      form.setError("root", {
        message: "Unexpected error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ----------------------
  // UI
  // ----------------------
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-1 text-center">
        <span className="text-4xl font-instrument-serif">
          Welcome to better auth boilerplate
        </span>
        <span className="text-sm text-muted-foreground">
          ~ built with prisma, better-auth, shadcn, nextjs & RHF
        </span>
      </div>

      {/* Card */}
      <Card className="max-w-full min-w-[24rem] mx-auto mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-lg md:text-2xl">
            Sign Up
          </CardTitle>
          <CardDescription>
            Create a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Name */}
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                type="text"
                placeholder="Enter your name"
                className="rounded-xl"
                {...form.register("name")}
              />
              {formState.errors.name && (
                <FieldError>
                  {formState.errors.name.message}
                </FieldError>
              )}
            </Field>

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
              <FieldLabel>Password</FieldLabel>
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

            {/* Confirm Password */}
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                type="password"
                placeholder="Confirm Password"
                className="rounded-xl"
                {...form.register("passwordConfirmation")}
              />
              {formState.errors.passwordConfirmation && (
                <FieldError>
                  {formState.errors.passwordConfirmation.message}
                </FieldError>
              )}
            </Field>

            {/* Root Error */}
            {formState.errors.root && (
              <FieldError>
                {formState.errors.root.message}
              </FieldError>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full rounded-2xl mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex w-full justify-center border-t pt-4">
            <p className="text-muted-foreground text-xs">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline">
                Sign In
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}