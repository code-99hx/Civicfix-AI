/**
 * CivicFix AI - Compact location map preview.
 *
 * Leaflet + OpenStreetMap are already project dependencies. This is an optional
 * visual aid: coordinates are only recorded when the user pins a location on
 * the map or grants geolocation. No coordinates are ever fabricated.
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Ward 112 (Indiranagar, Bangalore) — demo reference center only.
const DEFAULT_CENTER = [12.974, 77.642];

export default function LocationMapPreview({ value, onChange, className }) {
  const { lat, lng } = value || {};
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    try {
      const map = L.map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: 15,
        zoomControl: true,
        attributionControl: true,
        touchZoom: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      if (lat && lng) {
        map.setView([lat, lng], 16);
        updateMarker(map, [lat, lng]);
      }

      map.on('click', (e) => {
        const [clickedLat, clickedLng] = e.latlng.wrap ? [e.latlng.lat, e.latlng.lng] : e.latlng;
        updateMarker(map, [clickedLat, clickedLng]);
        onChange(clickedLat, clickedLng, 'map');
      });

      mapInstanceRef.current = map;
      setReady(true);
      map.invalidateSize();

      return () => {
        try {
          map.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
        setReady(false);
      };
    } catch (err) {
      setError('Map could not be loaded. You can still enter the address manually.');
      console.error('Failed to initialize location map:', err);
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !ready) return;
    if (lat && lng) {
      map.setView([lat, lng], 16, { animate: true, duration: 0.4 });
      updateMarker(map, [lat, lng]);
    }
    map.invalidateSize();
  }, [lat, lng, ready]);

  function updateMarker(map, position) {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    } else {
      markerRef.current = L.marker(position, { alt: 'Location pin' }).addTo(map);
    }
  }

  if (error) {
    return (
      <div className={`rounded-md border border-slate-300 bg-slate-50 p-4 text-xs text-slate-600 flex items-center gap-2 ${className || ''}`}>
        <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const hasCoords = Boolean(lat && lng);
  return (
    <div className={`relative rounded-md border border-slate-300 overflow-hidden ${className || ''}`}>
      <div ref={mapRef} className="h-48 lg:h-56 w-full" />
      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm">
        <MapPin className="w-3.5 h-3.5 text-orange-600" />
        <span className="text-xs font-semibold text-slate-800">
          {hasCoords ? 'Location pinned on map' : 'Click the map to pin a location'}
        </span>
      </div>
      <div className="absolute top-2 right-2 z-20 text-[10px] text-slate-500 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur border border-slate-200">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
