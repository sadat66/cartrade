"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  RotateCcw, 
  Car, 
  DollarSign, 
  Calendar, 
  ChevronRight,
  Gauge,
  Fuel,
  Settings2,
  Lock,
  Armchair,
  DoorOpen,
  Palette,
  ShieldCheck,
  Leaf,
  Anchor,
  Eye,
  Check
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

// --- Types ---
type CountItem = {
  key: string;
  label: string;
  count: number;
};

type FilterSidebarProps = {
  makes: CountItem[];
  bodyTypes: CountItem[];
  currentFilters: { [key: string]: string | undefined };
};

// --- Mock Data for New Filters (Since they aren't in DB yet) ---
const FUEL_TYPES = [
  { key: "petrol", label: "Petrol", count: 12 },
  { key: "diesel", label: "Diesel", count: 8 },
  { key: "electric", label: "Electric", count: 3 },
  { key: "hybrid", label: "Hybrid", count: 5 },
];

const TRANSMISSIONS = [
  { key: "automatic", label: "Automatic", count: 20 },
  { key: "manual", label: "Manual", count: 8 },
];

const DRIVETRAINS = [
  { key: "fwd", label: "FWD", count: 15 },
  { key: "rwd", label: "RWD", count: 5 },
  { key: "awd", label: "AWD", count: 8 },
];

const COLOURS = [
  { key: "white", label: "White", hex: "#FFFFFF", count: 10 },
  { key: "black", label: "Black", hex: "#000000", count: 8 },
  { key: "silver", label: "Silver", hex: "#C0C0C0", count: 5 },
  { key: "blue", label: "Blue", hex: "#0000FF", count: 3 },
  { key: "red", label: "Red", hex: "#FF0000", count: 2 },
];

// --- Sub-components ---

