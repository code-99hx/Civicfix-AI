import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  ExternalLink, 
  Compass, 
  Flame, 
  Navigation
} from 'lucide-react';

// Ward 112 Center Coordinates (Indiranagar, Bangalore)
const MAP_CENTER = [12.9740, 77.6420];

// Illustrative GIS Demo Records
const DEMO_INCIDENTS = [
  {
    id: 'CF-4115',
    title: 'Severe Asphalt Pothole • 18" Depth',
    category: 'Road Infrastructure',
    priority: 'Urgent',
    status: 'In Progress',
    squad: 'Squad Alpha (Roadworks)',
    location: '100ft Road, near 12th Main Junction',
    coords: [12.9742, 77.6415],
    slaTime: '3h remaining',
    photo: '/images/feature_01.jpg',
    color: '#ff6243'
  },
  {
    id: 'CF-4112',
    title: 'High-Mast Streetlight Outage',
    category: 'Civic Lighting',
    priority: 'Medium',
    status: 'Assigned',
    squad: 'Squad Gamma (Electrical)',
    location: '5th Cross, CMH Road Sector 2',
    coords: [12.9785, 77.6450],
    slaTime: '14h remaining',
    photo: '/images/feature_03.jpg',
    color: '#fca311'
  },
  {
    id: 'CF-4109',
    title: 'Overflowing Commercial Waste Bin',
    category: 'Sanitation',
    priority: 'Medium',
    status: 'Dispatched',
    squad: 'Squad Beta (Sanitation)',
    location: 'Indiranagar Club Road',
    coords: [12.9705, 77.6390],
    slaTime: '8h remaining',
    photo: '/images/feature_02.jpg',
    color: '#10b981'
  },
  {
    id: 'CF-4104',
    title: 'Sub-surface Water Main Joint Leak',
    category: 'Water & Utilities',
    priority: 'Urgent',
    status: 'In Transit',
    squad: 'Squad Delta (Water Supply)',
    location: '80ft Road, 4th Block Corner',
    coords: [12.9680, 77.6475],
    slaTime: '1h 30m remaining',
    photo: '/images/feature_04.jpg',
    color: '#3b82f6'
  },
  {
    id: 'CF-4098',
    title: 'Broken Stormwater Drain Slab',
    category: 'Drainage',
    priority: 'High',
    status: 'Resolved',
    squad: 'Squad Epsilon (Civil Works)',
    location: '6th Main, Defense Colony',
    coords: [12.9760, 77.6360],
    slaTime: 'Resolved',
    photo: '/images/meet_product.jpg',
    color: '#8b5cf6'
  }
];

// Density Hotspot Clusters for Spatial Demonstration
const CLUSTERS = [
  { center: [12.9742, 77.6415], radius: 240, label: '100ft Road Corridor (4 Issues)' },
  { center: [12.9690, 77.6440], radius: 180, label: 'CMH Road South Cluster (3 Issues)' }
];

