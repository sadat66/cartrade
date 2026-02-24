import { prisma } from "@/lib/db";
import { ListingCard } from "@/components/listing/listing-card";
import { resolveListing } from "@/lib/listing-images";
import { Hero } from "@/components/landing/hero";
import { BodyTypeFilter } from "@/components/landing/body-type-filter";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/config";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

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
    if (bodyType && bodyType !== "any") {
        const bt = String(bodyType);
        // Map filter labels to DB values for backwards compatibility
        if (bt === "offroad") where.bodyType = "sports";
        else if (bt === "electric") where.bodyType = "coupe";
        else where.bodyType = bt;
    }

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
    const resolvedListings = listings.map((l: any) => ({
        ...resolveListing(l),
        price: Number(l.price),
        isDepositTaken: l.title.length % 7 === 0,
        transmission: "Automatic",
        weeklyEstimate: Math.round(Number(l.price) / 200),
        interestRate: 10.02
    }));

    return (
        <div className="min-h-screen bg-background pb-20">
            <Hero />
            <div className="container mx-auto mt-44 px-4 md:mt-56">
                <BodyTypeFilter />
                {aiMessage && (
                    <div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-primary-foreground">
                            <Sparkles className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI Assistant</p>
                            <p className="mt-0.5 text-sm font-medium italic text-foreground">"{aiMessage}"</p>
                        </div>
                    </div>
                )}

                {resolvedListings.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
                        <p className="text-muted-foreground">No cars match your search.</p>
                        <Link
                            href="/cars"
                            className="mt-3 inline-block text-sm font-medium text-foreground underline hover:no-underline"
                        >
                            Clear filters
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {resolvedListings.map((listing: any) => (
                                <ListingCard key={listing.id} listing={listing} kmLabel={t("km")} />
                            ))}
                        </div>
                        <div className="mt-16 flex justify-center">
                            <Link 
                                href="/cars"
                                className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-10 py-4 text-[15px] font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 uppercase"
                            >
                                View all {String(bodyType || 'SUV').toUpperCase()}s
                                <Sparkles className="size-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
