import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RotateCcw } from 'lucide-react';

// Ward 112 Center Coordinates (Indiranagar, Bangalore)
const WARD_112_CENTER = [12.9740, 77.6420];

export default function CivicInteractiveMap({
  reports = [],
  nearbyIssues = [],
  onSelectReport,
  className = 'h-[400px]',
  showControls = true,
  selectedCategory = 'All',
  selectedStatus = 'All'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const [filterCat, setFilterCat] = useState(selectedCategory);
  const [filterStat, setFilterStat] = useState(selectedStatus);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: WARD_112_CENTER,
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Standard OSM Tile Layer with Clean Light Styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Compact attribution control
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      // Zoom Control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
      setMapReady(true);
    } catch (err) {
      console.error('Failed to initialize Leaflet map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers whenever data or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Consolidate both citizen reports and community nearby items with valid lat/lng
    const allPoints = [];

    // Citizen Reports
    reports.forEach((r) => {
      if (r.lat && r.lng) {
        allPoints.push({
          ...r,
          isUserReport: true,
          pointType: 'citizen'
        });
      }
    });

    // Nearby community issues
    nearbyIssues.forEach((nb) => {
      if (nb.lat && nb.lng) {
        allPoints.push({
          ...nb,
          isUserReport: false,
          pointType: 'nearby'
        });
      }
    });

    // Apply filters
    const filteredPoints = allPoints.filter((pt) => {
      const matchesCategory = filterCat === 'All' || pt.category?.includes(filterCat);
      const matchesStatus = filterStat === 'All' || pt.status === filterStat;
      return matchesCategory && matchesStatus;
    });

    filteredPoints.forEach((item) => {
      // Determine Pin Color & Styling
      let colorClass = '#ff5722'; // Coral for In Progress / Road
      if (item.status === 'Resolved') colorClass = '#10b981'; // Green
      else if (item.status === 'Awaiting Review') colorClass = '#f59e0b'; // Amber

      const isCitizen = item.isUserReport;
      const ringColor = isCitizen ? 'ring-2 ring-[#ea580c]' : 'ring-1 ring-black/10';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${colorClass}; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.22); border: 2px solid #ffffff;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            ${isCitizen ? `<div style="position: absolute; -top: 2px; -right: 2px; width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; border: 1.5px solid white;"></div>` : ''}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });

      // Build Interactive Popup HTML
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 font-sans text-xs';
      popupHtml.innerHTML = `
        <div style="font-family: inherit; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-family: monospace; font-size: 10px; font-weight: 700; color: #4b5563; background: #f3f4f6; padding: 1px 5px; border-radius: 4px;">
              ${item.id}
            </span>
            <span style="font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 9999px; background: ${item.status === 'Resolved' ? '#dcfce7' : item.status === 'In Progress' ? '#ffedd5' : '#fef3c7'}; color: ${item.status === 'Resolved' ? '#15803d' : item.status === 'In Progress' ? '#c2410c' : '#b45309'};">
              ${item.status}
            </span>
          </div>
          <h4 style="font-size: 12px; font-weight: 700; color: #111827; margin: 0 0 3px 0; line-height: 1.25;">
            ${item.title}
          </h4>
          <p style="font-size: 11px; color: #6b7280; margin: 0 0 6px 0;">
            📍 ${item.location}
          </p>
          <div style="display: flex; items-center; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 6px; margin-top: 4px;">
            <span style="font-size: 10px; color: #9ca3af;">${item.category}</span>
            <button id="popup-btn-${item.id}" style="background: #ea580c; color: #ffffff; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer;">
              Inspect
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectReport) onSelectReport(item);
          };
        }
      });

      marker.addTo(markersLayerRef.current);
    });

    // Auto-fit bounds if we have points
    if (filteredPoints.length > 0) {
      try {
        const group = L.featureGroup(markersLayerRef.current.getLayers());
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15), { maxZoom: 15 });
      } catch (e) {
        // Fallback to center if fitBounds fails
        mapInstanceRef.current.setView(WARD_112_CENTER, 14);
      }
    }
  }, [reports, nearbyIssues, filterCat, filterStat, mapReady, onSelectReport]);

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(WARD_112_CENTER, 14, { animate: true });
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-[#e5e7eb] bg-[#f8fafc] flex flex-col ${className}`}>
      
      {/* Top Map Toolbar */}
      {showControls && (
        <div className="absolute top-2.5 left-2.5 right-12 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#e5e7eb] shadow-xs pointer-events-auto text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[#111827]">Ward 112 Spatial Radar</span>
            <span className="text-[10px] text-[#6b7280] font-mono pl-1 border-l border-[#e5e7eb]">
              Bangalore East
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg border border-[#e5e7eb] shadow-xs pointer-events-auto">
            <span className="text-[10px] text-[#6b7280] font-medium pl-1">Status:</span>
            {['All', 'In Progress', 'Awaiting Review', 'Resolved'].map((stat) => (
              <button
                key={stat}
                onClick={() => setFilterStat(stat)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  filterStat === stat 
                    ? 'bg-[#111827] text-white shadow-2xs' 
                    : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recenter Quick Action */}
      <div className="absolute bottom-6 left-3 z-[1000]">
        <button
          type="button"
          onClick={recenterMap}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-neutral-50 text-[#111827] border border-[#e5e7eb] rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          title="Recenter Map on Ward 112"
        >
          <RotateCcw className="w-3 h-3 text-[#6b7280]" />
          <span>Center Ward 112</span>
        </button>
      </div>

      {/* Map Canvas DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Honest Demo State Badge in bottom-left above attribution */}
      <div className="absolute bottom-1 right-24 z-[1000] pointer-events-none">
        <span className="text-[9px] font-mono text-[#9ca3af] bg-white/80 px-1.5 py-0.5 rounded">
          OpenStreetMap • Live Coordinates
        </span>
      </div>

    </div>
  );
}
