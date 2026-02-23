import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/saved", label: "Saved listings" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/listings", label: "My listings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-14 items-center gap-6 px-4 md:px-6">
          <Link href="/" className="font-semibold">
            Cartrade
          </Link>
          <nav className="flex gap-1">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container py-6 px-4 md:px-6">{children}</main>
    </div>
  );
}
