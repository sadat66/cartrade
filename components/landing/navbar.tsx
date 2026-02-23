import Image from "next/image";
import { Bell } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { UserMenu } from "@/components/landing/user-menu";
import type { Locale } from "@/i18n/config";

const mainNavKeys = [
  { href: "/buy", key: "header.buy" as const },
  { href: "/sell", key: "header.sell" as const },
  { href: "/showroom", key: "header.showroom" as const },
] as const;

const dashboardNavKeys = [
  { href: "/dashboard", key: "dashboard.nav.dashboard" as const },
  { href: "/dashboard/listings", key: "dashboard.nav.myListings" as const },
  { href: "/dashboard/messages", key: "dashboard.nav.messages" as const },
  { href: "/dashboard/saved", key: "dashboard.nav.savedListings" as const },
  { href: "/dashboard/profile", key: "dashboard.nav.profile" as const },
] as const;

export async function Navbar({ locale }: { locale: Locale }) {
  const user = await getCurrentUser();
  const t = await getTranslations({ locale });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-[#1e293b] text-white"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/cartrageLOGO.png"
            alt="Cartrade"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNavKeys.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              {t(key)}
            </Link>
          ))}
          {user &&
            dashboardNavKeys.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {t(key)}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:bg-white/10 hover:text-white"
                aria-label={t("header.notifications")}
              >
                <Bell className="size-5" />
              </Button>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:bg-white/10 hover:text-white"
                aria-label={t("header.notifications")}
              >
                <Bell className="size-5" />
              </Button>
              <Link
                href="/login"
                className="text-sm font-medium text-white/90 hover:text-white"
              >
                {t("header.login")}
              </Link>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/login?next=/dashboard/listings">{t("header.sellMyCar")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
