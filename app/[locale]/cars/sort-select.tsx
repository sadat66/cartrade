"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Sort by:</span>
      <Select defaultValue={defaultValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] bg-white border-slate-200 rounded-xl font-bold text-slate-900 h-11 focus:ring-[#4B0082]">
          <SelectValue placeholder="Recommended" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
          <SelectItem value="recommended" className="font-bold cursor-pointer">Recommended</SelectItem>
          <SelectItem value="price_asc" className="font-bold cursor-pointer">Price: Low to High</SelectItem>
          <SelectItem value="price_desc" className="font-bold cursor-pointer">Price: High to Low</SelectItem>
          <SelectItem value="year_desc" className="font-bold cursor-pointer">Newest Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
