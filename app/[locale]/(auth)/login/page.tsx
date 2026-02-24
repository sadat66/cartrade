import { LoginForm } from "./login-form";
import { getTranslations } from "next-intl/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; auth_error?: string }>;
}) {
  const { next, auth_error } = await searchParams;
  const t = await getTranslations("login");
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
        <p className="text-slate-500 text-sm">
          {t("subtitle")}
        </p>
      </div>
      <LoginForm next={next ?? "/dashboard"} authError={!!auth_error} />
    </div>
  );
}
