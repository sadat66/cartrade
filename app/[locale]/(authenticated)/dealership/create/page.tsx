"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Clock, Phone, FileText, Upload, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { createDealership } from "@/app/actions/dealership";
import { useTranslations } from "next-intl";

export default function CreateDealershipPage() {
    const t = useTranslations("dealership.create");
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await createDealership(formData);

        if (result && "error" in result) {
            setError(result.error ?? null);
            setIsSubmitting(false);
        } else if (result && "slug" in result) {
            router.push(`/dealership/manage`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Back Navigation */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 mb-8 transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    {t("backToDashboard")}
                </Link>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff385c] to-[#e03150] shadow-lg shadow-pink-500/25 mb-4">
                        <Building2 className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="mt-2 text-slate-500 text-lg">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 space-y-6">
                        {/* Logo Upload */}
                        <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-100">
                            <label
                                htmlFor="logo-upload"
                                className="relative cursor-pointer group"
                            >
                                <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#ff385c]/50 group-hover:bg-pink-50/50">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="size-6 mx-auto text-slate-400 group-hover:text-[#ff385c] transition-colors" />
                                            <span className="text-xs text-slate-400 mt-1 block">{t("uploadLogo")}</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-slate-400">{t("uploadHint")}</p>
                        </div>

                        {/* Dealership Name */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Building2 className="size-4 text-[#ff385c]" />
                                {t("nameLabel")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder={t("namePlaceholder")}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label htmlFor="location" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <MapPin className="size-4 text-[#ff385c]" />
                                {t("locationLabel")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                placeholder={t("locationPlaceholder")}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Operating Hours */}
                        <div className="space-y-2">
                            <label htmlFor="operatingHours" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Clock className="size-4 text-[#ff385c]" />
                                {t("hoursLabel")}
                            </label>
                            <input
                                id="operatingHours"
                                name="operatingHours"
                                type="text"
                                placeholder={t("hoursPlaceholder")}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Phone className="size-4 text-[#ff385c]" />
                                {t("phoneLabel")}
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder={t("phonePlaceholder")}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <FileText className="size-4 text-[#ff385c]" />
                                {t("descLabel")}
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder={t("descPlaceholder")}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c] transition-all text-sm font-medium resize-none"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#ff385c] to-[#e03150] hover:from-[#e03150] hover:to-[#cc2b47] text-white rounded-xl py-6 text-base font-bold shadow-lg shadow-pink-500/25 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {t("submitting")}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="size-5" />
                                {t("submitButton")}
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
