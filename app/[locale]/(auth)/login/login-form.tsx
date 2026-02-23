"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function LoginForm({ 
  next = "/dashboard", 
  authError = false,
  initialIsSignUp = false 
}: { 
  next?: string; 
  authError?: boolean;
  initialIsSignUp?: boolean;
}) {
  const router = useRouter();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    setIsSignUp(initialIsSignUp);
  }, [initialIsSignUp]);

  useEffect(() => {
    if (authError) {
      toast.error(t("login.authFailed"));
      const base = isSignUp ? "/signup" : "/login";
      router.replace(base + (next && next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""));
    }
  }, [authError, next, router, t, isSignUp]);

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

  const queryParams = next && next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-200">
          {t("login.email")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("login.emailPlaceholder")}
          className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 transition-colors"
          required
        />
      </div>
      {!isForgotPassword && (
        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-200">
          {t("login.password")}
        </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={t("login.passwordPlaceholder")}
            className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 transition-colors"
            required={!isForgotPassword}
          />
          <button
            type="button"
            className="mt-1 text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
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
        <p className="text-center text-slate-400 text-sm">
          {isSignUp ? t("login.alreadyHaveAccount") : t("login.dontHaveAccount")}{" "}
          <Link
            href={isSignUp ? `/login${queryParams}` : `/signup${queryParams}`}
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {isSignUp ? t("login.logIn") : t("login.signUp")}
          </Link>
        </p>
      )}
      {isForgotPassword && (
        <p className="text-center text-slate-400 text-sm">
          <button
            type="button"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            onClick={() => setIsForgotPassword(false)}
          >
            {t("login.backToLogIn")}
          </button>
        </p>
      )}
    </form>
  );
}
