import Image from "next/image";
import { Bell, Heart, LogOut, MessageCircle, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/locale-switcher";

const navKeys = [
  { href: "/buy", key: "header.buy" as const },
  { href: "/sell", key: "header.sell" as const },
  { href: "/research", key: "header.research" as const },
  { href: "/dealerships", key: "header.dealerships" as const },
  { href: "/showroom", key: "header.showroom" as const },
] as const;

export async function Header() {
  const user = await getCurrentUser();
  const t = await getTranslations();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-[#1e293b] text-white"
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/cartrageLOGO.png"
            alt="Cartrade"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navKeys.map(({ href, key }) => (
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
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:bg-white/10 hover:text-white"
                aria-label={t("header.saved")}
                asChild
              >
                <Link href="/dashboard/saved">
                  <Heart className="size-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:bg-white/10 hover:text-white"
                aria-label={t("header.messages")}
                asChild
              >
                <Link href="/dashboard/messages">
                  <MessageCircle className="size-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:bg-white/10 hover:text-white"
                aria-label={t("header.profile")}
                asChild
              >
                <Link href="/dashboard/profile">
                  <User className="size-5" />
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/dashboard/listings">{t("header.sellMyCar")}</Link>
              </Button>
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="text-white/90 hover:bg-white/10 hover:text-white"
                  aria-label={t("header.logOut")}
                >
                  <LogOut className="size-5" />
                </Button>
              </form>
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
