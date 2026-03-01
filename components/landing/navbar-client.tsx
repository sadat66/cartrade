"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Menu, X, MessageSquare, Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CurrentUser } from "@/lib/auth";
import { UserMenu } from "./user-menu";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";

type DealershipInfo = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
} | null;

interface NavbarClientProps {
    user: CurrentUser | null;
    dealership?: DealershipInfo;
    translations: {
        buy: string;
        sell: string;
        dealership: string;
        whyCartrade: string;
        login: string;
        sellMyCar: string;
        messages: string;
        notifications: string;
        saved: string;
        language: string;
    };
}

export function NavbarClient({ user, dealership, translations: t }: NavbarClientProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: "/cars", label: t.buy },
        { href: user ? "/sell-my-car" : "/login?next=/sell-my-car", label: t.sell },
        { href: "/dealerships", label: t.dealership },
        { href: "/why-cartrade", label: t.whyCartrade },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between gap-4">
                    {/* Logo Section with Slanted Red Background */}
                    <div className="relative flex items-center h-full">
                        <Link href="/" className="relative z-10 flex items-center h-full group">
                            <div className="absolute inset-y-0 -left-4 w-[180px] bg-[#ff385c] -skew-x-[15deg] transition-transform group-hover:scale-105 duration-300" />
                            <div className="relative z-20 px-4 flex items-center">
                                <Image
                                    src="/logo/cartrageLOGO.png"
                                    alt="Cartrade"
                                    width={140}
                                    height={35}
                                    className="h-8 w-auto object-contain brightness-0 invert"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-1 text-[15px] font-semibold text-slate-800 transition-colors hover:text-[#3D0066]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="icon" asChild className="text-slate-700 hover:bg-slate-100 hidden sm:flex">
                            <Link href={user ? "/messages" : "/login"}>
                                <MessageSquare className="size-5" />
                            </Link>
                        </Button>

                        <Button variant="ghost" size="icon" asChild className="text-slate-700 hover:bg-slate-100 hidden sm:flex">
                            <Link href={user ? "/dashboard" : "/login"}>
                                <Bell className="size-5" />
                            </Link>
                        </Button>

                        <div className="hidden md:block border-l border-slate-200 h-6 mx-1" />

                        <div className="hidden md:block">
                            <LocaleSwitcher />
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Button asChild className="hidden md:flex bg-[#ff385c] hover:bg-[#e03150] text-white rounded-full px-6 font-bold shadow-lg shadow-pink-900/10 transition-all active:scale-95">
                                    <Link href="/sell-my-car">{t.sellMyCar}</Link>
                                </Button>
                                <UserMenu user={user} dealership={dealership} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="hidden lg:block text-[15px] font-bold text-slate-800 hover:text-[#3D0066]"
                                >
                                    {t.login}
                                </Link>
                                <Button asChild className="hidden md:flex bg-[#ff385c] hover:bg-[#e03150] text-white rounded-full px-6 font-bold shadow-lg shadow-pink-900/10 transition-all active:scale-95">
                                    <Link href="/login?next=/sell-my-car">{t.sellMyCar}</Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild className="text-slate-700 hover:bg-slate-100 lg:hidden">
                                    <Link href="/login">
                                        <User className="size-5" />
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-slate-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Sidebar/Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-20 z-40 lg:hidden overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Content */}
                    <nav className="relative z-50 bg-white shadow-xl flex flex-col p-6 gap-6 animate-in slide-in-from-top duration-300">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center justify-between"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {!user ? (
                            <div className="flex flex-col gap-4 pt-4">
                                <Link
                                    href="/login"
                                    className="text-lg font-bold text-slate-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t.login}
                                </Link>
                                <Button asChild className="bg-[#ff385c] hover:bg-[#e03150] text-white rounded-full w-full py-6 text-lg shadow-lg shadow-pink-900/10 transition-all active:scale-95">
                                    <Link href="/login?next=/sell-my-car" onClick={() => setIsMenuOpen(false)}>
                                        {t.sellMyCar}
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 pt-4">
                                <Button asChild className="bg-[#ff385c] hover:bg-[#e03150] text-white rounded-full w-full py-6 text-lg shadow-lg shadow-pink-900/10 transition-all active:scale-95">
                                    <Link href="/sell-my-car" onClick={() => setIsMenuOpen(false)}>
                                        {t.sellMyCar}
                                    </Link>
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            <span className="text-sm font-medium text-slate-500">{t.language}</span>
                            <LocaleSwitcher />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
