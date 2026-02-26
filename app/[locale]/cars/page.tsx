import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/listing/listing-card";
import { resolveListing } from "@/lib/listing-images";
import { Link } from "@/i18n/navigation";
import { FilterSidebar } from "./filter-sidebar";
import { SortSelect } from "./sort-select";
import { CarsControls } from "./cars-controls";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ChevronRight, CarFront, RotateCcw, Search } from "lucide-react";

type SearchParams = { [key: string]: string | undefined };

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<SearchParams>;
};

export default async function CarsPage({ params, searchParams }: Props) {
    const sParams = await searchParams;

    const {
        q,
        make,
        model,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        bodyType,
        minMileage,
        maxMileage,
        fuelType,
        transmission,
        drivetrain,
        seats,
        colour,
        available,
        sort = "recommended",
    } = sParams;

    // --- Build Prisma Query ---
    const where: any = { status: "active" };

    if (q) {
        where.OR = [
            { title: { contains: String(q), mode: "insensitive" } },
            { make: { contains: String(q), mode: "insensitive" } },
            { model: { contains: String(q), mode: "insensitive" } },
            { bodyType: { contains: String(q), mode: "insensitive" } },
        ];
    }

    if (make) {
        where.make = { contains: String(make), mode: "insensitive" };
    }

    if (model) {
        where.model = { contains: String(model), mode: "insensitive" };
    }

    if (bodyType && bodyType !== "any") {
        where.bodyType = { equals: String(bodyType), mode: "insensitive" };
    }

    // Price Range
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // Year Range
    if (minYear || maxYear) {
        where.year = {};
        if (minYear) where.year.gte = Number(minYear);
        if (maxYear) where.year.lte = Number(maxYear);
    }

    // Mileage (Kilometers) Range
    if (minMileage || maxMileage) {
        where.mileage = {};
        if (minMileage) where.mileage.gte = Number(minMileage);
        if (maxMileage) where.mileage.lte = Number(maxMileage);
    }

    if (transmission && transmission !== "any") {
        where.transmission = { equals: String(transmission), mode: "insensitive" };
    }

    if (drivetrain && drivetrain !== "any") {
        where.drivetrain = { equals: String(drivetrain), mode: "insensitive" };
    }

    if (colour && colour !== "any") {
        where.color = { equals: String(colour), mode: "insensitive" };
    }

    if (fuelType && fuelType !== "any") {
        // where.fuelType = { equals: String(fuelType), mode: "insensitive" };
    }

    // Sorting Logic
    const sortMapping: { [key: string]: any } = {
        recommended: { createdAt: "desc" },
        price_asc: { price: "asc" },
        price_desc: { price: "desc" },
        year_desc: { year: "desc" },
    };
    const orderBy = sortMapping[sort] || sortMapping.recommended;

    // --- Data Fetching with Error Handling ---
    let resolvedListings: any[] = [];
    let formattedMakes: any[] = [];
    let formattedBodyTypes: any[] = [];
    let formattedTransmissions: any[] = [];
    let formattedDrivetrains: any[] = [];
    let formattedColours: any[] = [];

    try {
        const [listings, makeCounts, bodyTypeCounts, transCounts, driveCounts, colorCounts] = await Promise.all([
            prisma.listing.findMany({
                where,
                orderBy,
                take: 50 // Performance capping
            }),
            prisma.listing.groupBy({
                by: ["make"],
                where: { status: "active" },
                _count: { _all: true },
            }),
            prisma.listing.groupBy({
                by: ["bodyType"],
                where: { status: "active" },
                _count: { _all: true },
            }),
            prisma.listing.groupBy({
                by: ["transmission"],
                where: { status: "active" },
                _count: { _all: true },
            }),
            prisma.listing.groupBy({
                by: ["drivetrain"],
                where: { status: "active" },
                _count: { _all: true },
            }),
            prisma.listing.groupBy({
                by: ["color"],
                where: { status: "active" },
                _count: { _all: true },
            }),
        ]);

        resolvedListings = listings.map((l: any) => ({
            ...resolveListing(l),
            price: Number(l.price),
            isDepositTaken: l.title.length % 7 === 0,
            transmission: l.transmission || "Automatic",
            weeklyEstimate: Math.round(Number(l.price) / 200),
            interestRate: 10.02
        }));

        // --- Prepare Filter Data ---
        formattedMakes = makeCounts
            .filter((m: any) => m.make)
            .map((m: any) => ({
                key: m.make!.toLowerCase(),
                label: m.make!,
                count: m._count._all
            }))
            .sort((a: any, b: any) => b.count - a.count);

        formattedBodyTypes = bodyTypeCounts
            .filter((b: any) => b.bodyType)
            .map((b: any) => ({
                key: b.bodyType!.toLowerCase(),
                label: b.bodyType!,
                count: b._count._all
            }))
            .sort((a: any, b: any) => b.count - a.count);

        formattedTransmissions = transCounts
            .filter((t: any) => t.transmission)
            .map((t: any) => ({
                key: t.transmission!.toLowerCase(),
                label: t.transmission!,
                count: t._count._all
            }));

        formattedDrivetrains = driveCounts
            .filter((d: any) => d.drivetrain)
            .map((d: any) => ({
                key: d.drivetrain!.toLowerCase(),
                label: d.drivetrain!.toUpperCase(),
                count: d._count._all
            }));

        const colorHexMap: { [key: string]: string } = {
            white: "#FFFFFF",
            black: "#000000",
            silver: "#C0C0C0",
            blue: "#0000FF",
            red: "#FF0000"
        };

        formattedColours = colorCounts
            .filter((c: any) => c.color)
            .map((c: any) => ({
                key: c.color!.toLowerCase(),
                label: c.color!,
                count: c._count._all,
                hex: colorHexMap[c.color!.toLowerCase()] || "#CCCCCC"
            }));
    } catch (error) {
        console.error("Failed to fetch listings or filter data:", error);
        // Return empty arrays on error - the component will handle empty state
    }

    const t = await getTranslations({ locale: (await params).locale });

    return (
        <div className="min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-[#F8FAFC]">
            <div className="container mx-auto px-4 md:px-6 h-full flex flex-col py-6 pt-8 lg:pt-14">
                <Breadcrumb
                    items={[
                        { label: t("cars.breadcrumb.home"), href: "/" },
                        { label: t("cars.breadcrumb.cars") }
                    ]}
                    className="mb-6"
                />

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:flex-1 lg:min-h-0">
                    {/* Sidebar - Desktop Only */}
                    <aside className="hidden lg:block w-[300px] shrink-0 h-full">
                        <FilterSidebar
                            makes={formattedMakes}
                            bodyTypes={formattedBodyTypes}
                            transmissions={formattedTransmissions}
                            drivetrains={formattedDrivetrains}
                            colours={formattedColours}
                            currentFilters={sParams}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 w-full lg:min-w-0 lg:h-full flex flex-col lg:min-h-0">
                        <div className="shrink-0">
                            <CarsControls
                                resultCount={resolvedListings.length}
                                sort={sort}
                                makes={formattedMakes}
                                bodyTypes={formattedBodyTypes}
                                transmissions={formattedTransmissions}
                                drivetrains={formattedDrivetrains}
                                colours={formattedColours}
                                currentFilters={sParams}
                            />
                        </div>

                        <div className="lg:flex-1 lg:overflow-y-auto scrollbar-hide pb-10">
                            {resolvedListings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 lg:py-32 px-6 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-10">
                                            <div className="size-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center shadow-inner relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-200/20" />
                                                <CarFront className="size-10 text-slate-300 stroke-[1.2] relative z-10" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 size-8 bg-[#4B0082] rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                                                <Search className="size-4 text-white" />
                                            </div>
                                        </div>

                                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                                            {t("cars.empty.title")}
                                        </h2>
                                        <p className="text-slate-500 mb-8 lg:mb-10 max-w-[320px] font-bold leading-relaxed text-sm lg:text-base">
                                            {t("cars.empty.subtitle")}
                                        </p>

                                        <Link
                                            href="/cars"
                                            className="group flex items-center gap-3 bg-slate-900 hover:bg-[#4B0082] text-white rounded-2xl px-8 lg:px-10 py-4 lg:py-5 text-sm font-black transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10"
                                        >
                                            <RotateCcw className="size-4 transition-transform group-hover:rotate-180 duration-700" />
                                            <span>{t("cars.empty.reset")}</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {resolvedListings.map((listing: any) => (
                                        <ListingCard key={listing.id} listing={listing} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
