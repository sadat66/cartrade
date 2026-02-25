import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthenticatedLayout({ children, params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error("Failed to get user in AuthenticatedLayout:", error);
    redirect({ href: "/login?next=/dashboard", locale: validLocale });
  }

  if (!user) redirect({ href: "/login?next=/dashboard", locale: validLocale });

  return (
    <div className="min-h-screen bg-muted/30">
      {children}
    </div>
  );
}
