import { prisma } from "@/lib/db";
import { ListingCard } from "@/components/listing/listing-card";
import { Hero } from "@/components/landing/hero";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/config";
import { Sparkles } from "lucide-react";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CarsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const sParams = await searchParams;
    const t = await getTranslations({ locale, namespace: "featured" });

    const {
        make,
        model,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        bodyType,
        minMileage,
        maxMileage,
        location,
        aiMessage,
    } = sParams;

    const where: any = {
        status: "active",
    };

    if (make) where.make = { contains: String(make), mode: "insensitive" };
    if (model) where.model = { contains: String(model), mode: "insensitive" };
    if (bodyType && bodyType !== "any") where.bodyType = String(bodyType);

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (minYear || maxYear) {
        where.year = {};
        if (minYear) where.year.gte = Number(minYear);
        if (maxYear) where.year.lte = Number(maxYear);
    }

    if (minMileage || maxMileage) {
        where.mileage = {};
        if (minMileage) where.mileage.gte = Number(minMileage);
        if (maxMileage) where.mileage.lte = Number(maxMileage);
    }

    if (location) where.location = { contains: String(location), mode: "insensitive" };

    const listings = await prisma.listing.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-background pb-20">
            <Hero />
            <div className="container mx-auto px-4 mt-40 md:mt-48">
                {aiMessage && (
                    <div className="mb-10 p-6 bg-purple-600/10 border border-purple-600/20 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-3 bg-purple-600 rounded-2xl">
                            <Sparkles className="size-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-1">AI Assistant</p>
                            <p className="text-xl font-medium text-slate-900 dark:text-slate-100 italic">"{aiMessage}"</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
                        <p className="text-muted-foreground mt-1">Found {listings.length} cars matching your criteria</p>
                    </div>
                </div>

                {listings.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
                        <p className="text-xl font-medium text-muted-foreground">No cars found matching your search.</p>
                        <button className="mt-4 text-blue-600 font-semibold hover:underline">Clear all filters</button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} kmLabel={t("km")} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
