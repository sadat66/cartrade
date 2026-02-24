import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { NewListingForm } from "./new-listing-form";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export default async function NewListingPage({ params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/login?next=/dashboard/sell/new", locale: validLocale });
  const t = await getTranslations({ locale: validLocale });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard.addListing.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.addListing.subtitle")}
        </p>
      </div>
      <NewListingForm />
    </div>
  );
}
