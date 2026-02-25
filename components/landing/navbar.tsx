import { getCurrentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { NavbarClient } from "./navbar-client";

export async function Navbar({ locale }: { locale: Locale }) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error("Failed to get user in Navbar:", error);
  }

  let translations;
  try {
    const t = await getTranslations({ locale });
    translations = {
      buy: t("header.buy"),
      sell: t("header.sell"),
      dealership: t("header.dealership"),
      whyCartrade: t("header.whyCartrade"),
      login: t("header.login"),
      sellMyCar: t("header.sellMyCar"),
      messages: t("header.messages"),
      notifications: t("header.notifications"),
      saved: t("header.saved"),
      language: t("header.language"),
    };
  } catch (error) {
    console.error("Failed to get translations in Navbar:", error);
    // Fallback translations
    translations = {
      buy: "Buy",
      sell: "Sell",
      dealership: "Dealership",
      whyCartrade: "Why Cartrade",
      login: "Login",
      sellMyCar: "Sell My Car",
      messages: "Messages",
      notifications: "Notifications",
      saved: "Saved",
      language: "Language",
    };
  }

  return <NavbarClient user={user} translations={translations} />;
}
