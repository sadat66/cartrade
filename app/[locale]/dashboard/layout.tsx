import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  const user = await getCurrentUser();
  if (!user) redirect({ href: "/login?next=/dashboard", locale: validLocale });

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto py-6 px-4 md:px-6">{children}</main>
    </div>
  );
}
