"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ next = "/dashboard", authError = false }: { next?: string; authError?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    if (authError) {
      toast.error("Authentication failed. Please try again or confirm your email.");
      router.replace("/login" + (next && next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""));
    }
  }, [authError, next, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value ?? "";

    const supabase = createClient();

    if (isForgotPassword) {
      if (!email) {
        setError("Enter your email address");
        setLoading(false);
        return;
      }
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/login`,
      });
      setLoading(false);
      if (err) {
        setError(err.message);
        toast.error(err.message);
        return;
      }
      toast.success("Check your email for the password reset link.");
      setIsForgotPassword(false);
      return;
    }

    if (!email || !password) {
      setError("Email and password required");
      setLoading(false);
      return;
    }
    if (isSignUp) {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
        toast.error(err.message);
        setLoading(false);
        return;
      }
      toast.success("Account created. Check your email to confirm your account.");
      setError(null);
      setLoading(false);
      router.push(next);
      router.refresh();
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      toast.error(err.message);
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="mt-1"
          required
        />
      </div>
      {!isForgotPassword && (
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="mt-1"
            required={!isForgotPassword}
          />
          <button
            type="button"
            className="mt-1 text-xs font-medium text-primary hover:underline"
            onClick={() => setIsForgotPassword(true)}
          >
            Forgot password?
          </button>
        </div>
      )}
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading
          ? "Please wait…"
          : isForgotPassword
            ? "Send reset link"
            : isSignUp
              ? "Sign up"
              : "Log in"}
      </Button>
      {!isForgotPassword && (
        <p className="text-center text-muted-foreground text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      )}
      {isForgotPassword && (
        <p className="text-center text-muted-foreground text-sm">
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setIsForgotPassword(false)}
          >
            Back to log in
          </button>
        </p>
      )}
    </form>
  );
}
