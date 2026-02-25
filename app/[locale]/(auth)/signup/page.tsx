import { LoginForm } from "../login/login-form";
import { getTranslations } from "next-intl/server";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; auth_error?: string }>;
}) {
  let next: string | undefined;
  let auth_error: string | undefined;
  
  try {
    const resolvedSearchParams = await searchParams;
    next = resolvedSearchParams.next;
    auth_error = resolvedSearchParams.auth_error;
  } catch (error) {
    console.error("Failed to resolve searchParams in SignupPage:", error);
  }
  
  let t;
  try {
    t = await getTranslations("login");
  } catch (error) {
    console.error("Failed to get translations in SignupPage:", error);
    // Fallback translations
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        "signUp": "Sign Up",
        "subtitle": "Create your account",
      };
      return fallbacks[key] || key;
    };
  }
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">{t("signUp")}</h1>
        <p className="text-slate-500 text-sm">
          {t("subtitle")}
        </p>
      </div>
      <LoginForm next={next ?? "/dashboard"} authError={!!auth_error} initialIsSignUp={true} />
    </div>
  );
}
