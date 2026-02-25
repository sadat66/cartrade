import { prisma } from "@/lib/db";
import { ListingCard } from "@/components/listing/listing-card";
import { resolveListing } from "@/lib/listing-images";
import { Link } from "@/i18n/navigation";
import { FilterSidebar } from "./filter-sidebar";
import { SortSelect } from "./sort-select";
import { ChevronRight, Settings2, CarFront, RotateCcw } from "lucide-react";

type SearchParams = { [key: string]: string | undefined };

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<SearchParams>;
};

export default async function CarsPage({ params, searchParams }: Props) {
    const sParams = await searchParams;

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

    // Note: FuelType, Transmission, etc. are handled here for when they are added to DB
    // For now, they won't filter anything unless we map them or add them to the schema.
    // If the user hasn't added them to the schema, these clauses will just be ignored by Prisma if fields don't exist,
    // but to prevent errors, we only add them if we know they exist.
    // Given the current schema, we skip these for now but the UI is ready.

    // Sorting Logic
    const sortMapping: { [key: string]: any } = {
        recommended: { createdAt: "desc" },
        price_asc: { price: "asc" },
        price_desc: { price: "desc" },
        year_desc: { year: "desc" },
    };
    const orderBy = sortMapping[sort] || sortMapping.recommended;

    // --- Data Fetching ---
    const [listings, makeCounts, bodyTypeCounts] = await Promise.all([
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
    ]);

    const resolvedListings = listings.map((l: any) => ({
        ...resolveListing(l),
        price: Number(l.price),
        isDepositTaken: l.title.length % 7 === 0,
        transmission: "Automatic", // Default for now
        weeklyEstimate: Math.round(Number(l.price) / 200),
        interestRate: 10.02
    }));

    // --- Prepare Filter Data ---
    const formattedMakes = makeCounts
        .filter(m => m.make)
        .map(m => ({
            key: m.make!.toLowerCase(),
            label: m.make!,
            count: m._count._all
        }))
        .sort((a, b) => b.count - a.count);

    const formattedBodyTypes = bodyTypeCounts
        .filter(b => b.bodyType)
        .map(b => ({
            key: b.bodyType!.toLowerCase(),
            label: b.bodyType!,
            count: b._count._all
        }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="container mx-auto px-4 md:px-6 py-10 pt-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
                  <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                  <ChevronRight className="size-3" />
                  <span className="text-slate-900">Cars</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-[300px] lg:sticky lg:top-24">
                        <FilterSidebar 
                            makes={formattedMakes} 
                            bodyTypes={formattedBodyTypes}
                            currentFilters={sParams}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 mb-2">Our cars</h1>
                                <p className="text-slate-500 font-bold border-l-4 border-[#4B0082] pl-3">
                                    Showing {resolvedListings.length} results
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <SortSelect defaultValue={sort} />
                                <button className="lg:hidden p-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
                                  <Settings2 className="size-5" />
                                </button>
                            </div>
                        </div>

                        {resolvedListings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-8">
                                      <div className="size-20 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center shadow-sm relative">
                                        <CarFront className="size-8 text-slate-300 stroke-[1.5]" />
                                      </div>
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                                        Refine your search
                                    </h2>
                                    <p className="text-sm text-slate-500 mb-8 max-w-[280px] font-medium leading-relaxed">
                                        We couldn't find any results matching your filters. Try a different combination.
                                    </p>
                                    
                                    <Link
                                        href="/cars"
                                        className="group flex items-center gap-2.5 bg-slate-900 hover:bg-[#4B0082] text-white rounded-xl px-8 py-3.5 text-sm font-bold transition-all active:scale-[0.98]"
                                    >
                                        <RotateCcw className="size-4 transition-transform group-hover:rotate-180 duration-500" />
                                        <span>Reset all filters</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {resolvedListings.map((listing: any) => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
