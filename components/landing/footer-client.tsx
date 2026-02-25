"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const footerKeys = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer
      className={cn(
        "border-t bg-muted/40",
        "container mx-auto px-4 py-8 md:px-6"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Cartrade. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-6">
          {footerKeys.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-primary hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
