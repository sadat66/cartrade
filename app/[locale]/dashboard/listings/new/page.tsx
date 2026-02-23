import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { NewListingForm } from "./new-listing-form";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/login?next=/dashboard/listings/new", locale: await getLocale() });
  const t = await getTranslations();

  return (
    <div className="max-w-2xl space-y-6">
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