export default function InteractiveMapShowcase() {
  const [selectedIncident, setSelectedIncident] = useState(DEMO_INCIDENTS[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [showDensityOverlay, setShowDensityOverlay] = useState(true);
  const [basemapStyle, setBasemapStyle] = useState('light'); // Default to light basemap for white theme
  const [mapError, setMapError] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const clusterLayerGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Filtered incidents
  const filteredIncidents = DEMO_INCIDENTS.filter((item) => {
    if (activeCategoryFilter === 'All') return true;
    return item.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: 15,
        minZoom: 13,
        maxZoom: 18,
        scrollWheelZoom: false, // Prevent scroll hijacking while browsing landing page
        zoomControl: false,
        attributionControl: false
      });

      // Add zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Carto Basemap Tiles (light by default)
      const tileUrl = basemapStyle === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(tileUrl, {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tiles;

      // Layer groups for markers & clusters
      const clusterGroup = L.layerGroup().addTo(map);
      const markerGroup = L.layerGroup().addTo(map);

      clusterLayerGroupRef.current = clusterGroup;
      markersLayerGroupRef.current = markerGroup;
      mapInstanceRef.current = map;

      // Invalidate size after layout mounts
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.error('Leaflet map initialization error:', err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Tiles on Style Toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = basemapStyle === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTiles = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [basemapStyle]);

  // Render Markers and Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    markersLayerGroupRef.current.clearLayers();
    if (clusterLayerGroupRef.current) {
      clusterLayerGroupRef.current.clearLayers();
    }

    // Render Density Clusters if enabled
    if (showDensityOverlay && clusterLayerGroupRef.current) {
      CLUSTERS.forEach((cluster) => {
        L.circle(cluster.center, {
          radius: cluster.radius,
          color: '#ea580c',
          weight: 1.5,
          opacity: 0.7,
          fillColor: '#ea580c',
          fillOpacity: 0.1,
          dashArray: '5, 5'
        }).addTo(clusterLayerGroupRef.current);
      });
    }

    // Render Filtered Incident Markers
    filteredIncidents.forEach((item) => {
      const isSelected = selectedIncident?.id === item.id;

      const markerHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${isSelected ? `
            <span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: ${item.color}33; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; border: 2px solid ${item.color}; background: ${item.color}22;"></span>
          ` : ''}
          <div style="
            width: ${isSelected ? '28px' : '22px'}; 
            height: ${isSelected ? '28px' : '22px'}; 
            border-radius: 9999px; 
            background: ${item.color}; 
            border: 2px solid #ffffff; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.25); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            transition: all 0.2s ease;
          ">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: #ffffff;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-civic-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(item.coords, { icon: customIcon });
      marker.on('click', () => {
        setSelectedIncident(item);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(item.coords, { animate: true, duration: 0.5 });
        }
      });

      marker.addTo(markersLayerGroupRef.current);
    });
  }, [filteredIncidents, selectedIncident, showDensityOverlay]);

  return (
    <section 
      id="map-showcase" 
      aria-label="CivicFix AI Geographic Issue Monitoring"
      className="bg-white text-neutral-900 py-20 sm:py-28 lg:py-32 border-b border-neutral-200/80 relative overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-widest shadow-xs">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Geospatial Incident Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-neutral-900 leading-[1.12]">
            Real-Time Ward Infrastructure Mapping
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl">
            Explore how citizens and municipal dispatchers monitor issue concentration, identify cluster hotspots, and coordinate rapid response teams across city wards.
          </p>
        </div>

        {/* Unified White GIS Console Frame */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
          
          {/* Top Console Navigation Bar */}
          <div className="bg-neutral-50/90 px-4 sm:px-6 py-3.5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left: GIS Node Status & Ward Label */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono font-medium text-neutral-800 pl-2 border-l border-neutral-200 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#ea580c]" />
                Ward 112 Spatial Radar • Indiranagar Node
              </span>
            </div>

            {/* Right: Basemap Selector & Cluster Overlay Toggle */}
            <div className="flex items-center gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setShowDensityOverlay(!showDensityOverlay)}
                className={`px-3 py-1.5 rounded-md border font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  showDensityOverlay 
                    ? 'bg-orange-50 text-[#ea580c] border-orange-300' 
                    : 'bg-white text-neutral-600 border-neutral-200 hover:text-neutral-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Hotspot Clusters</span>
              </button>

              <button
                type="button"
                onClick={() => setBasemapStyle(basemapStyle === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1.5 rounded-md bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Toggle Dark/Light Basemap"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{basemapStyle === 'dark' ? 'Light Map' : 'Dark Map'}</span>
              </button>

              <Link
                to="/authority/map"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#ff6243] hover:bg-[#ea580c] text-white font-semibold shadow-xs transition-colors"
              >
                <span>Full GIS Console</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>

          {/* Interactive Map & Contextual Inspector Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[560px] relative">
            
            {/* Left 8-Cols: Interactive Leaflet Map Canvas */}
            <div className="lg:col-span-8 relative min-h-[360px] lg:min-h-full bg-neutral-100 overflow-hidden flex flex-col">
              
              {/* Category Filter Pills (Floating Overlay on Map) */}
              <div className="absolute top-4 left-4 z-[400] flex flex-wrap gap-1.5 max-w-[calc(100%-2rem)]">
                {['All', 'Road', 'Lighting', 'Sanitation', 'Water'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-sm transition-all cursor-pointer ${
                      activeCategoryFilter === cat
                        ? 'bg-[#ff6243] text-white border-[#ff6243] shadow-orange-500/25'
                        : 'bg-white/90 hover:bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {cat === 'All' ? 'All Incidents' : cat}
                  </button>
                ))}
              </div>

              {/* Real Leaflet Map Container */}
              {!mapError ? (
                <div 
                  ref={mapContainerRef} 
                  className="w-full h-full min-h-[360px] lg:min-h-[560px] z-10"
                />
              ) : (
                /* Graceful Fallback if Tile Server Offline */
                <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center bg-neutral-50">
                  <MapPin className="w-12 h-12 text-[#ea580c] mb-3 opacity-80" />
                  <div className="text-sm font-bold text-neutral-900">Spatial Map Service Preview</div>
                  <div className="text-xs text-neutral-500 mt-1 max-w-sm">Ward 112 Indiranagar GIS radar active. Open full console for high-resolution vector layers.</div>
                  <Link to="/authority/map" className="mt-4 px-4 py-2 rounded bg-[#ff6243] text-white text-xs font-semibold">
                    Launch GIS Console
                  </Link>
                </div>
              )}

              {/* Map Floating Legend (Bottom Left) */}
              <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-lg px-3 py-2 text-[10px] text-neutral-700 space-y-1 shadow-md">
                <div className="font-semibold text-neutral-900 text-[9px] uppercase tracking-wider mb-1">Severity Legend</div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff6243]" /> Urgent</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#fca311]" /> Medium</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Normal</span>
                </div>
              </div>

              {/* OpenStreetMap / CARTO Attribution */}
              <div className="absolute bottom-1 right-2 z-[400] text-[9px] text-neutral-500 pointer-events-none font-mono">
                &copy; OpenStreetMap &copy; CARTO
              </div>

            </div>

            {/* Right 4-Cols: Contextual Incident Inspector Drawer */}
            <div className="lg:col-span-4 bg-white border-t lg:border-t-0 lg:border-l border-neutral-200 p-5 sm:p-6 flex flex-col justify-between space-y-5">
              
              {/* Selected Incident Telemetry */}
              <div className="space-y-4">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                    Incident Inspector
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 border border-neutral-200 text-neutral-800">
                    {selectedIncident?.id}
                  </span>
                </div>

                {/* Selected Issue Card */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 space-y-3.5 shadow-xs">
                  
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-200">
                    <img 
                      src={selectedIncident?.photo} 
                      alt={selectedIncident?.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white border border-white/20">
                      {selectedIncident?.category}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#ff6243] text-[10px] font-bold text-white shadow-xs">
                      {selectedIncident?.priority}
                    </div>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 tracking-tight">
                      {selectedIncident?.title}
                    </h4>
                    <p className="text-xs text-neutral-600 flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3 text-[#ea580c] flex-shrink-0" />
                      <span>{selectedIncident?.location}</span>
                    </p>
                  </div>

                  {/* Assigned Squad & SLA */}
                  <div className="pt-3 border-t border-neutral-200 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] text-neutral-500 font-medium">Assigned Squad</span>
                      <span className="font-semibold text-neutral-900 truncate block pt-0.5">{selectedIncident?.squad}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-neutral-500 font-medium">SLA Countdown</span>
                      <span className="font-mono text-amber-600 font-semibold block pt-0.5">{selectedIncident?.slaTime}</span>
                    </div>
                  </div>

                </div>

                {/* Ward 112 Spatial Telemetry Summary */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-600 font-medium">
                    <span>Ward Spatial Coverage:</span>
                    <span className="font-mono text-emerald-600 font-bold">98.4%</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 font-medium">
                    <span>Active Geotagged Issues:</span>
                    <span className="font-mono text-neutral-900 font-bold">18 Reports</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 font-medium">
                    <span>Active Hotspot Clusters:</span>
                    <span className="font-mono text-[#ea580c] font-bold">3 Identified</span>
                  </div>
                </div>

              </div>

              {/* Bottom Actions & Demo Disclaimer */}
              <div className="space-y-3 pt-2">
                <Link
                  to="/authority/map"
                  className="w-full py-2.5 px-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Investigate in Authority GIS Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <p className="text-[10px] text-neutral-500 text-center leading-normal">
                  <span className="text-amber-600 font-semibold">Demo Note:</span> Illustrative Ward 112 records used for technical demonstration. Real incident coordinates are verified with citizen GPS metadata.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
