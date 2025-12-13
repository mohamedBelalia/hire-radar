"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import OAuth from "./o-auth";
import { signup } from "@/features/auth/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [form, setForm] = useState<ISignupRequest>({
    full_name: "",
    email: "",
    password: "",
    role: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  }

  function validate() {
    const errs: Record<string, string> = {};

    if (!form.full_name.trim()) errs.full_name = "Full name is required.";
    if (!form.role) errs.role = "Please select a role.";

    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email.";

    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await signup(form);
      toast.success("Account created successfully!");
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
        setErrors({
          email: (err.response.data.error as string) || "Something went wrong",
        });
      } else {
        setErrors({ password: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below to create your account
          </p>
        </div>

        <div className="flex gap-2">
          <Field>
            <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
            <Input
              id="full_name"
              type="text"
              placeholder="John Doe"
              value={form.full_name}
              onChange={handleChange}
              required
              className="bg-background border-border"
              disabled={loading}
            />
            {errors.full_name && (
              <p className="text-destructive text-sm mt-1">
                {errors.full_name}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Select
              value={form.role}
              onValueChange={(value) => {
                setForm({ ...form, role: value });
                setErrors({ ...errors, role: "" });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="candidate">
                    Candidate - looking for opportunities
                  </SelectItem>
                  <SelectItem value="employer">
                    Employer - looking for workers
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-destructive text-sm mt-1">{errors.role}</p>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-background border-border"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-background border-border"
            disabled={loading}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          {errors.password && (
            <p className="text-destructive text-sm mt-1">{errors.password}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="bg-background border-border"
            disabled={loading}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
          {errors.confirmPassword && (
            <p className="text-destructive text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background hover:bg-foreground/90"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <OAuth />
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline underline-offset-4 text-foreground hover:text-foreground/80"
            >
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
