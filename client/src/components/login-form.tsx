"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Form submitted");
      const res = await login(email, password);
      if (res?.user.role === "admin") {
        router.push(`/admin/dashboard`);
      } else {
        router.push(`/`);
      }
      toast.success("Logged in successfully!");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message || "Something went wrong");
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
            onChange={handleEmailChange}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            disabled={loading}
            type="password"
            aria-invalid={error ? "true" : "false"}
            required
            value={password}
            onChange={handlePasswordChange}
            className={cn(
              "bg-background",
              error &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:border-destructive",
            )}
          />
          {error && (
            <FieldError className="mt-1.5 text-sm text-destructive">
              {error}
            </FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={loading} className="cursor-pointer">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <OAuth />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
