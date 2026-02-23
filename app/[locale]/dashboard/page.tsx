import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardOverview } from "./dashboard-overview";
import { EmailConfirmedToast } from "./email-confirmed-toast";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = {
  searchParams: Promise<{ confirmed?: string }>;
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ searchParams, params }: Props) {
  const { confirmed } = await searchParams;
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: "/login?next=/dashboard", locale: validLocale });
    return;
  }

  return (
    <>
      {confirmed === "1" && <EmailConfirmedToast />}
      <DashboardOverview user={user} locale={validLocale} />
    </>
  );
}
