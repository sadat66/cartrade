import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTranslations, getLocale } from "next-intl/server";
import { cn } from "@/lib/utils";

const navKeys = [
  { href: "/dashboard/profile", key: "dashboard.nav.profile" as const },
  { href: "/dashboard/saved", key: "dashboard.nav.savedListings" as const },
  { href: "/dashboard/messages", key: "dashboard.nav.messages" as const },
  { href: "/dashboard/listings", key: "dashboard.nav.myListings" as const },
] as const;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/login?next=/dashboard", locale: await getLocale() });
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-14 items-center gap-6 px-4 md:px-6">
          <Link href="/" className="font-semibold">
            {t("common.siteName")}
          </Link>
          <nav className="flex gap-1">
            {navKeys.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container py-6 px-4 md:px-6">{children}</main>
    </div>
  );
}
