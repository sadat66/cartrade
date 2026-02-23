import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/landing/header";
import type { Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;
  setRequestLocale(validLocale);
  const messages = (await import(`../../messages/${validLocale}.json`))
    .default as Record<string, unknown>;

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <Header locale={validLocale} />
      {children}
    </NextIntlClientProvider>
  );
}
