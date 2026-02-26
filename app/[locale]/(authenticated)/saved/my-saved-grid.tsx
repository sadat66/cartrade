"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Car, ExternalLink, Search, ChevronLeft, ChevronRight, HeartOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { unsaveListing } from "@/app/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Listing = {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    imageUrls: string[];
    status: string;
    mileage: number | null;
    bodyType: string | null;
    location: string | null;
    createdAt: string;
};

type Props = {
    listings: Listing[];
    noImageLabel: string;
    emptyTitle: string;
    emptySubtitle: string;
    browseLabel: string;
};

const ITEMS_PER_PAGE = 5;

export function MySavedGrid({
    listings,
    noImageLabel,
    emptyTitle,
    emptySubtitle,
    browseLabel,
}: Props) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isUnsaving, setIsUnsaving] = useState<string | null>(null);

    const filteredListings = useMemo(() => {
        return listings.filter((listing) => {
            const searchStr = `${listing.title} ${listing.make} ${listing.model} ${listing.year}`.toLowerCase();
            return searchStr.includes(searchQuery.toLowerCase());
        });
    }, [listings, searchQuery]);

    const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredListings.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredListings, currentPage]);

    const handleUnsave = async (listingId: string) => {
        try {
            setIsUnsaving(listingId);
            const result = await unsaveListing(listingId);
            if (result.success) {
                toast.success("Removed from saved listings");
                router.refresh();
            } else {
                toast.error("Failed to remove listing");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUnsaving(null);
        }
    };

    if (listings.length === 0) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center",
                    "animate-in fade-in-0 duration-300 fill-mode-both"
                )}
            >
                <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Car className="size-8" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">{emptyTitle}</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {emptySubtitle}
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3D0066] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/10 transition-all hover:bg-[#2A0045] active:scale-95"
                >
                    {browseLabel}
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in-0 duration-300">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Filter saved listings..."
                    className="pl-9 h-11 rounded-xl bg-white focus-visible:ring-purple-500/20 border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[120px] h-12 text-[11px] font-bold uppercase tracking-wider text-slate-500 pl-6">Image</TableHead>
                            <TableHead className="h-12 text-[11px] font-bold uppercase tracking-wider text-slate-500">Details</TableHead>
                            <TableHead className="h-12 text-[11px] font-bold uppercase tracking-wider text-slate-500">Specifics</TableHead>
                            <TableHead className="h-12 text-[11px] font-bold uppercase tracking-wider text-slate-500">Price</TableHead>
                            <TableHead className="text-right h-12 text-[11px] font-bold uppercase tracking-wider text-slate-500 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.length > 0 ? (
                            currentItems.map((listing) => (
                                <TableRow key={listing.id} className="group transition-colors hover:bg-slate-50/50">
                                    <TableCell className="pl-6">
                                        <div className="relative h-14 w-20 overflow-hidden rounded-xl bg-muted border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                                            {listing.imageUrls[0] ? (
                                                <Image
                                                    src={listing.imageUrls[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center p-1 text-[9px] text-muted-foreground text-center bg-slate-50 font-bold">
                                                    {noImageLabel}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <Link
                                                href={`/cars/${listing.id}`}
                                                className="font-bold text-slate-900 transition-colors group-hover:text-[#3D0066] truncate max-w-[180px]"
                                                title={listing.title}
                                            >
                                                {listing.title}
                                            </Link>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{listing.year}</span>
                                                <span>{listing.make} {listing.model}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-[10px]">
                                            {listing.mileage != null && (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400 font-bold w-12">Mileage:</span>
                                                    <span className="text-slate-700 font-black">{listing.mileage.toLocaleString()} km</span>
                                                </div>
                                            )}
                                            {listing.bodyType && (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400 font-bold w-12">Body:</span>
                                                    <span className="text-slate-700 font-black">{listing.bodyType}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-slate-900 text-base">
                                        ${listing.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end items-center gap-2">
                                            <Button asChild size="icon" variant="ghost" className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg shadow-none" title="View Listing">
                                                <Link href={`/cars/${listing.id}`}>
                                                    <ExternalLink className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg shadow-none"
                                                title="Remove from saved"
                                                onClick={() => handleUnsave(listing.id)}
                                                disabled={isUnsaving === listing.id}
                                            >
                                                <HeartOff className={cn("size-4", isUnsaving === listing.id && "animate-pulse")} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium italic">
                                    No listings match your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4">
                    <p className="text-xs font-bold text-slate-500 order-2 sm:order-1">
                        Showing <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                        <span className="text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredListings.length)}</span> of{" "}
                        <span className="text-slate-900">{filteredListings.length}</span> listings
                    </p>
                    <div className="order-1 sm:order-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl hover:bg-slate-100"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <Button
                                            variant={currentPage === page ? "default" : "ghost"}
                                            size="icon"
                                            className={cn(
                                                "h-9 w-9 rounded-xl text-xs font-bold transition-all",
                                                currentPage === page
                                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                                    : "text-slate-500 hover:bg-slate-100"
                                            )}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl hover:bg-slate-100"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}
        </div>
    );
}
