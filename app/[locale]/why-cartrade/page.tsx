import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { Hero } from "@/components/landing/hero";
import { Shield, Zap, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WhyCartradePage({ params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  const t = await getTranslations({ locale: validLocale, namespace: "whyCartrade" });

  const reasons = [
    { icon: Shield, titleKey: "reason1Title" as const, descKey: "reason1Desc" as const },
    { icon: Zap, titleKey: "reason2Title" as const, descKey: "reason2Desc" as const },
    { icon: MapPin, titleKey: "reason3Title" as const, descKey: "reason3Desc" as const },
  ];

  return (
    <div className="bg-background">
      <main>
        <Hero showSearch={false} />
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h1 className="text-3xl font-bold tracking-tight text-[#1e293b] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {reasons.map(({ icon: Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md text-center"
              >
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-[#ff385c]/10 text-[#ff385c] mb-4">
                  <Icon className="size-6" />
                </div>
                <h2 className="text-xl font-semibold text-[#1e293b]">
                  {t(titleKey)}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(descKey)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/cars"
              className="inline-flex items-center justify-center rounded-full bg-[#ff385c] px-6 py-3 text-base font-semibold text-white hover:bg-[#e03150] transition-colors"
            >
              {t("browseCars")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
