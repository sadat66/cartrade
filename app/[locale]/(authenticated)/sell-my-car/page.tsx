import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ListingForm } from "@/components/sell-car/listing-form";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/shared/breadcrumb";
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
  if (!user) redirect({ href: "/login?next=/sell-my-car", locale: validLocale });
  const t = await getTranslations({ locale: validLocale });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 py-6 lg:py-12">
        <div className="mb-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <Breadcrumb
            items={[
              { label: t("cars.breadcrumb.home"), href: "/" },
              { label: t("dashboard.addListing.title") },
            ]}
          />
        </div>
        <ListingForm />
      </div>
    </div>
  );
}
