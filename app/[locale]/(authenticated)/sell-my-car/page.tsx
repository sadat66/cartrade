import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { NewListingForm } from "./new-listing-form";
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
      <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Breadcrumb
            items={[
              { label: t("cars.breadcrumb.home"), href: "/" },
              { label: t("dashboard.myListings.title"), href: "/seller/listings" },
              { label: t("dashboard.addListing.title") }
            ]}
          />

          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {t("dashboard.addListing.title")}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              {t("dashboard.addListing.subtitle")}
            </p>
          </div>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both" style={{ animationDelay: "80ms" }}>
            <NewListingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
