"use client";

import { useEffect, useRef, useState } from "react";
import { DHAKA_BOUNDS, DHAKA_CENTER } from "@/lib/dhaka-areas";

const DHAKA_ZOOM = 12;

import "leaflet/dist/leaflet.css";


type LocationMapProps = {
  lat: number | null;
  lng: number | null;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerMove?: (lat: number, lng: number) => void;
  height: string;
  /** When false, map is read-only (e.g. on listing detail page). Default true. */
  interactive?: boolean;
};

export function LocationMap({
  lat,
  lng,
  onMapClick,
  height,
  interactive = true,
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mounted, setMounted] = useState(false);
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  const centerLat = lat ?? DHAKA_CENTER.lat;
  const centerLng = lng ?? DHAKA_CENTER.lng;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const el = containerRef.current;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function initMap() {
      if (cancelled || !el || !el.isConnected) return;

      import("leaflet").then((L) => {
        if (cancelled || !el.isConnected || mapRef.current) return;

        const DefaultIcon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        const map = L.map(el, {
          center: [DHAKA_CENTER.lat, DHAKA_CENTER.lng],
          zoom: DHAKA_ZOOM,
          maxBounds: [
            [DHAKA_BOUNDS.south, DHAKA_BOUNDS.west],
            [DHAKA_BOUNDS.north, DHAKA_BOUNDS.east],
          ],
          maxBoundsViscosity: 0.8,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const marker = L.marker([centerLat, centerLng]).addTo(map);

        if (interactive && onMapClick) {
          map.on("click", (e: L.LeafletMouseEvent) => {
            const { lat: l, lng: ln } = e.latlng;
            onMapClickRef.current?.(l, ln);
          });
        }

        mapRef.current = map;
        markerRef.current = marker;

        requestAnimationFrame(() => {
          map.invalidateSize();
          setTimeout(() => map.invalidateSize(), 100);
        });
      });
    }

    const raf = requestAnimationFrame(() => {
      initMap();
      if (!mapRef.current) timeoutId = setTimeout(initMap, 150);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mounted, interactive]);

  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return;
    markerRef.current.setLatLng([centerLat, centerLng]);
    if (lat != null && lng != null) {
      mapRef.current.setView([centerLat, centerLng], mapRef.current.getZoom());
    }
  }, [lat, lng, centerLat, centerLng]);

  if (!mounted) {
    return <div className="animate-pulse rounded-lg bg-muted" style={{ height }} />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full bg-muted"
      style={{ height, minHeight: height }}
    />
  );
}
