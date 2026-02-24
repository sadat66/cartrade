import { getCurrentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { NavbarClient } from "./navbar-client";

export async function Navbar({ locale }: { locale: Locale }) {
  const user = await getCurrentUser();
  const t = await getTranslations({ locale });

  const translations = {
    buy: t("header.buy"),
    sell: t("header.sell"),
    dealership: t("header.dealership"),
    whyCartrade: t("header.whyCartrade"),
    login: t("header.login"),
    sellMyCar: t("header.sellMyCar"),
    messages: t("header.messages"),
    notifications: t("header.notifications"),
    saved: t("header.saved"),
  };

  return <NavbarClient user={user} translations={translations} />;
}
