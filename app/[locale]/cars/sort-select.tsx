"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getSortLabel = (val: string) => {
    switch (val) {
      case "price_asc": return "Price: Low to High";
      case "price_desc": return "Price: High to Low";
      case "year_desc": return "Newest Year";
      default: return "Recommended";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={defaultValue} onValueChange={handleSortChange}>
        <SelectTrigger className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#4B0082]/30 bg-white px-4 text-xs font-black text-[#4B0082] transition-all hover:bg-[#4B0082]/5 active:scale-[0.98] focus:ring-4 focus:ring-[#4B0082]/10 !ring-offset-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold hidden sm:inline">Sort by:</span>
            <SelectValue>
              {getSortLabel(defaultValue)}
            </SelectValue>
          </div>
          <ArrowUpDown className="size-3.5 opacity-70" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-slate-100 p-1 shadow-2xl">
          <SelectItem value="recommended" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">Recommended</SelectItem>
          <SelectItem value="price_asc" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">Price: Low to High</SelectItem>
          <SelectItem value="price_desc" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">Price: High to Low</SelectItem>
          <SelectItem value="year_desc" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">Newest Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
