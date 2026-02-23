import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const footerKeys = [
  { href: "/privacy", key: "footer.privacy" as const },
  { href: "/terms", key: "footer.terms" as const },
  { href: "/contact", key: "footer.contact" as const },
] as const;

export async function Footer() {
  const t = await getTranslations();
  return (
    <footer
      className={cn(
        "border-t bg-muted/40",
        "container mx-auto px-4 py-8 md:px-6"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </p>
        <nav className="flex flex-wrap gap-6">
          {footerKeys.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
