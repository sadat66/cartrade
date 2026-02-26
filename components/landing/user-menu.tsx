"use client";

import { useState, useEffect } from "react";
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
  if (email?.trim()) return email.trim().charAt(0).toUpperCase();
  return "?";
}

function getColorFromSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  // Using uniform saturation and lightness for a professional, balanced look
  return `hsl(${h}, 65%, 45%)`;
}

export function UserMenu({ user }: { user: NonNullable<CurrentUser> }) {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = getInitials(user.name, user.email ?? "");
  const userColor = getColorFromSeed(user.id || user.email || "default");

  if (!mounted) {
    return (
      <div className="h-12 w-12 rounded-full border-2 border-slate-200 bg-slate-100 animate-pulse" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "rounded-full outline-none ring-0 focus-visible:ring-slate-400 focus-visible:ring-2 cursor-pointer transition-transform hover:scale-105"
        )}
        aria-label={t("header.profile")}
      >
        <Avatar className="h-12 w-12 border-2 border-slate-200 shadow-sm transition-all hover:border-[#ff385c]/30">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? undefined} />
          ) : null}
          <AvatarFallback 
            className="text-lg text-white font-bold"
            style={{ backgroundColor: userColor }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 p-1 rounded-xl shadow-2xl border-slate-200">
        <div className="flex flex-col space-y-0.5 p-3 px-4">
          <p className="text-sm font-black text-slate-900 truncate">{user.name || t("common.user")}</p>
          <p className="text-[11px] font-bold text-slate-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="mx-1 bg-slate-100" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem asChild className="rounded-lg focus:bg-slate-50 cursor-pointer py-2.5 px-3">
            <Link href="/seller/listings" className="flex items-center font-bold text-slate-700 text-sm">
              Manage your ad or draft
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-lg focus:bg-slate-50 cursor-pointer py-2.5 px-3">
            <Link href="/profile" className="flex items-center font-bold text-slate-700 text-sm">
              {t("dashboard.nav.profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-lg focus:bg-slate-50 cursor-pointer py-2.5 px-3">
            <Link href="/dashboard" className="flex items-center font-bold text-slate-700 text-sm">
              {t("dashboard.nav.dashboard")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mx-1 bg-slate-100" />
        <div className="p-1">
          <form action={signOut} id="header-signout-form" className="w-full">
            <DropdownMenuItem asChild className="rounded-lg focus:bg-red-50 cursor-pointer py-2.5 px-3">
              <button
                type="submit"
                form="header-signout-form"
                className="flex w-full items-center gap-2 text-left font-bold text-red-600 focus:text-red-700"
              >
                <LogOut className="size-4" />
                {t("header.logOut")}
              </button>
            </DropdownMenuItem>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
