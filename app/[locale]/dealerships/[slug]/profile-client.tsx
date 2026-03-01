"use client";

import { useState, useMemo } from "react";
import {
    Building2, MapPin, Clock, Phone, Car, ImageIcon, Tag,
    Gauge, Palette, ArrowLeft, Search, SlidersHorizontal, Star
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useTranslations } from "next-intl";

type Vehicle = {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number | null;
    price: number;
    bodyType: string | null;
    transmission: string | null;
    drivetrain: string | null;
    color: string | null;
    description: string | null;
    condition: string | null;
    status: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
};

type Dealership = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    location: string;
    operatingHours: string | null;
    phone: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    owner: { id: string; name: string | null; image: string | null };
    vehicles: Vehicle[];
    _count: { vehicles: number };
    createdAt: string;
    updatedAt: string;
};

export function DealershipProfileClient({ dealership }: { dealership: Dealership }) {
    const t = useTranslations("dealership.profile");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");

    const filteredVehicles = useMemo(() => {
        let vehicles = dealership.vehicles.filter(
            (v) =>
                v.title.toLowerCase().includes(search.toLowerCase()) ||
                v.make.toLowerCase().includes(search.toLowerCase()) ||
                v.model.toLowerCase().includes(search.toLowerCase())
        );
        switch (sortBy) {
            case "price-low":
                vehicles = vehicles.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                vehicles = vehicles.sort((a, b) => b.price - a.price);
                break;
            default:
                vehicles = vehicles.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
        }
        return vehicles;
    }, [dealership.vehicles, search, sortBy]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Cover Section */}
            <div className="relative h-56 md:h-72 bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#3D0066] overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 50%, rgba(255, 56, 92, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 50%, rgba(61, 0, 102, 0.3) 0%, transparent 50%)`,
                    }} />
                </div>
                {dealership.coverUrl && (
                    <img
                        src={dealership.coverUrl}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-40"
                    />
                )}
            </div>

            <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10">
                {/* Breadcrumb */}
                <div className="mb-14 -mt-36">
                    <Breadcrumb
                        className="text-white/80 [&_span]:text-white [&_a]:text-white/80 [&_a:hover]:text-white font-semibold"
                        items={[
                            { label: t("home"), href: "/" },
                            { label: t("dealerships"), href: "/dealerships" },
                            { label: dealership.name },
                        ]}
                    />
                </div>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden flex items-center justify-center flex-shrink-0 -mt-16 md:-mt-20">
                            {dealership.logoUrl ? (
                                <img
                                    src={dealership.logoUrl}
                                    alt={dealership.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building2 className="size-10 text-slate-300" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 truncate">
                                    {dealership.name}
                                </h1>
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20 flex-shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                    {t("verified")}
                                </span>
                            </div>

                            {dealership.description && (
                                <p className="text-slate-600 text-sm leading-relaxed mt-2 max-w-2xl">
                                    {dealership.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                                    <MapPin className="size-4 text-[#ff385c]" />
                                    {dealership.location}
                                </span>
                                {dealership.operatingHours && (
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                                        <Clock className="size-4 text-[#ff385c]" />
                                        {dealership.operatingHours}
                                    </span>
                                )}
                                {dealership.phone && (
                                    <a
                                        href={`tel:${dealership.phone}`}
                                        className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full hover:bg-pink-50 hover:text-[#ff385c] transition-colors"
                                    >
                                        <Phone className="size-4 text-[#ff385c]" />
                                        {dealership.phone}
                                    </a>
                                )}
                                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                                    <Car className="size-4 text-[#ff385c]" />
                                    {t("vehiclesCount", { count: dealership._count.vehicles })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catalog Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-black text-slate-900">{t("vehicleCatalog")}</h2>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t("searchPlaceholder")}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all"
                                />
                            </div>
                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c]"
                            >
                                <option value="newest">{t("sortNewest")}</option>
                                <option value="price-low">{t("sortPriceLow")}</option>
                                <option value="price-high">{t("sortPriceHigh")}</option>
                            </select>
                        </div>
                    </div>

                    {filteredVehicles.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                            <Car className="size-12 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700">
                                {search ? t("noSearchMatch") : t("noVehicles")}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {search
                                    ? t("tryDifferentSearch")
                                    : t("noVehiclesDesc")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {filteredVehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Image */}
                                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                                        {vehicle.imageUrls?.[0] ? (
                                            <img
                                                src={vehicle.imageUrls[0]}
                                                alt={vehicle.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                                <ImageIcon className="size-12 text-slate-300" />
                                            </div>
                                        )}
                                        {vehicle.condition && (
                                            <div className="absolute top-3 left-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${vehicle.condition === "new"
                                                    ? "bg-emerald-500 text-white"
                                                    : vehicle.condition === "certified"
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white/90 backdrop-blur-sm text-slate-700"
                                                    }`}>
                                                    {vehicle.condition === "certified" ? t("certifiedPreOwned") : t(`condition.${vehicle.condition}`)}
                                                </span>
                                            </div>
                                        )}
                                        {vehicle.imageUrls?.length > 1 && (
                                            <div className="absolute bottom-3 right-3">
                                                <span className="bg-black/50 backdrop-blur-sm text-white rounded-full px-2 py-0.5 text-xs">
                                                    {t("extraPhotos", { count: vehicle.imageUrls.length - 1 })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="p-5 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-base group-hover:text-[#ff385c] transition-colors">
                                                {vehicle.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-0.5">
                                                {vehicle.year} · {vehicle.make} {vehicle.model}
                                            </p>
                                        </div>
                                        <div className="text-xl font-black text-[#ff385c]">
                                            ৳{vehicle.price.toLocaleString()}
                                        </div>
                                        {/* Quick Specs */}
                                        <div className="flex flex-wrap gap-2">
                                            {vehicle.mileage && (
                                                <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1">
                                                    <Gauge className="size-3.5 text-slate-400" />
                                                    {vehicle.mileage.toLocaleString()} km
                                                </span>
                                            )}
                                            {vehicle.transmission && (
                                                <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1">
                                                    <Tag className="size-3.5 text-slate-400" />
                                                    {vehicle.transmission}
                                                </span>
                                            )}
                                            {vehicle.bodyType && (
                                                <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1">
                                                    <Car className="size-3.5 text-slate-400" />
                                                    {vehicle.bodyType}
                                                </span>
                                            )}
                                            {vehicle.color && (
                                                <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1">
                                                    <Palette className="size-3.5 text-slate-400" />
                                                    {vehicle.color}
                                                </span>
                                            )}
                                        </div>
                                        {vehicle.description && (
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {vehicle.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
