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
import { useTranslations } from "next-intl";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("cars.sort");

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getSortLabel = (val: string) => {
    switch (val) {
      case "price_asc": return t("price_asc");
      case "price_desc": return t("price_desc");
      case "year_desc": return t("year_desc");
      default: return t("recommended");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={defaultValue} onValueChange={handleSortChange}>
        <SelectTrigger className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#4B0082]/30 bg-white px-4 text-xs font-black text-[#4B0082] transition-all hover:bg-[#4B0082]/5 active:scale-[0.98] focus:ring-4 focus:ring-[#4B0082]/10 !ring-offset-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold hidden sm:inline">{t("label")}:</span>
            <SelectValue>
              {getSortLabel(defaultValue)}
            </SelectValue>
          </div>
          <ArrowUpDown className="size-3.5 opacity-70" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-slate-100 p-1 shadow-2xl">
          <SelectItem value="recommended" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">{t("recommended")}</SelectItem>
          <SelectItem value="price_asc" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">{t("price_asc")}</SelectItem>
          <SelectItem value="price_desc" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">{t("price_desc")}</SelectItem>
          <SelectItem value="year_desc" className="rounded-xl py-3 font-bold cursor-pointer focus:bg-[#4B0082]/5 focus:text-[#4B0082]">{t("year_desc")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
