import { Navbar } from "@/components/landing/navbar";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  let locale: string;
  try {
    const resolvedParams = await params;
    locale = resolvedParams.locale;
  } catch (error) {
    console.error("Failed to resolve params in LocaleLayout:", error);
    locale = routing.defaultLocale;
  }
  
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;
  
  try {
    setRequestLocale(validLocale);
  } catch (error) {
    console.error("Failed to set request locale:", error);
  }
  
  // Safely import messages with error handling
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../../messages/${validLocale}.json`))
      .default as Record<string, unknown>;
  } catch (error) {
    console.error(`Failed to load messages for locale ${validLocale}:`, error);
    // Fallback to default locale messages
    try {
      messages = (await import(`../../messages/${routing.defaultLocale}.json`))
        .default as Record<string, unknown>;
    } catch (fallbackError) {
      console.error("Failed to load fallback messages:", fallbackError);
      messages = {};
    }
  }

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <Navbar locale={validLocale} />
      {children}
    </NextIntlClientProvider>
  );
}