function FilterSection({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}) {
  return (
    <div className="p-0">
      <button 
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="size-4" />
          </div>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="size-4 text-slate-400" /> : <ChevronDown className="size-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="px-6 pb-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({ makes, bodyTypes, currentFilters }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openSections, setOpenSections] = useState<string[]>(["make", "body", "price", "year"]);
  const [makeSearch, setMakeSearch] = useState("");

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push("/cars", { scroll: false });
  };

  const filteredMakes = makes.filter(m => 
    m.label.toLowerCase().includes(makeSearch.toLowerCase())
  ).sort((a, b) => b.count - a.count);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <h2 className="text-lg font-black text-slate-900">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-slate-400 hover:text-[#4B0082] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="size-3" />
          Clear all
        </button>
      </div>

      {/* Filter Content - Scrollable */}
      <div className="overflow-y-auto custom-scrollbar flex-1 divide-y divide-slate-50">
        
        {/* Make & Model */}
        <FilterSection 
          title="Make & Model" 
          icon={Car} 
          isOpen={openSections.includes("make")} 
          onToggle={() => toggleSection("make")}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="Search make"
              value={makeSearch}
              onChange={(e) => setMakeSearch(e.target.value)}
              className="pl-10 h-10 border-slate-200 rounded-xl focus:ring-[#4B0082] focus:border-[#4B0082]"
            />
          </div>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredMakes.map((make) => (
              <label key={make.key} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      checked={currentFilters.make?.toLowerCase() === make.key.toLowerCase()}
                      onChange={() => handleFilterChange("make", currentFilters.make === make.key ? null : make.key)}
                      className="peer size-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082] cursor-pointer appearance-none border-2 checked:bg-[#4B0082] checked:border-[#4B0082] transition-all"
                    />
                    <Check className="absolute left-0.5 size-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    currentFilters.make === make.key ? "text-[#4B0082]" : "text-slate-600 group-hover:text-slate-900"
                  )}>
                    {make.label} <span className="text-slate-400 font-medium ml-1">({make.count})</span>
                  </span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Kilometers (Mileage) */}
        <FilterSection 
          title="Kilometers" 
          icon={Gauge} 
          isOpen={openSections.includes("km")} 
          onToggle={() => toggleSection("km")}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Min</label>
              <Input 
                type="number"
                placeholder="0"
                value={currentFilters.minMileage || ""}
                onChange={(e) => handleFilterChange("minMileage", e.target.value)}
                className="border-slate-200 rounded-xl h-10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Max</label>
              <Input 
                type="number"
                placeholder="Any"
                value={currentFilters.maxMileage || ""}
                onChange={(e) => handleFilterChange("maxMileage", e.target.value)}
                className="border-slate-200 rounded-xl h-10"
              />
            </div>
          </div>
        </FilterSection>

        {/* Fuel Type */}
        <FilterSection 
          title="Fuel type" 
          icon={Fuel} 
          isOpen={openSections.includes("fuel")} 
          onToggle={() => toggleSection("fuel")}
        >
          <div className="grid grid-cols-1 gap-2">
            {FUEL_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => handleFilterChange("fuelType", currentFilters.fuelType === type.key ? null : type.key)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all border",
                  currentFilters.fuelType === type.key 
                    ? "bg-[#4B0082]/10 border-[#4B0082] text-[#4B0082]" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                )}
              >
                <span>{type.label}</span>
                <span className="text-slate-400 font-medium text-xs">{type.count}</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection 
          title="Price" 
          icon={DollarSign} 
          isOpen={openSections.includes("price")} 
          onToggle={() => toggleSection("price")}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input 
              type="number"
              placeholder="Min Price"
              value={currentFilters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="border-slate-200 rounded-xl h-10 text-sm"
            />
            <Input 
              type="number"
              placeholder="Max Price"
              value={currentFilters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="border-slate-200 rounded-xl h-10 text-sm"
            />
          </div>
        </FilterSection>

        {/* Transmission */}
        <FilterSection 
          title="Transmission" 
          icon={Settings2} 
          isOpen={openSections.includes("trans")} 
          onToggle={() => toggleSection("trans")}
        >
          <div className="flex flex-wrap gap-2">
            {TRANSMISSIONS.map((type) => (
              <button
                key={type.key}
                onClick={() => handleFilterChange("transmission", currentFilters.transmission === type.key ? null : type.key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                  currentFilters.transmission === type.key 
                    ? "bg-[#4B0082] border-[#4B0082] text-white" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Drivetrain */}
        <FilterSection 
          title="Drivetrain" 
          icon={Lock} 
          isOpen={openSections.includes("drive")} 
          onToggle={() => toggleSection("drive")}
        >
          <div className="grid grid-cols-3 gap-2">
            {DRIVETRAINS.map((type) => (
              <button
                key={type.key}
                onClick={() => handleFilterChange("drivetrain", currentFilters.drivetrain === type.key ? null : type.key)}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold border-2 transition-all",
                  currentFilters.drivetrain === type.key 
                    ? "bg-[#4B0082]/10 border-[#4B0082] text-[#4B0082]" 
                    : "bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-200"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Seats */}
        <FilterSection 
          title="Seats" 
          icon={Armchair} 
          isOpen={openSections.includes("seats")} 
          onToggle={() => toggleSection("seats")}
        >
          <div className="grid grid-cols-4 gap-2">
            {["2", "4", "5", "7+"].map((num) => (
              <button
                key={num}
                onClick={() => handleFilterChange("seats", currentFilters.seats === num ? null : num)}
                className={cn(
                  "py-2 rounded-lg text-xs font-bold border transition-all text-center",
                  currentFilters.seats === num 
                    ? "bg-[#4B0082] border-[#4B0082] text-white" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                )}
              >
                {num}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Colour */}
        <FilterSection 
          title="Colour" 
          icon={Palette} 
          isOpen={openSections.includes("colour")} 
          onToggle={() => toggleSection("colour")}
        >
          <div className="flex flex-wrap gap-3">
            {COLOURS.map((c) => (
              <button
                key={c.key}
                title={c.label}
                onClick={() => handleFilterChange("colour", currentFilters.colour === c.key ? null : c.key)}
                className={cn(
                  "size-8 rounded-full border-2 transition-all flex items-center justify-center",
                  currentFilters.colour === c.key ? "border-[#4B0082] ring-2 ring-[#4B0082]/20" : "border-slate-100"
                )}
                style={{ backgroundColor: c.hex }}
              >
                {currentFilters.colour === c.key && (
                  <Check className={cn("size-4", c.key === "white" ? "text-slate-900" : "text-white")} />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* More Options Section (ANCAP, CO2, Tow) */}
        <div className="p-4 bg-slate-50/50 space-y-4">
           {/* Available Toggle */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-600">
                  <Eye className="size-4" />
                </div>
                <span className="font-bold text-slate-800 text-sm">Show available only</span>
              </div>
              <button 
                onClick={() => handleFilterChange("available", currentFilters.available === "true" ? null : "true")}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors focus:outline-none ring-2 ring-transparent ring-offset-2",
                  currentFilters.available === "true" ? "bg-[#4B0082]" : "bg-slate-200"
                )}
              >
                <div className={cn(
                   "absolute top-1 left-1 size-4 rounded-full bg-white transition-transform",
                   currentFilters.available === "true" ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
