import { redirect } from "@/i18n/navigation";
import { DashboardHome } from "./dashboard-home";
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
  if (!confirmed) redirect({ href: "/dashboard/profile", locale: validLocale });
  return <DashboardHome />;
}
