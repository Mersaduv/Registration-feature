"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showToast("Login successful! Welcome back.", "success");
        router.push("/");
        router.refresh();
      } else {
        // Handle validation errors
        if (response.status === 422 && result.errors) {
          const errorMessages = Object.values(result.errors)
            .flat()
            .join(", ");
          showToast(errorMessages, "error");
        } else {
          showToast(
            result.message || "Login failed. Please try again.",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              required
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full py-3"
            >
              Sign in
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
