"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import OAuth from "./o-auth";
import { useState } from "react";
import { toast } from "sonner";
import { login } from "@/features/auth/api";
import { useRouter } from "next/navigation";

/**
 * Renders a login form that authenticates a user with email and password.
 *
 * Shows inline and toast error messages on failure, disables inputs while submitting,
 * and navigates to the application root on successful authentication.
 *
 * @param props - Standard form element props; `className` is merged into the form's classes.
 * @returns The rendered login form element.
 */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        const errorMsg =
          (err.response.data.error as string) || "Something went wrong";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err && typeof err === "object" && "message" in err) {
        const errorMsg = (err.message as string) || "Something went wrong";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="bg-background border-border"
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="bg-background border-border"
          />
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background hover:bg-foreground/90"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <OAuth />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="underline underline-offset-4 text-foreground hover:text-foreground/80"
            >
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}