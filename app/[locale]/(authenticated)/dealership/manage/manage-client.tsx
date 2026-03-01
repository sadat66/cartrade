"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2, MapPin, Clock, Phone, Car, Plus, Pencil, Trash2,
    Eye, Package, Settings, ChevronRight, ImageIcon, Tag, Gauge,
    Palette, ArrowLeft, X, Loader2
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
    updateDealership,
    addDealershipVehicle,
    deleteDealershipVehicle,
} from "@/app/actions/dealership";
import { NewListingModal } from "@/components/sell-car/new-listing-modal";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

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
    vehicles: Vehicle[];
    _count: { vehicles: number };
    createdAt: string;
    updatedAt: string;
};

export function DealershipManageClient({ dealership }: { dealership: Dealership }) {
    const router = useRouter();
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState<"catalog" | "settings">("catalog");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEditDealership, setShowEditDealership] = useState(false);


    const handleDeleteVehicle = async (vehicleId: string) => {
        if (!confirm("Are you sure you want to remove this vehicle?")) return;
        const formData = new FormData();
        formData.set("vehicleId", vehicleId);
        await deleteDealershipVehicle(formData);
        router.refresh();
    };

    const handleUpdateDealership = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set("dealershipId", dealership.id);
        const result = await updateDealership(formData);

        if (result && "error" in result) {
            setError(result.error ?? null);
            setIsSubmitting(false);
        } else {
            setShowEditDealership(false);
            setIsSubmitting(false);
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="container mx-auto px-4 md:px-6 py-6 pt-8 lg:pt-14 space-y-6">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: t("cars.breadcrumb.home"), href: "/" },
                        { label: t("dashboard.nav.dashboard"), href: "/dashboard" },
                        { label: dealership.name }
                    ]}
                />

                {/* Dealership Header Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden mb-10 group/header">
                    {/* Cover Section */}
                    <div className="h-44 md:h-52 bg-gradient-to-r from-[#1e293b] to-[#3D0066] relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-[size:20px_20px]" />
                        {dealership.coverUrl && (
                            <img
                                src={dealership.coverUrl}
                                alt=""
                                className="w-full h-full object-cover opacity-60"
                            />
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="px-8 pt-12 pb-8 -mt-10 relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 flex-1 min-w-0">
                            {/* Logo */}
                            <div className="w-24 h-24 rounded-xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center flex-shrink-0 -mt-20 md:-mt-24">
                                {dealership.logoUrl ? (
                                    <img src={dealership.logoUrl} alt={dealership.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="size-10 text-slate-200" />
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="flex-1 min-w-0 pb-1 w-full md:w-auto">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 truncate tracking-tight">{dealership.name}</h1>
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                        Verified
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-slate-500">
                                    <span className="flex items-center gap-2 hover:text-[#3D0066] transition-colors cursor-default">
                                        <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 font-bold">
                                            <MapPin className="size-4 text-[#3D0066]" />
                                        </div>
                                        {dealership.location}
                                    </span>
                                    {dealership.phone && (
                                        <span className="flex items-center gap-2 hover:text-[#3D0066] transition-colors cursor-default">
                                            <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 font-bold">
                                                <Phone className="size-4 text-[#3D0066]" />
                                            </div>
                                            {dealership.phone}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-2 hover:text-[#3D0066] transition-colors cursor-default">
                                        <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 font-bold">
                                            <Car className="size-4 text-[#3D0066]" />
                                        </div>
                                        {dealership._count.vehicles} Listings
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link href={`/dealerships/${dealership.slug}`} className="flex-1 md:flex-none">
                                <Button className="w-full rounded-xl gap-2 font-black text-xs uppercase tracking-widest bg-[#3D0066] hover:bg-[#2A0045] text-white px-6 py-5 shadow-lg shadow-slate-900/10 cursor-pointer">
                                    <Eye className="size-4" />
                                    View Page
                                </Button>
                            </Link>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="rounded-xl gap-2 font-black text-xs uppercase tracking-widest border-slate-200 hover:border-slate-300 px-6 py-5 text-slate-700 transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
                                    >
                                        <Pencil className="size-4" />
                                        Edit info
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-8">
                                    <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight mb-8">Dealership Information</SheetTitle>

                                    {showEditDealership ? (
                                        <form onSubmit={handleUpdateDealership} className="space-y-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-bold text-[#3D0066]">Editing Mode</p>
                                                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                                            </div>
                                            <div className="space-y-2 group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-[#3D0066] transition-colors">Dealership Name</label>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    defaultValue={dealership.name}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#3D0066]/5 focus:border-[#3D0066] focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="space-y-2 group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-[#3D0066] transition-colors">Location</label>
                                                <input
                                                    name="location"
                                                    type="text"
                                                    defaultValue={dealership.location}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#3D0066]/5 focus:border-[#3D0066] focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2 group/input">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-[#3D0066] transition-colors">Operating Hours</label>
                                                    <input
                                                        name="operatingHours"
                                                        type="text"
                                                        defaultValue={dealership.operatingHours ?? ""}
                                                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#3D0066]/5 focus:border-[#3D0066] focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <div className="space-y-2 group/input">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-[#3D0066] transition-colors">Phone</label>
                                                    <input
                                                        name="phone"
                                                        type="tel"
                                                        defaultValue={dealership.phone ?? ""}
                                                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#3D0066]/5 focus:border-[#3D0066] focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-[#3D0066] transition-colors">Company Biography</label>
                                                <textarea
                                                    name="description"
                                                    rows={5}
                                                    defaultValue={dealership.description ?? ""}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#3D0066]/5 focus:border-[#3D0066] focus:bg-white transition-all text-sm font-bold resize-none placeholder:text-slate-300 leading-relaxed"
                                                />
                                            </div>
                                            {error && (
                                                <div className="rounded-2xl bg-red-50 border-2 border-red-100 px-5 py-4 text-xs text-red-600 font-bold uppercase tracking-tight">
                                                    {error}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="flex-1 bg-[#3D0066] border-2 border-[#3D0066] hover:bg-[#2A0045] hover:border-[#2A0045] text-white rounded-xl py-6 font-black text-[10px] uppercase tracking-widest active:scale-[0.98] transition-all cursor-pointer"
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="size-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Package className="size-4 mr-2" />
                                                    )}
                                                    Update Identity
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => setShowEditDealership(false)}
                                                    className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6 hover:bg-slate-100 text-slate-500 cursor-pointer"
                                                >
                                                    Dismiss
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-10">
                                            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#3D0066]">Account Status</p>
                                                    <p className="text-sm font-bold text-slate-500">Merchant Partner Verified</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowEditDealership(true)}
                                                    className="rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest border-2 border-[#3D0066]/20 text-[#3D0066] px-5 py-4 hover:bg-[#3D0066] hover:text-white transition-all shadow-none cursor-pointer"
                                                >
                                                    <Pencil className="size-3.5" />
                                                    Edit
                                                </Button>
                                            </div>
                                            <div className="grid gap-2">
                                                <InfoItem icon={Building2} label="Legal Entity" value={dealership.name} />
                                                <InfoItem icon={MapPin} label="Operational Zone" value={dealership.location} />
                                                <InfoItem icon={Clock} label="Availability" value={dealership.operatingHours ?? "Not established"} />
                                                <InfoItem icon={Phone} label="Direct Line" value={dealership.phone ?? "No contact"} />
                                            </div>
                                            {dealership.description && (
                                                <div className="p-8 rounded-[2rem] bg-slate-50/50 border-2 border-slate-50 space-y-4">
                                                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 shadow-sm">
                                                        About the Merchant
                                                    </span>
                                                    <p className="text-sm leading-relaxed text-slate-600 font-bold tracking-tight">{dealership.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                {/* Catalog Section Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Catalog</h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                            Manage your inventory · {dealership.vehicles.length} {dealership.vehicles.length === 1 ? 'listing' : 'listings'}
                        </p>
                    </div>
                    <NewListingModal 
                        title="Add Car to Catalog"
                        subtitle={`New inventory entry for ${dealership.name}`}
                        action={addDealershipVehicle}
                        initialData={{ dealershipId: dealership.id }}
                        onSuccess={() => router.refresh()}
                        trigger={
                            <Button className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-6 py-5 font-bold shadow-lg shadow-purple-900/10 transition-all active:scale-95 cursor-pointer">
                                <Plus className="size-5 mr-2" />
                                Add New Catalog
                            </Button>
                        }
                    />
                </div>

                {/* Catalog Grid */}
                <div className="space-y-6 pb-20">

                        {/* Vehicle Grid */}
                        {dealership.vehicles.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                                <Car className="size-12 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-700">No vehicles yet</h3>
                                <p className="text-sm text-slate-500 mt-1">Add your first vehicle to start building your catalog</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {dealership.vehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
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
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="size-10 text-slate-300" />
                                                </div>
                                            )}
                                            {/* Status Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${vehicle.status === "available"
                                                    ? "bg-green-100 text-green-700"
                                                    : vehicle.status === "sold"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                    {vehicle.status}
                                                </span>
                                            </div>
                                            {vehicle.condition && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-white/90 backdrop-blur-sm text-slate-700 rounded-full px-2.5 py-1 text-xs font-bold">
                                                        {vehicle.condition}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="p-4 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-slate-900 truncate text-sm">{vehicle.title}</h3>
                                                    <p className="text-xs text-slate-500">
                                                        {vehicle.year} · {vehicle.make} {vehicle.model}
                                                    </p>
                                                </div>
                                                <span className="text-base font-black text-[#3D0066] whitespace-nowrap ml-2">
                                                    ৳{vehicle.price.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Quick Info */}
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {vehicle.mileage && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 rounded-md px-2 py-0.5">
                                                        <Gauge className="size-3" />
                                                        {vehicle.mileage.toLocaleString()} km
                                                    </span>
                                                )}
                                                {vehicle.transmission && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 rounded-md px-2 py-0.5">
                                                        <Tag className="size-3" />
                                                        {vehicle.transmission}
                                                    </span>
                                                )}
                                                {vehicle.color && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 rounded-md px-2 py-0.5">
                                                        <Palette className="size-3" />
                                                        {vehicle.color}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleDeleteVehicle(vehicle.id)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                    Remove
                                                </button>
                                            </div>
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

// Helper Components
function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50/80 transition-all group/info">
            <div className="size-12 rounded-xl bg-white border-2 border-slate-50 flex items-center justify-center shadow-sm group-hover/info:border-[#3D0066]/20 group-hover/info:text-[#3D0066] transition-all">
                <Icon className="size-5" />
            </div>
            <div className="space-y-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{label}</span>
                <p className="text-sm font-black text-slate-900 truncate">{value}</p>
            </div>
        </div>
    );
}
