"use client";

import { LocationMap } from "./location-map";

type ListingLocationDisplayProps = {
  location: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function ListingLocationDisplay({
  location,
  latitude,
  longitude,
}: ListingLocationDisplayProps) {
  if (!location && latitude == null && longitude == null) return null;

  return (
    <div className="space-y-2">
      {location && (
        <p className="text-sm font-medium">
          Location: <span className="text-muted-foreground">{location}</span>
        </p>
      )}
      {(latitude != null && longitude != null) && (
        <div className="rounded-lg overflow-hidden border">
          <LocationMap
            lat={latitude}
            lng={longitude}
            height="200px"
            interactive={false}
          />
        </div>
      )}
    </div>
  );
}
