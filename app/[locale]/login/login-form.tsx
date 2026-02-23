"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function LoginForm({ next = "/dashboard", authError = false }: { next?: string; authError?: boolean }) {
  const router = useRouter();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    if (authError) {
      toast.error(t("login.authFailed"));
      router.replace("/login" + (next && next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""));
    }
  }, [authError, next, router, t]);

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
      setError(t("login.enterEmail"));
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
      toast.success(t("login.checkEmailReset"));
      setIsForgotPassword(false);
      return;
    }

    if (!email || !password) {
      setError(t("login.emailPasswordRequired"));
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
      toast.success(t("login.accountCreated"));
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
          {t("login.email")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("login.emailPlaceholder")}
          className="mt-1"
          required
        />
      </div>
      {!isForgotPassword && (
        <div>
          <label htmlFor="password" className="text-sm font-medium">
          {t("login.password")}
        </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={t("login.passwordPlaceholder")}
            className="mt-1"
            required={!isForgotPassword}
          />
          <button
            type="button"
            className="mt-1 text-xs font-medium text-primary hover:underline"
            onClick={() => setIsForgotPassword(true)}
          >
            {t("login.forgotPassword")}
          </button>
        </div>
      )}
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading
          ? t("common.loading")
          : isForgotPassword
            ? t("login.sendResetLink")
            : isSignUp
              ? t("login.signUp")
              : t("login.logIn")}
      </Button>
      {!isForgotPassword && (
        <p className="text-center text-muted-foreground text-sm">
          {isSignUp ? t("login.alreadyHaveAccount") : t("login.dontHaveAccount")}{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp ? t("login.logIn") : t("login.signUp")}
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
            {t("login.backToLogIn")}
          </button>
        </p>
      )}
    </form>
  );
}
