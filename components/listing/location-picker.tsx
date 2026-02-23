"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    lat: number | null;
    lng: number | null;
    onMapClick: (lat: number, lng: number) => void;
    onMarkerMove?: (lat: number, lng: number) => void;
    height: string;
  }> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = findAreaByQuery(query || location).slice(0, 8);

  useEffect(() => {
    setMapComponent(() => {
      return function MapLoader(props: {
        lat: number | null;
        lng: number | null;
        onMapClick: (lat: number, lng: number) => void;
        onMarkerMove?: (lat: number, lng: number) => void;
        height: string;
      }) {
        const [MapInner, setMapInner] = useState<React.ComponentType<typeof props> | null>(null);
        useEffect(() => {
          import("./location-map").then((m) => setMapInner(() => m.LocationMap));
        }, []);
        if (!MapInner) return <div className="animate-pulse rounded-lg bg-muted" style={{ height: props.height }} />;
        return <MapInner {...props} />;
      };
    });
  }, []);

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

  const latNum = lat ?? DHAKA_CENTER.lat;
  const lngNum = lng ?? DHAKA_CENTER.lng;

  return (
    <div className={cn("space-y-3", className)} ref={containerRef}>
      <div className="relative z-20">
        <label htmlFor="location-input" className="text-sm font-medium">
          Location (Dhaka)
        </label>
        <div className="mt-1 flex gap-2">
          <div className="relative flex-1">
            <Input
              id="location-input"
              type="text"
              placeholder="Search area (e.g. Gulshan, Dhanmondi)"
              value={open ? (query || location) : location}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                setOpen(true);
                if (!v) setLocation("");
              }}
              onFocus={() => setOpen(true)}
              className="pr-8"
              autoComplete="off"
            />
            {location && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear location"
              >
                ×
              </button>
            )}
            {open && suggestions.length > 0 && (
              <ul
                className="absolute z-[1001] mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover py-1 shadow-md"
                role="listbox"
              >
                {suggestions.map((area) => (
                  <li
                    key={area.label}
                    role="option"
                    tabIndex={0}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-accent"
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
        <p className="mt-1 text-xs text-muted-foreground">
          Type to search or click on the map to set location (Dhaka only).
        </p>
      </div>

      {MapComponent && (
        <div className="relative z-0 rounded-lg overflow-hidden border">
          <MapComponent
            lat={lat}
            lng={lng}
            onMapClick={handleMapClick}
            height={mapHeight}
          />
        </div>
      )}

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
