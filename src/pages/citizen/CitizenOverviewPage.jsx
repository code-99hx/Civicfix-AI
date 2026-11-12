import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { 
  RotateCw, 
  Search, 
  Plus, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MapPin,
  ShieldCheck,
  FileText,
  Bell,
  Download
} from 'lucide-react';
import CivicInteractiveMap from '../../components/CivicInteractiveMap';

// Sample nearby community issues in Ward 112 for the map preview
const WARD_112_MAP_ISSUES = [
  {
    id: 'NB-102',
    title: 'Damaged Sidewalk Pavers Near Metro Station',
    category: 'Drainage & Footpaths',
    location: '12th Main Road, Indiranagar',
    lat: 12.9760,
    lng: 77.6440,
    status: 'In Progress'
  },
  {
    id: 'NB-108',
    title: 'Non-Functional Traffic Signal at Main Junction',
    category: 'Street Lighting & Signals',
    location: 'Double Road & 100ft Rd Junction',
    lat: 12.9716,
    lng: 77.6400,
    status: 'Awaiting Review'
  },
  {
    id: 'NB-095',
    title: 'Fallen Tree Branch Obstructing Left Lane',
    category: 'Road Hazards',
    location: '6th Cross, Indiranagar 1st Stage',
    lat: 12.9790,
    lng: 77.6380,
    status: 'Resolved'
  },
  {
    id: 'NB-114',
    title: 'Uncovered Stormwater Drain Silt Pit',
    category: 'Drainage & Sanitation',
    location: 'Near BDA Complex, Indiranagar',
    lat: 12.9735,
    lng: 77.6465,
    status: 'Awaiting Review'
  }
];

