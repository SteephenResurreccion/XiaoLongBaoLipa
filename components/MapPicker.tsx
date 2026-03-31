"use client";

import { useEffect, useRef, useState } from "react";

interface MapPickerProps {
  onSelect: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
}

const LIPA_LAT = 13.9411;
const LIPA_LNG = 121.1631;

export default function MapPicker({ onSelect, initialAddress }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [address, setAddress] = useState(initialAddress ?? "");
  const [geocoding, setGeocoding] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Fix default marker icons (broken in bundlers)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([LIPA_LAT, LIPA_LNG], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([LIPA_LAT, LIPA_LNG], { draggable: true }).addTo(map);

      async function reverseGeocode(lat: number, lng: number) {
        setGeocoding(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setAddress(addr);
          onSelect(addr, lat, lng);
        } catch {
          const addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setAddress(addr);
          onSelect(addr, lat, lng);
        } finally {
          setGeocoding(false);
        }
      }

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        reverseGeocode(pos.lat, pos.lng);
      });

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 280 }}>
        {!ready && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <p className="text-gray-400 text-sm">Loading map...</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">
          {geocoding ? "Getting address..." : "Selected Address"}
        </p>
        <p className="text-gray-700 leading-snug">
          {address || "Tap or drag the pin to select your delivery location"}
        </p>
      </div>

      <p className="text-xs text-gray-400">
        Tap anywhere on the map or drag the pin to set your location.
      </p>
    </div>
  );
}
