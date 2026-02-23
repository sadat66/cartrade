"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { signOut } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import type { CurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

function getInitials(name: string | null, email: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function UserMenu({ user }: { user: NonNullable<CurrentUser> }) {
  const t = useTranslations();
  const initials = getInitials(user.name, user.email ?? "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "rounded-full outline-none ring-0 focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
        )}
        aria-label={t("header.profile")}
      >
        <Avatar className="h-10 w-10 border-2 border-white/20">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? undefined} />
          ) : null}
          <AvatarFallback className="bg-slate-600 text-base text-white font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">{t("dashboard.nav.profile")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">{t("dashboard.nav.dashboard")}</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <form action={signOut} id="header-signout-form" className="w-full">
            <DropdownMenuItem asChild>
              <button
                type="submit"
                form="header-signout-form"
                className="flex w-full cursor-default items-center gap-2 text-left text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/50 dark:focus:text-red-400"
              >
                <LogOut className="size-4" />
                {t("header.logOut")}
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