export default function CitizenOverviewPage() {
  const { reports, openReportModal, openReportDrawer, showToast } = useOutletContext();
  const navigate = useNavigate();

  // Chart range selector state: '7D' | '30D' | '90D' | 'All'
  const [chartRange, setChartRange] = useState('All');
  const [showTooltip, setShowTooltip] = useState(true);

  // Table search and filters
  const [tableSearch, setTableSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Derive metrics dynamically from reports
  const totalReportsCount = reports.length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;
  const awaitingCount = reports.filter(r => r.status === 'Awaiting Review').length;

  // Filtered reports for the overview table
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = tableSearch.toLowerCase().trim();
      const matchesSearch = !q || 
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [reports, tableSearch, selectedCategory, selectedStatus]);

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Title,Category,Location,Status,SubmittedAt"]
      .concat(filteredReports.map(r => `"${r.id}","${r.title}","${r.category}","${r.location}","${r.status}","${r.submittedAt}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `civicfix_recent_reports_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Exported recent reports to CSV.');
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto select-none font-sans">
      
      {/* ========================================================
          1. CITIZEN ENTITY & WARD CONTEXT HEADER (Matching Image 2 Layout)
          - Left: Squircle Icon + Title + Certified Badge + Citizen Avatar + Jurisdiction
          - Right: 3 Vertical Micro Metric Gauge Sliders (SLA 4.8/5, Resolution 88%, Triage 9.4/10)
          ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        
        {/* Left: Entity Identification */}
        <div className="flex items-center gap-3.5">
          {/* CivicFix Shield Emblem */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#111827] flex items-center justify-center text-white shadow-md border border-neutral-700/30 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#ea580c]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-[22px] font-bold text-[#111827] tracking-tight leading-none">
                Ward 112 Citizen Hub
              </h1>
              {/* Certified Pill */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fff5ee] text-[#ea580c] border border-[#fed7aa] text-[11px] font-semibold">
                <span className="text-[10px]">★</span>
                <span>Verified Citizen</span>
              </span>
            </div>

            {/* Micro Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-1.5 font-medium text-[#374151]">
                <img
                  src="/images/feature_01.jpg"
                  alt="Jessica Parker"
                  className="w-5 h-5 rounded-full object-cover border border-[#d1d5db] flex-shrink-0"
                  style={{ width: '20px', height: '20px' }}
                />
                <span>Jessica Parker</span>
              </div>

              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#ea580c]" />
                <span>Indiranagar • East Zone</span>
              </span>

              <span>•</span>
              <span className="text-[#9ca3af]">SLA Active 24/7</span>
            </div>
          </div>
        </div>

        {/* Right: 3 Vertical Micro-Metric Gauge Sliders (Matching Image 2 aesthetics) */}
        <div className="flex items-center gap-5 sm:gap-6 self-start lg:self-center bg-[#f9fafb] lg:bg-transparent p-2.5 lg:p-0 rounded-xl border lg:border-none border-[#e5e7eb]">
          
          {/* Slider 1: SLA Response */}
          <div className="flex items-center gap-2">
            <div className="relative w-1.5 h-7 bg-[#e5e7eb] rounded-full overflow-hidden flex flex-col justify-end">
              <div className="w-full bg-[#0284c7] h-[85%] rounded-full" />
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#0284c7] border border-white shadow-2xs" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="text-[#6b7280] block text-[10px]">Response</span>
              <span className="font-bold text-[#111827]">4.8</span>
              <span className="text-[10px] text-[#9ca3af]">/5</span>
            </div>
          </div>

          {/* Slider 2: Resolution Rate */}
          <div className="flex items-center gap-2">
            <div className="relative w-1.5 h-7 bg-[#e5e7eb] rounded-full overflow-hidden flex flex-col justify-end">
              <div className="w-full bg-[#ea580c] h-[72%]" />
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#ea580c] border border-white shadow-2xs" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="text-[#6b7280] block text-[10px]">Fix Rate</span>
              <span className="font-bold text-[#111827]">88%</span>
            </div>
          </div>

          {/* Slider 3: Citizen Satisfaction */}
          <div className="flex items-center gap-2">
            <div className="relative w-1.5 h-7 bg-[#e5e7eb] rounded-full overflow-hidden flex flex-col justify-end">
              <div className="w-full bg-[#10b981] h-[92%]" />
              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#10b981] border border-white shadow-2xs" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="text-[#6b7280] block text-[10px]">Trust</span>
              <span className="font-bold text-[#111827]">9.4</span>
              <span className="text-[10px] text-[#9ca3af]">/10</span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#e5e7eb]">
            <button
              type="button"
              onClick={openReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
            <Link
              to="/dashboard/reports"
              className="flex items-center gap-1 px-2.5 py-1.5 border border-[#d1d5db] bg-white hover:bg-[#f9fafb] text-[#374151] rounded-lg text-xs font-semibold transition-all shadow-2xs"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 text-[#9ca3af]" />
            </Link>
          </div>

        </div>

      </div>

      {/* ========================================================
          2. SUMMARY METRICS ROW (4 Clickable Cards)
          - Calculated from actual underlying reports dataset
          - Navigates to filtered reports view on click
          ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Total Reports */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/reports')}
          className="text-left bg-white border border-[#e5e7eb] hover:border-[#ea580c]/50 hover:shadow-xs p-3.5 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#6b7280]">
            <span className="font-medium">Total Reports</span>
            <FileText className="w-3.5 h-3.5 text-[#9ca3af] group-hover:text-[#ea580c] transition-colors" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111827] font-mono tracking-tight">
              {totalReportsCount}
            </span>
            <span className="text-[10px] text-[#6b7280]">submitted</span>
          </div>
          <div className="mt-2 flex items-center text-[10px] text-[#ea580c] font-medium group-hover:translate-x-0.5 transition-transform">
            <span>View all reports →</span>
          </div>
        </button>

        {/* Metric 2: In Progress */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/reports?status=In Progress')}
          className="text-left bg-white border border-[#e5e7eb] hover:border-[#ea580c]/50 hover:shadow-xs p-3.5 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#6b7280]">
            <span className="font-medium">In Progress</span>
            <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ea580c] font-mono tracking-tight">
              {inProgressCount}
            </span>
            <span className="text-[10px] text-[#6b7280]">crew dispatched</span>
          </div>
          <div className="mt-2 flex items-center text-[10px] text-[#6b7280] font-medium">
            <span>Active work orders</span>
          </div>
        </button>

        {/* Metric 3: Resolved */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/reports?status=Resolved')}
          className="text-left bg-white border border-[#e5e7eb] hover:border-emerald-500/50 hover:shadow-xs p-3.5 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#6b7280]">
            <span className="font-medium">Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#10b981] font-mono tracking-tight">
              {resolvedCount}
            </span>
            <span className="text-[10px] text-[#6b7280]">verified closed</span>
          </div>
          <div className="mt-2 flex items-center text-[10px] text-[#10b981] font-medium">
            <span>Proof verified</span>
          </div>
        </button>

        {/* Metric 4: Awaiting Review */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/reports?status=Awaiting Review')}
          className="text-left bg-white border border-[#e5e7eb] hover:border-amber-500/50 hover:shadow-xs p-3.5 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#6b7280]">
            <span className="font-medium">Awaiting Review</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#f59e0b] font-mono tracking-tight">
              {awaitingCount}
            </span>
            <span className="text-[10px] text-[#6b7280]">in AI triage</span>
          </div>
          <div className="mt-2 flex items-center text-[10px] text-[#6b7280] font-medium">
            <span>Inspection queued</span>
          </div>
        </button>

      </div>

      {/* ========================================================
          3. REPORTS & RESOLUTIONS OVER TIME (Dual Wavy Curves Canvas)
          - Header: Title, - Submitted (Coral), - Resolved (Emerald)
          - Controls: Refresh, Time range (7D, 30D, 90D, All), Scale
          - Interactive Tooltip matching Image 2
          - Milestone timeline at the bottom
          ======================================================== */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs space-y-4">
        
        {/* Chart Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left Title & Legend */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#111827] tracking-tight">
                Grievances & Resolutions Over Time
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]">
                Simulated Ward Analytics
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6b7280] font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#ea580c] rounded-full inline-block" />
                <span>Submitted Grievances</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#10b981] rounded-full inline-block" />
                <span>Verified Resolved</span>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Toggle Tooltip */}
            <button 
              type="button" 
              onClick={() => setShowTooltip(!showTooltip)}
              className="p-1 rounded text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#4b5563] transition-colors"
              title="Toggle Tooltip"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Segmented Time Controls: 7D, 30D, 90D, All */}
            <div className="flex items-center bg-[#f4f5f6] p-0.5 rounded-lg text-xs font-medium text-[#6b7280]">
              {['7D', '30D', '90D', 'All'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setChartRange(t);
                    if (showToast) showToast(`Chart filtered to past ${t}.`);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    chartRange === t 
                      ? 'bg-white text-[#111827] font-semibold shadow-2xs' 
                      : 'hover:text-[#111827]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Value scale badge */}
            <span className="text-xs text-[#9ca3af] font-mono pl-1 hidden sm:inline">
              ↑ 0 - 25 Reports
            </span>

          </div>

        </div>

        {/* Chart Graphical Surface (SVG with dual wavy curves) */}
        <div className="relative w-full aspect-[21/8] min-h-[220px]">
          
          <svg 
            className="w-full h-full overflow-visible" 
            viewBox="0 0 900 240" 
            preserveAspectRatio="none"
          >
            {/* Horizontal Guide Grid Lines */}
            <line x1="20" y1="40" x2="880" y2="40" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="20" y1="100" x2="880" y2="100" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="20" y1="160" x2="880" y2="160" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="2 4" />

            {/* Dotted Vertical Guide Line at Oct 17, 26 */}
            <line x1="435" y1="20" x2="435" y2="200" stroke="#d1d5db" strokeWidth="1.2" strokeDasharray="3 3" />
            
            {/* Second Dotted Vertical Guide Line near Today */}
            <line x1="680" y1="20" x2="680" y2="200" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />

            {/* TOP CURVE: Submitted Grievances (Coral wavy curve) */}
            <path
              d="M 20 115 
                 C 45 100, 70 95, 95 105 
                 C 120 115, 140 120, 160 100 
                 C 180 80, 200 125, 220 110 
                 C 240 95, 260 70, 280 85 
                 C 300 100, 320 115, 340 100 
                 C 360 85, 380 90, 400 105 
                 C 415 118, 425 110, 435 115
                 C 455 125, 475 110, 495 115
                 C 515 120, 535 90, 555 75 
                 C 575 60, 595 110, 615 90 
                 C 635 70, 655 105, 680 100
                 L 880 85"
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* BOTTOM CURVE: Resolved Issues (Emerald wavy curve) */}
            <path
              d="M 20 160 
                 C 45 170, 70 180, 95 175 
                 C 120 170, 140 155, 160 155 
                 C 180 155, 195 180, 215 185 
                 C 235 190, 255 150, 275 165 
                 C 295 180, 315 195, 335 180 
                 C 355 165, 375 170, 395 185 
                 C 415 195, 425 180, 435 190
                 C 455 200, 475 180, 495 185
                 C 515 190, 535 160, 555 155 
                 C 575 150, 595 180, 615 170 
                 C 635 160, 655 185, 680 180
                 L 880 180"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Key Marker Points */}
            <circle cx="160" cy="100" r="3.5" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
            <circle cx="435" cy="115" r="3.5" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
            <circle cx="680" cy="100" r="3.5" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />

            <circle cx="160" cy="155" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
            <circle cx="435" cy="190" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
            <circle cx="680" cy="180" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
          </svg>

          {/* Floating Tooltip Card (Matching Image 2 exact styling) */}
          {showTooltip && (
            <div 
              className="absolute left-[47%] top-[10%] -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#e5e7eb] rounded-xl p-3 shadow-lg pointer-events-auto w-48 text-xs space-y-2 z-10 transition-all"
            >
              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-[#f3f4f6]">
                <span className="font-semibold text-[#111827]">Oct 17, 26</span>
                <span className="px-1.5 py-0.2 bg-[#f3f4f6] text-[#374151] rounded text-[10px] font-mono font-bold">
                  +3 Active
                </span>
              </div>

              {/* Submitted value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                  <span className="font-bold text-[#111827]">4 Submitted</span>
                </div>
                <span className="text-[10px] font-mono text-[#ea580c] font-semibold">
                  +25%
                </span>
              </div>

              {/* Resolved value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span className="font-bold text-[#111827]">2 Resolved</span>
                </div>
                <span className="text-[10px] font-mono text-[#10b981] font-semibold">
                  +100%
                </span>
              </div>
            </div>
          )}

          {/* Bottom Timeline Milestone Markers */}
          <div className="absolute bottom-1 left-4 right-4 flex items-center justify-between text-[10px] text-[#9ca3af] font-mono">
            <div className="flex items-center gap-1">
              <span>Oct 1</span>
              <span>📸 Intake</span>
            </div>

            <div className="flex items-center gap-1 font-bold text-[#111827]">
              <span>▲ Oct 17</span>
              <span className="text-[#ea580c]">Dispatched</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">Today</span>
              <span>🔒 48h SLA</span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================
          4. INTERACTIVE NEARBY CIVIC MAP PREVIEW (CivicInteractiveMap)
          - Embedded real Leaflet OpenStreetMap
          - Live Ward 112 markers
          - Category / status filters
          - Marker popups with "Inspect" action that opens the report drawer
          ======================================================== */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#111827] tracking-tight">
                Ward 112 Spatial Radar
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-[#6b7280]">
                Interactive Map Preview
              </span>
            </div>
            <p className="text-xs text-[#6b7280] pt-0.5">
              Live geographic overview of your submitted tickets and neighboring community grievances.
            </p>
          </div>

          <Link
            to="/dashboard/nearby"
            className="flex items-center gap-1 text-xs font-semibold text-[#ea580c] hover:text-[#c2410c] transition-colors self-start sm:self-center"
          >
            <span>Open Full Radar View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Map Canvas */}
        <CivicInteractiveMap
          reports={reports}
          nearbyIssues={WARD_112_MAP_ISSUES}
          onSelectReport={(item) => {
            if (openReportDrawer) openReportDrawer(item);
          }}
          className="h-[320px]"
          showControls={true}
        />
      </div>

      {/* ========================================================
          5. RECENT REPORTS DATA TABLE (Matching Image 2 Aesthetics)
          - Header: "Recent reports", Filter, Sort, Search, Export, + Report Issue
          - Table columns: Checkbox, ID, Issue Title, Category, Location, Submitted, Status, Action
          - Click row opens CitizenReportDetailDrawer
          - Empty state when search produces no results
          ======================================================== */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs space-y-4">
        
        {/* Table Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left Title & Count */}
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#111827] tracking-tight">
              Recent Reports
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#4b5563] font-semibold">
              {filteredReports.length} {filteredReports.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#4b5563]">
            
            {/* Filter by Category */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-[#d1d5db] text-[#374151] rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-medium hover:bg-[#f9fafb] cursor-pointer focus:outline-none focus:border-[#ea580c]"
              >
                <option value="All">All Categories</option>
                <option value="Road Damage & Potholes">Roads & Potholes</option>
                <option value="Streetlights">Streetlights</option>
                <option value="Garbage & Sanitation">Garbage</option>
                <option value="Water Leakage">Water</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter by Status */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-[#d1d5db] text-[#374151] rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-medium hover:bg-[#f9fafb] cursor-pointer focus:outline-none focus:border-[#ea580c]"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Review">Awaiting Review</option>
                <option value="Resolved">Resolved</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showSearchInput || tableSearch
                  ? 'border-[#ea580c] bg-[#fff5ee] text-[#ea580c]'
                  : 'border-[#d1d5db] bg-white hover:bg-[#f9fafb] text-[#4b5563]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d1d5db] bg-white hover:bg-[#f9fafb] text-[#111827] font-semibold transition-colors shadow-2xs cursor-pointer"
              title="Download CSV report"
            >
              <Download className="w-3.5 h-3.5 text-[#6b7280]" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* + Report Issue Button */}
            <button
              type="button"
              onClick={openReportModal}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-xs shadow-xs active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

          </div>

        </div>

        {/* Search Bar Row (When toggled) */}
        {showSearchInput && (
          <div className="p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl flex items-center gap-2 animate-fadeIn">
            <Search className="w-3.5 h-3.5 text-[#9ca3af] ml-1 flex-shrink-0" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search reports by ID, title, road, or category..."
              className="w-full px-2 py-1 text-xs bg-transparent border-none focus:outline-none text-[#111827] placeholder-[#9ca3af]"
              autoFocus
            />
            {tableSearch && (
              <button
                type="button"
                onClick={() => setTableSearch('')}
                className="text-[11px] text-[#6b7280] hover:text-[#111827] px-2"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Desktop Reports Table Surface (screens >= md) */}
        <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-[#f0f2f5]">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header Row */}
            <thead>
              <tr className="bg-[#f9fafb] text-[#6b7280] text-[11px] font-semibold border-b border-[#f0f2f5]">
                <th className="py-2.5 px-3 w-8">
                  <input type="checkbox" className="rounded-sm border-neutral-300 text-neutral-900 focus:ring-0" aria-label="Select all" />
                </th>
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-4">Issue Title</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Submitted</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body Rows */}
            <tbody className="divide-y divide-[#f3f4f6]">
              {filteredReports.length > 0 ? (
                filteredReports.map((row) => {
                  let statusBadgeClass = 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]'; // In Progress
                  if (row.status === 'Resolved') {
                    statusBadgeClass = 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]';
                  } else if (row.status === 'Awaiting Review') {
                    statusBadgeClass = 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]';
                  }

                  return (
                    <tr
                      key={row.id}
                      onClick={() => {
                        if (openReportDrawer) openReportDrawer(row);
                      }}
                      className="hover:bg-[#f9fafb] transition-colors cursor-pointer group"
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3">
                        <input 
                          type="checkbox" 
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-sm border-neutral-300 text-neutral-900 focus:ring-0" 
                        />
                      </td>

                      {/* ID */}
                      <td className="py-3 px-3 font-mono font-bold text-[#111827] whitespace-nowrap">
                        {row.id}
                      </td>

                      {/* Issue Title with small thumbnail */}
                      <td className="py-3 px-4 font-semibold text-[#111827] whitespace-nowrap group-hover:text-[#ea580c] transition-colors">
                        <div className="flex items-center gap-2">
                          {row.photo && (
                            <img
                              src={row.photo}
                              alt=""
                              className="w-5 h-5 rounded object-cover border border-neutral-200 flex-shrink-0"
                            />
                          )}
                          <span className="truncate max-w-[220px]">{row.title}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap text-[#4b5563]">
                        {row.category}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 whitespace-nowrap text-[#6b7280]">
                        <span className="truncate max-w-[200px] block">
                          {row.location}
                        </span>
                      </td>

                      {/* Submitted */}
                      <td className="py-3 px-4 font-mono text-[#6b7280] whitespace-nowrap">
                        {row.submittedAt}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeClass}`}>
                          {row.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openReportDrawer) openReportDrawer(row);
                          }}
                          className="text-[11px] font-semibold text-[#ea580c] hover:text-[#c2410c] hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-xs text-[#6b7280]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-6 h-6 text-[#9ca3af]" />
                      <p className="font-semibold text-[#111827]">No reports found matching your criteria</p>
                      <button
                        type="button"
                        onClick={() => {
                          setTableSearch('');
                          setSelectedCategory('All');
                          setSelectedStatus('All');
                        }}
                        className="text-xs text-[#ea580c] hover:underline font-medium"
                      >
                        Reset search and filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Mobile-Friendly Report Cards (screens < md) */}
        <div className="md:hidden space-y-2.5">
          {filteredReports.length > 0 ? (
            filteredReports.map((row) => {
              let statusBadgeClass = 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]'; // In Progress
              if (row.status === 'Resolved') {
                statusBadgeClass = 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]';
              } else if (row.status === 'Awaiting Review') {
                statusBadgeClass = 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]';
              }
              return (
                <div
                  key={row.id}
                  onClick={() => openReportDrawer && openReportDrawer(row)}
                  className="p-3.5 bg-white border border-[#e5e7eb] rounded-xl shadow-2xs space-y-2.5 hover:border-[#ea580c] transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#ea580c]">{row.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${statusBadgeClass}`}>
                      {row.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    {row.photo ? (
                      <img
                        src={row.photo}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-900 text-xs leading-snug line-clamp-2">
                        {row.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{row.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {row.category}
                    </span>
                    <span className="font-mono text-slate-400">{row.submittedAt}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
              No reports match your search criteria.
            </div>
          )}
        </div>

      </div>

      {/* ========================================================
          6. QUICK ACTIONS SHORTCUTS GRID
          - Working shortcuts for Report, Track, Nearby, Notifications
          ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Quick Action 1: Report an Issue */}
        <button
          type="button"
          onClick={openReportModal}
          className="text-left bg-white border border-[#e5e7eb] hover:border-[#ea580c] p-3.5 rounded-xl transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-[#fff5ee] text-[#ea580c] flex items-center justify-center mb-2">
            <Plus className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#111827] group-hover:text-[#ea580c] transition-colors">
            Report an Issue
          </div>
          <p className="text-[10px] text-[#6b7280] pt-0.5 leading-snug">
            Upload photo & notify Ward 112 triage crew
          </p>
        </button>

        {/* Quick Action 2: Track Reports */}
        <Link
          to="/dashboard/reports"
          className="text-left bg-white border border-[#e5e7eb] hover:border-[#ea580c] p-3.5 rounded-xl transition-all shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#111827] group-hover:text-[#ea580c] transition-colors">
            Track My Reports
          </div>
          <p className="text-[10px] text-[#6b7280] pt-0.5 leading-snug">
            Monitor real-time repair work orders
          </p>
        </Link>

        {/* Quick Action 3: Explore Nearby Map */}
        <Link
          to="/dashboard/nearby"
          className="text-left bg-white border border-[#e5e7eb] hover:border-[#ea580c] p-3.5 rounded-xl transition-all shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center mb-2">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#111827] group-hover:text-[#ea580c] transition-colors">
            Nearby Issues
          </div>
          <p className="text-[10px] text-[#6b7280] pt-0.5 leading-snug">
            Explore neighborhood radar and upvote
          </p>
        </Link>

        {/* Quick Action 4: Notifications */}
        <Link
          to="/dashboard/notifications"
          className="text-left bg-white border border-[#e5e7eb] hover:border-[#ea580c] p-3.5 rounded-xl transition-all shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#fef2f2] text-[#dc2626] flex items-center justify-center mb-2">
            <Bell className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#111827] group-hover:text-[#ea580c] transition-colors">
            Notifications
          </div>
          <p className="text-[10px] text-[#6b7280] pt-0.5 leading-snug">
            Check AI triage and dispatch alerts
          </p>
        </Link>

      </div>

    </div>
  );
}
