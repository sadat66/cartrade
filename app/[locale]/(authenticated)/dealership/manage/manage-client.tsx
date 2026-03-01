"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2, MapPin, Clock, Phone, Car, Plus, Pencil, Trash2,
    Eye, Package, Settings, ChevronRight, ImageIcon, Tag, Gauge,
    Palette, ArrowLeft, X
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
    updateDealership,
    addDealershipVehicle,
    deleteDealershipVehicle,
} from "@/app/actions/dealership";

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
    const [activeTab, setActiveTab] = useState<"catalog" | "settings">("catalog");
    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEditDealership, setShowEditDealership] = useState(false);

    const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set("dealershipId", dealership.id);
        const result = await addDealershipVehicle(formData);

        if (result && "error" in result) {
            setError(result.error ?? null);
            setIsSubmitting(false);
        } else {
            setShowAddVehicle(false);
            setIsSubmitting(false);
            router.refresh();
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Back */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Dashboard
                </Link>

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
                                    <span className="flex items-center gap-2 hover:text-[#ff385c] transition-colors cursor-default">
                                        <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <MapPin className="size-4 text-[#ff385c]" />
                                        </div>
                                        {dealership.location}
                                    </span>
                                    {dealership.phone && (
                                        <span className="flex items-center gap-2 hover:text-[#ff385c] transition-colors cursor-default">
                                            <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Phone className="size-4 text-[#ff385c]" />
                                            </div>
                                            {dealership.phone}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-2 hover:text-[#ff385c] transition-colors cursor-default">
                                        <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <Car className="size-4 text-[#ff385c]" />
                                        </div>
                                        {dealership._count.vehicles} Listings
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link href={`/dealerships/${dealership.slug}`} className="flex-1 md:flex-none">
                                <Button className="w-full rounded-xl gap-2 font-black text-xs uppercase tracking-widest bg-slate-900 hover:bg-black text-white px-6 py-5 shadow-lg shadow-slate-900/10">
                                    <Eye className="size-4" />
                                    View Page
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => setActiveTab("settings")}
                                className="rounded-xl gap-2 font-black text-xs uppercase tracking-widest border-slate-200 hover:border-slate-300 px-6 py-5 text-slate-700"
                            >
                                <Settings className="size-4" />
                                Edit Info
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-8 w-fit">
                    <button
                        onClick={() => setActiveTab("catalog")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "catalog"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Package className="size-4" />
                        Vehicle Catalog ({dealership.vehicles.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "settings"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Settings className="size-4" />
                        Settings
                    </button>
                </div>

                {/* Catalog Tab */}
                {activeTab === "catalog" && (
                    <div className="space-y-6">
                        {/* Add Vehicle Button */}
                        <Button
                            onClick={() => setShowAddVehicle(true)}
                            className="bg-gradient-to-r from-[#ff385c] to-[#e03150] hover:from-[#e03150] hover:to-[#cc2b47] text-white rounded-xl px-6 py-5 font-bold shadow-lg shadow-pink-500/25 transition-all"
                        >
                            <Plus className="size-5 mr-2" />
                            Add Vehicle
                        </Button>

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
                                                <span className="text-base font-black text-[#ff385c] whitespace-nowrap ml-2">
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
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
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
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        {showEditDealership ? (
                            <form onSubmit={handleUpdateDealership} className="space-y-5">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">Edit Dealership Info</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Dealership Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        defaultValue={dealership.name}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Location</label>
                                    <input
                                        name="location"
                                        type="text"
                                        defaultValue={dealership.location}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Operating Hours</label>
                                    <input
                                        name="operatingHours"
                                        type="text"
                                        defaultValue={dealership.operatingHours ?? ""}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Phone</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        defaultValue={dealership.phone ?? ""}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Description</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        defaultValue={dealership.description ?? ""}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium resize-none"
                                    />
                                </div>
                                {error && (
                                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
                                        {error}
                                    </div>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#ff385c] hover:bg-[#e03150] text-white rounded-xl font-bold shadow-lg shadow-pink-500/25"
                                    >
                                        {isSubmitting ? "Saving…" : "Save Changes"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowEditDealership(false)}
                                        className="rounded-xl font-bold"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-slate-900">Dealership Information</h2>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowEditDealership(true)}
                                        className="rounded-xl gap-2 font-bold text-sm"
                                    >
                                        <Pencil className="size-4" />
                                        Edit
                                    </Button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <InfoItem icon={<Building2 className="size-4 text-[#ff385c]" />} label="Name" value={dealership.name} />
                                    <InfoItem icon={<MapPin className="size-4 text-[#ff385c]" />} label="Location" value={dealership.location} />
                                    <InfoItem icon={<Clock className="size-4 text-[#ff385c]" />} label="Operating Hours" value={dealership.operatingHours ?? "Not set"} />
                                    <InfoItem icon={<Phone className="size-4 text-[#ff385c]" />} label="Phone" value={dealership.phone ?? "Not set"} />
                                </div>
                                {dealership.description && (
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</span>
                                        <p className="text-sm text-slate-700 mt-1">{dealership.description}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Add Vehicle Modal */}
                {showAddVehicle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                <h2 className="text-lg font-black text-slate-900">Add Vehicle</h2>
                                <button
                                    onClick={() => { setShowAddVehicle(false); setError(null); }}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="size-5 text-slate-500" />
                                </button>
                            </div>
                            <form onSubmit={handleAddVehicle} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Title *" name="title" placeholder="e.g. 2023 Toyota Corolla" required />
                                    <FormField label="Make *" name="make" placeholder="e.g. Toyota" required />
                                    <FormField label="Model *" name="model" placeholder="e.g. Corolla" required />
                                    <FormField label="Year *" name="year" type="number" placeholder="e.g. 2023" required />
                                    <FormField label="Price (৳) *" name="price" type="number" placeholder="e.g. 2500000" required />
                                    <FormField label="Mileage (km)" name="mileage" type="number" placeholder="e.g. 15000" />
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600">Body Type</label>
                                        <select
                                            name="bodyType"
                                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c]"
                                        >
                                            <option value="">Select</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Hatchback">Hatchback</option>
                                            <option value="Pickup">Pickup</option>
                                            <option value="Coupe">Coupe</option>
                                            <option value="Van">Van</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600">Transmission</label>
                                        <select
                                            name="transmission"
                                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c]"
                                        >
                                            <option value="">Select</option>
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </select>
                                    </div>
                                    <FormField label="Color" name="color" placeholder="e.g. White" />
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600">Condition</label>
                                        <select
                                            name="condition"
                                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c]"
                                        >
                                            <option value="used">Used</option>
                                            <option value="new">New</option>
                                            <option value="certified">Certified Pre-Owned</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600">Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        placeholder="Additional details about this vehicle..."
                                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] resize-none"
                                    />
                                </div>
                                {/* Photo uploads */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600">Photos (up to 5)</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <label
                                                key={i}
                                                className="aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-[#ff385c]/30 hover:bg-pink-50/50 transition-all"
                                            >
                                                <ImageIcon className="size-5 text-slate-300" />
                                                <input type="file" name={`photo${i}`} accept="image/*" className="hidden" />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600 font-medium">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-[#ff385c] to-[#e03150] hover:from-[#e03150] hover:to-[#cc2b47] text-white rounded-xl py-5 font-bold shadow-lg shadow-pink-500/25"
                                >
                                    {isSubmitting ? "Adding…" : "Add Vehicle"}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Components
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
            <div className="mt-0.5">{icon}</div>
            <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
            </div>
        </div>
    );
}

function FormField({
    label, name, type = "text", placeholder, required = false
}: {
    label: string; name: string; type?: string; placeholder: string; required?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">{label}</label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all"
            />
        </div>
    );
}
