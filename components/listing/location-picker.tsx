"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  DHAKA_AREAS,
  DHAKA_BOUNDS,
  DHAKA_CENTER,
  findAreaByQuery,
  findNearestArea,
  type DhakaArea,
} from "@/lib/dhaka-areas";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DHAKA_ZOOM = 12;

const MapComponent = dynamic(
  () => import("./location-map").then((m) => m.LocationMap),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse rounded-[2rem] bg-slate-100 w-full h-[420px]" />
  }
);

type LocationPickerProps = {
  defaultLocation?: string | null;
  defaultLat?: number | null;
  defaultLng?: number | null;
  namePrefix?: string; // for form field names, e.g. "" gives "location", "latitude", "longitude"
  className?: string;
  mapHeight?: string;
};

export function LocationPicker({
  defaultLocation = null,
  defaultLat = null,
  defaultLng = null,
  namePrefix = "",
  className,
  mapHeight = "280px",
}: LocationPickerProps) {
  const [location, setLocation] = useState(defaultLocation ?? "");
  const [lat, setLat] = useState<number | null>(defaultLat);
  const [lng, setLng] = useState<number | null>(defaultLng);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = findAreaByQuery(query || location).slice(0, 8);

  const handleSelectArea = useCallback((area: DhakaArea) => {
    setLocation(area.label);
    setLat(area.lat);
    setLng(area.lng);
    setQuery("");
    setOpen(false);
  }, []);

  const handleMapClick = useCallback((newLat: number, newLng: number) => {
    const nearest = findNearestArea(newLat, newLng);
    setLocation(nearest.label);
    setLat(newLat);
    setLng(newLng);
    setOpen(false);
  }, []);

  const handleClear = useCallback(() => {
    setLocation("");
    setLat(null);
    setLng(null);
    setQuery("");
    setOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-4", className)} ref={containerRef}>
      <div className="relative z-20">
        <div className="relative">
          <Input
            id="location-input"
            type="text"
            placeholder="Search neighborhood (e.g. Gulshan, Banani)"
            value={open ? (query || location) : location}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              setOpen(true);
              if (!v) setLocation("");
            }}
            onFocus={() => setOpen(true)}
            className={cn(
              "h-13 rounded-2xl border-slate-200 bg-white px-5 text-base font-medium transition-all shadow-sm",
              "focus:border-[#3D0066] focus:ring-4 focus:ring-purple-500/5 focus:shadow-[0_0_0_1px_#3D0066]",
              "placeholder:text-slate-300"
            )}
            autoComplete="off"
          />
          {location && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-6 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors"
              aria-label="Clear location"
            >
              ×
            </button>
          )}
          {open && suggestions.length > 0 && (
            <ul
              className="absolute z-[1001] mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
              role="listbox"
            >
              {suggestions.map((area: DhakaArea) => (
                <li
                  key={area.label}
                  role="option"
                  tabIndex={0}
                  className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#3D0066] rounded-xl transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectArea(area);
                  }}
                >
                  {area.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="relative z-0 rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-2xl shadow-slate-200/50 bg-slate-50">
        <MapComponent
          lat={lat}
          lng={lng}
          onMapClick={handleMapClick}
          height={mapHeight}
        />
      </div>

      <input type="hidden" name={namePrefix ? `${namePrefix}location` : "location"} value={location} readOnly />
      <input
        type="hidden"
        name={namePrefix ? `${namePrefix}latitude` : "latitude"}
        value={lat ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name={namePrefix ? `${namePrefix}longitude` : "longitude"}
        value={lng ?? ""}
        readOnly
      />
    </div>
  );
}
