"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
    Building2, MapPin, Clock, Phone, Car, Search, ChevronRight, Store, ChevronLeft, ArrowRight
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Vehicle = {
    id: string;
    title: string;
    price: number;
    imageUrls: string[];
    year: number;
    make: string;
    model: string;
    condition: string | null;
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
    vehicles: Vehicle[];
    _count: { vehicles: number };
    createdAt: string;
    updatedAt: string;
};


function VehicleCarousel({ vehicles, dealershipSlug, t }: { vehicles: Vehicle[], dealershipSlug: string, t: any }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback((api: any) => {
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);

    React.useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative group/carousel flex-1 min-w-0">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex gap-5">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="flex-[0_0_300px] min-w-0">
                            <div className="group/vcard relative h-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg">
                                {/* Image */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    {vehicle.imageUrls[0] ? (
                                        <img
                                            src={vehicle.imageUrls[0]}
                                            alt={vehicle.title}
                                            className="h-full w-full object-cover group-hover/vcard:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-slate-50">
                                            <Car className="size-10 text-slate-200" />
                                        </div>
                                    )}
                                    {vehicle.condition && (
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
                                                {vehicle.condition}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-sm font-black text-slate-900 group-hover/vcard:text-[#ff385c] transition-colors truncate mb-1">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium mb-3 truncate">{vehicle.title}</p>

                                    <div className="mt-auto pt-3 border-t border-slate-50">
                                        <div className="text-lg font-black text-[#ff385c]">
                                            ৳{vehicle.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/dealerships/${dealershipSlug}`} className="absolute inset-0 z-10" />
                            </div>
                        </div>
                    ))}
                    {vehicles.length >= 10 && (
                        <div className="flex-[0_0_300px] min-w-0">
                            <Link
                                href={`/dealerships/${dealershipSlug}`}
                                className="flex flex-col h-full items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 group/all"
                            >
                                <div className="size-14 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100 mb-4 group-hover/all:scale-110 group-hover/all:bg-[#ff385c] group-hover/all:text-white transition-all">
                                    <ArrowRight className="size-7" />
                                </div>
                                <span className="font-black text-slate-900 uppercase tracking-widest text-xs">{t("viewFullCatalog")}</span>
                                <span className="text-[10px] text-slate-500 mt-2 font-bold">{t("vehiclesCount", { count: vehicles.length })}</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {canScrollPrev && (
                <button
                    onClick={() => emblaApi?.scrollPrev()}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 size-11 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl hover:bg-slate-50 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
                >
                    <ChevronLeft className="size-6" />
                </button>
            )}
            {canScrollNext && (
                <button
                    onClick={() => emblaApi?.scrollNext()}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 size-11 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl hover:bg-slate-50 transition-all md:flex"
                >
                    <ChevronRight className="size-6" />
                </button>
            )}
        </div>
    );
}

export function DealershipsListClient({ dealerships }: { dealerships: Dealership[] }) {
    const t = useTranslations("dealership.list");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return dealerships;
        const q = search.toLowerCase();
        return dealerships.filter(
            (d) =>
                d.name.toLowerCase().includes(q) ||
                d.location.toLowerCase().includes(q)
        );
    }, [dealerships, search]);

    if (dealerships.length === 0) {
        return (
            <div className="text-center py-24">
                <Store className="size-16 mx-auto text-slate-200 mb-6" />
                <h2 className="text-xl font-bold text-slate-700">{t("noDealershipsTitle")}</h2>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                    {t("noDealershipsDesc")}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all"
                />
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <Search className="size-10 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-bold text-slate-700">{t("noResultsTitle")}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t("noResultsDesc")}</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {filtered.map((dealership) => (
                        <div key={dealership.id} className="group flex flex-col xl:flex-row gap-8 items-start">
                            {/* Dealership Info Sidebar */}
                            <div className="w-full xl:w-80 flex-shrink-0">
                                <Link
                                    href={`/dealerships/${dealership.slug}`}
                                    className="block p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all group/info"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-xl border-2 border-slate-100 bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {dealership.logoUrl ? (
                                                <img src={dealership.logoUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="size-6 text-slate-300" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-slate-900 group-hover/info:text-[#ff385c] transition-colors leading-tight">
                                                {dealership.name}
                                            </h2>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("officialPartner")}</span>
                                        </div>
                                    </div>

                                    {dealership.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                            {dealership.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-3.5 text-[#ff385c]" />
                                            <span className="truncate">{dealership.location}</span>
                                        </div>
                                        {dealership.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="size-3.5 text-[#ff385c]" />
                                                {dealership.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                            <Car className="size-3.5 text-[#ff385c]" />
                                            {t("listingsAvailable", { count: dealership._count.vehicles })}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-[#ff385c] font-black text-xs uppercase tracking-wider">
                                        {t("viewProfile")}
                                        <ChevronRight className="size-4 group-hover/info:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </div>

                            {/* Catalog Carousel */}
                            {dealership.vehicles.length > 0 ? (
                                <VehicleCarousel
                                    vehicles={dealership.vehicles}
                                    dealershipSlug={dealership.slug}
                                    t={t}
                                />
                            ) : (
                                <div className="flex-1 w-full h-[320px] rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6">
                                    <Car className="size-10 text-slate-300 mb-3" />
                                    <h3 className="font-bold text-slate-700">{t("noInventory")}</h3>
                                    <p className="text-xs text-slate-500 mt-1 max-w-[200px]">{t("noInventoryDesc")}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
