import { getCurrentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import { NavbarClient } from "./navbar-client";

export async function Navbar({ locale }: { locale: Locale }) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error("Failed to get user in Navbar:", error);
  }

  // Fetch user's dealership if logged in
  let dealership = null;
  if (user) {
    try {
      dealership = await prisma.dealership.findFirst({
        where: { ownerId: user.id },
        select: { id: true, name: true, slug: true, logoUrl: true },
      });
    } catch (error) {
      console.error("Failed to fetch dealership in Navbar:", error);
    }
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

  return <NavbarClient user={user} dealership={dealership} translations={translations} />;
}
