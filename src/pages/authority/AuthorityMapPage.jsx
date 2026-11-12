import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Search, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  X, 
  SlidersHorizontal,
  Crosshair,
  ExternalLink,
  Users
} from 'lucide-react';
import { 
  getSlaCondition, 
  WARD_112_BOUNDARY, 
  MUNICIPAL_SQUADS 
} from '../../services/authorityData';
import AuthorityAssignModal from '../../components/AuthorityAssignModal';

// Ward 112 Center Coordinates (Indiranagar, Bangalore)
const WARD_112_CENTER = [12.9740, 77.6420];

// Legitimate Tile Providers
const BASEMAP_TILES = {
  light: {
    name: 'Carto Positron (Light)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  },
  dark: {
    name: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  },
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19
  },
  satellite: {
    name: 'Esri Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, and GIS User Community',
    subdomains: 'abc',
    maxZoom: 18
  }
};

export default function AuthorityMapPage() {
  const { issues, openIssueDetail, updateIssue, showToast, selectedIssue: layoutSelectedIssue } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Root container ref for Fullscreen
  const fullContainerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const focusedIssueIdRef = useRef(null);
  
  // Layer Groups
  const markersLayerRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const densityLayerRef = useRef(null);

  // Map state
  const [mapReady, setMapReady] = useState(false);
  const [activeBasemap, setActiveBasemap] = useState('light'); // 'light' | 'dark' | 'osm' | 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(14);

  // Layer Toggles
  const [showMarkers, setShowMarkers] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showDensity, setShowDensity] = useState(false);
  const [showResolved, setShowResolved] = useState(true);

  // Side Panel Collapsing
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [listPanelOpen, setListPanelOpen] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [slaFilter, setSlaFilter] = useState('All');
  const [squadFilter, setSquadFilter] = useState('All');

  // Check URL query for specific issueId to focus on
  useEffect(() => {
    const targetId = searchParams.get('issueId');
    if (targetId && issues.length > 0) {
      if (focusedIssueIdRef.current !== targetId) {
        const match = issues.find(i => i.id === targetId);
        if (match) {
          focusedIssueIdRef.current = targetId;
          setSelectedIssue(match);
          if (window.innerWidth < 1024) {
            setListPanelOpen(false);
          }
          if (match.hasValidCoords && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([match.latitude, match.longitude], 16, { animate: true, duration: 1.2 });
          }
        }
      } else {
        const match = issues.find(i => i.id === targetId);
        if (match && selectedIssue && (
          match.status !== selectedIssue.status ||
          match.assignedTeam !== selectedIssue.assignedTeam ||
          match.severity !== selectedIssue.severity
        )) {
          setSelectedIssue(match);
        }
      }
    } else if (!targetId) {
      focusedIssueIdRef.current = null;
    }
  }, [searchParams, issues, selectedIssue]);

  // Select Issue from list or marker
  const handleSelectIssue = useCallback((issue) => {
    setSelectedIssue(issue);
    focusedIssueIdRef.current = issue.id;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('issueId', issue.id);
    setSearchParams(nextParams, { replace: true });

    if (window.innerWidth < 1024) {
      setListPanelOpen(false);
    }
    if (issue.hasValidCoords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([issue.latitude, issue.longitude], 16, { animate: true, duration: 1 });
    }
  }, [searchParams, setSearchParams]);

  // Cleanly close selected issue and remove query param
  const handleCloseSelectedIssue = useCallback(() => {
    setSelectedIssue(null);
    focusedIssueIdRef.current = null;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('issueId');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Filtered dataset
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          iss.id.toLowerCase().includes(q) ||
          iss.title.toLowerCase().includes(q) ||
          iss.locality.toLowerCase().includes(q) ||
          iss.assignedTeam.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Category
      if (categoryFilter !== 'All' && iss.category !== categoryFilter) return false;

      // Severity
      if (severityFilter !== 'All' && iss.severity !== severityFilter) return false;

      // Status
      if (statusFilter !== 'All' && iss.status !== statusFilter) return false;

      // SLA
      if (slaFilter !== 'All') {
        const cond = getSlaCondition(iss);
        if (cond !== slaFilter) return false;
      }

      // Squad
      if (squadFilter !== 'All' && iss.assignedTeam !== squadFilter) return false;

      // Resolved toggle
      if (!showResolved && iss.status === 'Resolved') return false;

      return true;
    });
  }, [issues, searchQuery, categoryFilter, severityFilter, statusFilter, slaFilter, squadFilter, showResolved]);

  // Separate valid coordinates from unmapped
  const validCoordIssues = useMemo(() => {
    return filteredIssues.filter(i => i.hasValidCoords && typeof i.latitude === 'number' && typeof i.longitude === 'number');
  }, [filteredIssues]);

  const unmappedIssues = useMemo(() => {
    return filteredIssues.filter(i => !i.hasValidCoords || typeof i.latitude !== 'number' || typeof i.longitude !== 'number');
  }, [filteredIssues]);

  // Operational summary counts
  const criticalVisibleCount = validCoordIssues.filter(i => i.severity === 'Critical').length;
  const unassignedVisibleCount = validCoordIssues.filter(i => i.assignedTeam === 'Unassigned' || !i.assignedTeam).length;
  const overdueVisibleCount = validCoordIssues.filter(i => getSlaCondition(i) === 'Overdue').length;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: WARD_112_CENTER,
        zoom: 14,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false
      });

      // Add Base Tile Layer
      const baseCfg = BASEMAP_TILES[activeBasemap] || BASEMAP_TILES.light;
      const baseLayer = L.tileLayer(baseCfg.url, {
        maxZoom: baseCfg.maxZoom,
        subdomains: baseCfg.subdomains,
        attribution: baseCfg.attribution
      }).addTo(map);
      baseTileLayerRef.current = baseLayer;

      // Add custom attribution bottom-right
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      // Create Layer Groups
      const boundaryGroup = L.layerGroup().addTo(map);
      const densityGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      boundaryLayerRef.current = boundaryGroup;
      densityLayerRef.current = densityGroup;
      markersLayerRef.current = markersGroup;

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    } catch (err) {
      console.error('Failed to initialize Leaflet Map in AuthorityMapPage:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;

    const baseCfg = BASEMAP_TILES[activeBasemap] || BASEMAP_TILES.light;
    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);

    const newBase = L.tileLayer(baseCfg.url, {
      maxZoom: baseCfg.maxZoom,
      subdomains: baseCfg.subdomains,
      attribution: baseCfg.attribution
    }).addTo(mapInstanceRef.current);

    baseTileLayerRef.current = newBase;
  }, [activeBasemap]);

  // Update Ward 112 Service Boundary Overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !boundaryLayerRef.current) return;

    boundaryLayerRef.current.clearLayers();

    if (showBoundary) {
      try {
        const geoLayer = L.geoJSON(WARD_112_BOUNDARY, {
          style: {
            color: '#ea580c',
            weight: 2,
            dashArray: '6, 6',
            fillColor: '#ea580c',
            fillOpacity: 0.05
          }
        });
        geoLayer.bindTooltip('Ward 112 (Indiranagar) Service Boundary', {
          sticky: true,
          className: 'text-xs font-semibold font-sans'
        });
        boundaryLayerRef.current.addLayer(geoLayer);
      } catch (err) {
        console.error('Error drawing boundary:', err);
      }
    }
  }, [showBoundary, mapReady]);

  // Update Density / Heatmap Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !densityLayerRef.current) return;

    densityLayerRef.current.clearLayers();

    if (showDensity && validCoordIssues.length > 0) {
      validCoordIssues.forEach((issue) => {
        const intensityWeight = 
          issue.severity === 'Critical' ? 0.35 :
          issue.severity === 'High' ? 0.25 : 0.15;

        const circle = L.circle([issue.latitude, issue.longitude], {
          radius: 140,
          color: '#ea580c',
          weight: 0,
          fillColor: issue.severity === 'Critical' ? '#dc2626' : '#ea580c',
          fillOpacity: intensityWeight
        });
        densityLayerRef.current.addLayer(circle);
      });
    }
  }, [showDensity, validCoordIssues, mapReady]);

  // Spatial Grid Clustering & Marker Rendering
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    if (!showMarkers) return;

    // Check if clustering is enabled and zoom is low (< 14)
    if (showClusters && currentZoom < 14 && validCoordIssues.length > 0) {
      // Spatial grid clustering algorithm
      const grid = {};
      const cellSize = 0.007; // Proximity threshold in degrees

      validCoordIssues.forEach((issue) => {
        const gridX = Math.floor(issue.latitude / cellSize);
        const gridY = Math.floor(issue.longitude / cellSize);
        const key = `${gridX}_${gridY}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(issue);
      });

      Object.values(grid).forEach((clusterIssues) => {
        if (clusterIssues.length === 1) {
          renderSingleMarker(clusterIssues[0]);
        } else {
          // Render cluster bubble
          const avgLat = clusterIssues.reduce((sum, i) => sum + i.latitude, 0) / clusterIssues.length;
          const avgLng = clusterIssues.reduce((sum, i) => sum + i.longitude, 0) / clusterIssues.length;
          const hasCritical = clusterIssues.some(i => i.severity === 'Critical');

          const clusterIcon = L.divIcon({
            className: 'custom-leaflet-cluster',
            html: `
              <div style="
                width: 38px; 
                height: 38px; 
                border-radius: 50%; 
                background: ${hasCritical ? '#dc2626' : '#ea580c'}; 
                color: white; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-family: monospace; 
                font-size: 13px; 
                font-weight: 800; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
                border: 2.5px solid white;
                cursor: pointer;
              ">
                ${clusterIssues.length}
              </div>
            `,
            iconSize: [38, 38],
            iconAnchor: [19, 19]
          });

          const clusterMarker = L.marker([avgLat, avgLng], { icon: clusterIcon });
          clusterMarker.on('click', () => {
            // Zoom into cluster bounds
            const bounds = L.latLngBounds(clusterIssues.map(i => [i.latitude, i.longitude]));
            mapInstanceRef.current.flyToBounds(bounds.pad(0.35), { maxZoom: 16, duration: 1 });
          });

          markersLayerRef.current.addLayer(clusterMarker);
        }
      });
    } else {
      // Zoom >= 14 or clustering disabled: Render individual markers
      validCoordIssues.forEach((issue) => {
        renderSingleMarker(issue);
      });
    }

    function renderSingleMarker(issue) {
      const isSelected = selectedIssue && selectedIssue.id === issue.id;
      const sla = getSlaCondition(issue);
      const isCritical = issue.severity === 'Critical';

      // Pin Color
      let pinColor = '#ea580c'; // High
      if (isCritical) pinColor = '#dc2626'; // Critical
      else if (issue.severity === 'Medium') pinColor = '#d97706'; // Medium Amber
      else if (issue.severity === 'Low') pinColor = '#2563eb'; // Low Blue

      if (issue.status === 'Resolved') pinColor = '#16a34a'; // Resolved Green

      const markerHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${isCritical ? `
            <div style="
              position: absolute; 
              width: 42px; 
              height: 42px; 
              border-radius: 50%; 
              background: rgba(220, 38, 38, 0.35); 
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}

          <div style="
            width: ${isSelected ? '36px' : '28px'}; 
            height: ${isSelected ? '36px' : '28px'}; 
            border-radius: 50%; 
            background: ${pinColor}; 
            color: white; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.25); 
            border: ${isSelected ? '3px solid #111827' : '2px solid #ffffff'};
            transition: all 0.2s ease;
          ">
            <svg width="${isSelected ? '18' : '14'}" height="${isSelected ? '18' : '14'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>

          ${sla === 'Overdue' ? `
            <div style="
              position: absolute; 
              top: -4px; 
              right: -4px; 
              width: 11px; 
              height: 11px; 
              border-radius: 50%; 
              background: #ef4444; 
              border: 2px solid white;
            "></div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([issue.latitude, issue.longitude], { icon: customIcon });

      // Popup Content
      const popupDiv = document.createElement('div');
      popupDiv.className = 'font-sans text-xs p-1 min-w-[210px]';
      popupDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
          <span style="font-family: monospace; font-size: 10px; font-weight: 800; color: #ea580c; background: #fff7ed; padding: 2px 6px; border-radius: 4px; border: 1px solid #ffedd5;">
            ${issue.id}
          </span>
          <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${issue.status === 'Resolved' ? '#dcfce7' : '#f3f4f6'}; color: ${issue.status === 'Resolved' ? '#15803d' : '#374151'};">
            ${issue.status}
          </span>
        </div>
        <h4 style="font-size: 12px; font-weight: 700; color: #111827; margin: 0 0 4px 0; line-height: 1.25;">
          ${issue.title}
        </h4>
        <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">
          📍 ${issue.locality}
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f0f2f5; padding-top: 6px; margin-top: 6px; font-size: 10px;">
          <span style="font-weight: 600; color: #4b5563;">${issue.assignedTeam}</span>
          <button id="map-popup-inspect-${issue.id}" style="background: #ea580c; color: white; border: none; padding: 3px 8px; border-radius: 4px; font-weight: 600; cursor: pointer;">
            Inspect
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        setSelectedIssue(issue);
        const btn = document.getElementById(`map-popup-inspect-${issue.id}`);
        if (btn) {
          btn.onclick = () => {
            openIssueDetail(issue);
          };
        }
      });

      marker.on('click', () => {
        handleSelectIssue(issue);
      });

      markersLayerRef.current.addLayer(marker);
    }

  }, [validCoordIssues, currentZoom, showClusters, showMarkers, selectedIssue, mapReady]);

  // Recenter & Fit bounds
  const handleFitBounds = useCallback(() => {
    if (!mapInstanceRef.current) return;
    if (validCoordIssues.length > 0) {
      try {
        const bounds = L.latLngBounds(validCoordIssues.map(i => [i.latitude, i.longitude]));
        mapInstanceRef.current.fitBounds(bounds.pad(0.18), { maxZoom: 16 });
      } catch (e) {
        mapInstanceRef.current.setView(WARD_112_CENTER, 14);
      }
    } else {
      mapInstanceRef.current.setView(WARD_112_CENTER, 14);
    }
  }, [validCoordIssues]);

  // Geolocation
  const handleUserLocation = () => {
    if (!navigator.geolocation) {
      if (showToast) showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mapInstanceRef.current) {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          mapInstanceRef.current.flyTo([lat, lng], 15, { animate: true });
          if (showToast) showToast('Centered on current device coordinates');
        }
      },
      (err) => {
        if (showToast) showToast('Location permission denied or unavailable', 'error');
      }
    );
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!fullContainerRef.current) return;

    if (!document.fullscreenElement) {
      fullContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Severity styles
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div 
      ref={fullContainerRef} 
      className="relative w-full h-full flex flex-col overflow-hidden bg-[#f1f3f5] select-none"
    >
      
      {/* ========================================================
          TOP FLOATING OPERATIONAL CONTROL TOOLBAR
          ======================================================== */}
      <div className="absolute top-3 left-3 right-3 z-[var(--z-map-toolbars)] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Dynamic Operational Telemetry Pill */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e5e7eb] shadow-md pointer-events-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold text-[#111827]">Ward 112 GIS Radar</span>
          </div>
          <span className="text-[#d1d5db]">|</span>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-[#4b5563]">Visible: <strong>{validCoordIssues.length}</strong></span>
            {criticalVisibleCount > 0 && (
              <span className="text-red-600 font-bold">● {criticalVisibleCount} Critical</span>
            )}
            {unassignedVisibleCount > 0 && (
              <span className="text-amber-700 font-semibold">● {unassignedVisibleCount} Unassigned</span>
            )}
            {overdueVisibleCount > 0 && (
              <span className="text-red-700 font-semibold">● {overdueVisibleCount} Overdue</span>
            )}
          </div>
        </div>

        {/* Right: Basemap Selector, Layer Dropdown & Quick Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          
          {/* Basemap Selector Pill */}
          <div className="hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-[#e5e7eb] shadow-md text-xs">
            <span className="text-[10px] text-[#6b7280] font-semibold pl-1">Map:</span>
            {['light', 'dark', 'osm', 'satellite'].map((bKey) => (
              <button
                key={bKey}
                type="button"
                onClick={() => setActiveBasemap(bKey)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer uppercase tracking-wider ${
                  activeBasemap === bKey
                    ? 'bg-[#111827] text-white shadow-2xs'
                    : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
                }`}
              >
                {bKey === 'osm' ? 'Streets' : bKey}
              </button>
            ))}
          </div>

          {/* Layer Options Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-md text-xs font-semibold transition-all cursor-pointer ${
                filterPanelOpen 
                  ? 'bg-[#ea580c] text-white border-[#ea580c]' 
                  : 'bg-white/95 backdrop-blur-md text-[#111827] border-[#e5e7eb] hover:bg-neutral-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters & Layers</span>
            </button>
          </div>

          {/* Toggle Issue List Sidebar */}
          <button
            type="button"
            onClick={() => setListPanelOpen(!listPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-md text-xs font-semibold transition-all cursor-pointer ${
              listPanelOpen 
                ? 'bg-white/95 backdrop-blur-md text-[#111827] border-[#e5e7eb]' 
                : 'bg-white text-[#6b7280] border-[#d1d5db]'
            }`}
            title="Toggle Issue List"
          >
            <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="hidden sm:inline">List ({filteredIssues.length})</span>
          </button>

          {/* Fit Visible Issues */}
          <button
            type="button"
            onClick={handleFitBounds}
            className="p-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#e5e7eb] shadow-md text-[#4b5563] hover:text-[#111827] hover:bg-neutral-50 transition-colors"
            title="Fit Filtered Issues"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#e5e7eb] shadow-md text-[#4b5563] hover:text-[#111827] hover:bg-neutral-50 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* ========================================================
          FLOATING LEFT PANEL: ISSUE LIST (Collapsible)
          ======================================================== */}
      {listPanelOpen && (
        <div className="absolute top-16 left-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-12 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-xl z-[var(--z-map-panel)] flex flex-col overflow-hidden animate-slideInLeft">
          
          {/* Header */}
          <div className="p-3 border-b border-[#f0f2f5] flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-bold text-xs text-[#111827]">
                Filtered Incidents ({filteredIssues.length})
              </h3>
              <p className="text-[10px] text-[#6b7280]">
                {validCoordIssues.length} mapped • {unmappedIssues.length} unmapped
              </p>
            </div>

            <button
              type="button"
              onClick={() => setListPanelOpen(false)}
              className="p-1 rounded-md text-[#9ca3af] hover:text-[#111827] cursor-pointer"
              title="Collapse list"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-2 border-b border-[#f0f2f5] flex-shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ID, locality..."
                className="w-full bg-[#f4f5f6] text-[11px] py-1 pl-8 pr-2.5 rounded-lg text-[#111827] placeholder-[#9ca3af] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Issues Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] p-1">
            {filteredIssues.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6b7280]">
                No issues match current filters.
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isSelected = selectedIssue && selectedIssue.id === issue.id;
                const sla = getSlaCondition(issue);

                return (
                  <div
                    key={issue.id}
                    onClick={() => handleSelectIssue(issue)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer space-y-1 ${
                      isSelected 
                        ? 'bg-orange-50/80 border border-[#ea580c] shadow-2xs' 
                        : 'hover:bg-[#f9fafb]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#ea580c] text-[10px]">
                        {issue.id}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>

                    <h4 className="font-semibold text-xs text-[#111827] line-clamp-1">
                      {issue.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-[#6b7280]">
                      <span className="truncate pr-1">📍 {issue.locality}</span>
                      <span className={`font-mono font-semibold ${
                        sla === 'Overdue' ? 'text-red-600' : 'text-[#374151]'
                      }`}>
                        {issue.status}
                      </span>
                    </div>

                    {!issue.hasValidCoords && (
                      <div className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        GPS unverified • Missing coordinates
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================================
          FLOATING FILTER & LAYER MODAL / PANEL (Toggleable)
          ======================================================== */}
      {filterPanelOpen && (
        <div className="absolute top-16 right-3 sm:right-16 w-72 max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-2xl p-4 z-[var(--z-map-dropdown)] space-y-3.5 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0f2f5]">
            <span className="font-bold text-[#111827] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Map Layers & Filters</span>
            </span>
            <button
              type="button"
              onClick={() => setFilterPanelOpen(false)}
              className="p-1 text-[#9ca3af] hover:text-[#111827] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Operational Layer Toggles */}
          <div className="space-y-1.5">
            <span className="block font-bold text-[10px] text-[#6b7280] uppercase tracking-wider">
              Operational Layers
            </span>
            
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>Incident Markers</span>
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="rounded text-[#ea580c] focus:ring-[#ea580c]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>Spatial Clustering</span>
              <input
                type="checkbox"
                checked={showClusters}
                onChange={(e) => setShowClusters(e.target.checked)}
                className="rounded text-[#ea580c] focus:ring-[#ea580c]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>Ward 112 Perimeter</span>
              <input
                type="checkbox"
                checked={showBoundary}
                onChange={(e) => setShowBoundary(e.target.checked)}
                className="rounded text-[#ea580c] focus:ring-[#ea580c]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>Incident Heatmap Overlay</span>
              <input
                type="checkbox"
                checked={showDensity}
                onChange={(e) => setShowDensity(e.target.checked)}
                className="rounded text-[#ea580c] focus:ring-[#ea580c]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>Show Resolved Incidents</span>
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded text-[#ea580c] focus:ring-[#ea580c]"
              />
            </label>
          </div>

          {/* Category Filter */}
          <div className="space-y-1 pt-2 border-t border-[#f0f2f5]">
            <span className="block font-bold text-[10px] text-[#6b7280] uppercase tracking-wider">
              Category
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2 py-1 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Road Damage & Potholes">Road Damage & Potholes</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Streetlights">Streetlights</option>
              <option value="Garbage & Sanitation">Garbage & Sanitation</option>
              <option value="Drainage & Stormwater">Drainage & Stormwater</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="space-y-1">
            <span className="block font-bold text-[10px] text-[#6b7280] uppercase tracking-wider">
              Severity
            </span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-2 py-1 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical (Level 4)</option>
              <option value="High">High (Level 3)</option>
              <option value="Medium">Medium (Level 2)</option>
              <option value="Low">Low (Level 1)</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-[#f0f2f5] flex justify-between items-center text-[11px]">
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('All');
                setSeverityFilter('All');
                setStatusFilter('All');
                setSlaFilter('All');
                setSquadFilter('All');
                setShowResolved(true);
                setShowClusters(true);
                setShowMarkers(true);
              }}
              className="text-[#ea580c] hover:underline font-semibold"
            >
              Clear filters
            </button>
            <button
              type="button"
              onClick={() => setFilterPanelOpen(false)}
              className="px-2.5 py-1 bg-[#111827] text-white rounded-md text-xs font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          FLOATING RIGHT PANEL: SELECTED ISSUE DETAILS (Collapsible)
          Only displayed when full details drawer is not actively open
          ======================================================== */}
      {selectedIssue && !layoutSelectedIssue && (
        <div className="absolute top-16 right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-12 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-2xl z-[var(--z-map-panel)] flex flex-col overflow-hidden animate-slideInRight">
          
          {/* Header */}
          <div className="p-3.5 border-b border-[#f0f2f5] flex items-center justify-between flex-shrink-0 bg-white">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {selectedIssue.id}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(selectedIssue.severity)}`}>
                {selectedIssue.severity}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCloseSelectedIssue}
              className="p-1 rounded-md text-[#9ca3af] hover:text-[#111827] cursor-pointer"
              aria-label="Close issue details card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable details */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            
            {/* Photo preview if present */}
            {selectedIssue.photo && (
              <img 
                src={selectedIssue.photo} 
                alt="Issue evidence" 
                className="w-full h-36 object-cover rounded-xl border border-[#e5e7eb]" 
              />
            )}

            <div>
              <h3 className="font-bold text-sm text-[#111827]">
                {selectedIssue.title}
              </h3>
              <p className="text-[11px] text-[#6b7280] pt-1">
                📍 {selectedIssue.locality}
              </p>
            </div>

            {/* Coordinates verification */}
            <div className="p-2.5 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] font-mono text-[10px] space-y-1">
              <div className="text-[#6b7280]">GIS Coordinates:</div>
              {selectedIssue.hasValidCoords ? (
                <div className="text-emerald-700 font-semibold">
                  ✓ {selectedIssue.latitude.toFixed(6)}° N, {selectedIssue.longitude.toFixed(6)}° E
                </div>
              ) : (
                <div className="text-amber-700 font-semibold">
                  ⚠️ Unverified Location (No GPS EXIF in submission)
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[#374151] leading-relaxed text-[11px]">
              {selectedIssue.description}
            </p>

            {/* Squad & Status */}
            <div className="p-3 rounded-xl bg-white border border-[#e5e7eb] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Squad:</span>
                <span className="font-semibold text-[#111827]">{selectedIssue.assignedTeam}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Status:</span>
                <span className="font-bold text-[#ea580c]">{selectedIssue.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">SLA Deadline:</span>
                <span className="font-mono text-[#374151]">
                  {new Date(selectedIssue.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(selectedIssue.dueAt).toLocaleDateString()}
                </span>
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="p-3 border-t border-[#f0f2f5] bg-[#fafbfc] flex items-center justify-between gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => openIssueDetail(selectedIssue)}
              className="flex-1 min-touch-target py-2.5 px-3 rounded-xl border border-[#d1d5db] text-[#374151] hover:bg-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Details</span>
            </button>

            <button
              type="button"
              onClick={() => setAssignModalOpen(true)}
              className="flex-1 min-touch-target py-2.5 px-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Dispatch</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
          BOTTOM-LEFT MAP LEGEND (Above mobile navigation on small screens)
          ======================================================== */}
      <div className="hidden sm:block absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-3 left-3 z-[var(--z-map-controls)] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#e5e7eb] shadow-md pointer-events-auto flex flex-wrap items-center gap-3 text-[11px] text-[#4b5563]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>Critical (12h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
            <span>High (24h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Medium (48h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Resolved</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-[#e5e7eb] pl-2 text-[10px] font-mono text-[#6b7280]">
            Zoom: {currentZoom}
          </div>
        </div>
      </div>

      {/* ========================================================
          BOTTOM-RIGHT MAP CONTROLS (Zoom, Recenter, Geolocation)
          Responsive shift when right panel is open to prevent overlap
          ======================================================== */}
      <div className={`absolute bottom-3 ${selectedIssue && !layoutSelectedIssue ? 'right-3 lg:right-[25.5rem]' : 'right-3'} z-[var(--z-map-controls)] flex items-center gap-1.5 transition-all duration-300`}>
        <button
          type="button"
          onClick={handleUserLocation}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#e5e7eb] shadow-md text-[#4b5563] hover:text-[#111827] hover:bg-neutral-50 transition-colors cursor-pointer"
          title="Detect Current Location"
        >
          <Navigation className="w-4 h-4 text-[#ea580c]" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
          }}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#e5e7eb] shadow-md text-[#4b5563] hover:text-[#111827] hover:bg-neutral-50 transition-colors font-bold text-xs cursor-pointer"
          title="Zoom In"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => {
            if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
          }}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#e5e7eb] shadow-md text-[#4b5563] hover:text-[#111827] hover:bg-neutral-50 transition-colors font-bold text-xs cursor-pointer"
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* ========================================================
          LEAFLET CANVAS MOUNT POINT
          ======================================================== */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0 [isolation:isolate]" />

      {/* Squad Assign Modal for Selected Issue */}
      {selectedIssue && (
        <AuthorityAssignModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          issue={selectedIssue}
          onConfirmAssign={({ squadName, assigneeName, workInstructions }) => {
            updateIssue(selectedIssue.id, {
              assignedTeam: squadName,
              assignedTo: assigneeName,
              status: selectedIssue.status === 'New' ? 'In Progress' : selectedIssue.status,
              internalNotes: workInstructions ? `[Map Dispatch]: ${workInstructions}` : undefined,
              statusNote: `Dispatched to ${squadName}`
            });
            setSelectedIssue({
              ...selectedIssue,
              assignedTeam: squadName,
              assignedTo: assigneeName,
              status: selectedIssue.status === 'New' ? 'In Progress' : selectedIssue.status
            });
            if (showToast) showToast(`Dispatched to ${squadName}`);
          }}
        />
      )}

    </div>
  );
}
