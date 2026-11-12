import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  MapPin, 
  ThumbsUp, 
  Search, 
  RotateCcw, 
  Navigation, 
  Plus
} from 'lucide-react';
import CivicInteractiveMap from '../../components/CivicInteractiveMap';

const INITIAL_NEARBY = [
  {
    id: 'NB-102',
    title: 'Damaged Sidewalk Pavers Near Metro Station',
    category: 'Drainage & Footpaths',
    distance: '180m away',
    location: '12th Main Road, Indiranagar',
    lat: 12.9760,
    lng: 77.6440,
    status: 'In Progress',
    votes: 14,
    reportedBy: 'Citizen P.S.'
  },
  {
    id: 'NB-108',
    title: 'Non-Functional Traffic Signal at Main Junction',
    category: 'Street Lighting & Signals',
    distance: '340m away',
    location: 'Double Road & 100ft Rd Junction',
    lat: 12.9716,
    lng: 77.6400,
    status: 'Awaiting Review',
    votes: 29,
    reportedBy: 'Citizen R.K.'
  },
  {
    id: 'NB-095',
    title: 'Fallen Tree Branch Obstructing Left Lane',
    category: 'Road Hazards',
    distance: '520m away',
    location: '6th Cross, Indiranagar 1st Stage',
    lat: 12.9790,
    lng: 77.6380,
    status: 'Resolved',
    votes: 8,
    reportedBy: 'Citizen M.A.'
  },
  {
    id: 'NB-114',
    title: 'Uncovered Stormwater Drain Silt Pit',
    category: 'Drainage & Sanitation',
    distance: '650m away',
    location: 'Near BDA Complex, Indiranagar',
    lat: 12.9735,
    lng: 77.6465,
    status: 'Awaiting Review',
    votes: 42,
    reportedBy: 'Citizen S.N.'
  }
];

const CATEGORIES = ['All Categories', 'Drainage & Footpaths', 'Street Lighting & Signals', 'Road Hazards', 'Drainage & Sanitation'];
const STATUSES = ['All Statuses', 'In Progress', 'Awaiting Review', 'Resolved'];

export default function CitizenNearbyPage() {
  const { reports, openReportDrawer, openReportModal, showToast } = useOutletContext();
  const [nearbyList, setNearbyList] = useState(INITIAL_NEARBY);
  const [upvoted, setUpvoted] = useState({});
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'map-only' | 'list-only'
  const [mobileTab, setMobileTab] = useState('map'); // 'map' | 'list' on screens < lg

  const handleVote = (id) => {
    if (upvoted[id]) return;
    setUpvoted({ ...upvoted, [id]: true });
    setNearbyList(nearbyList.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
    if (showToast) showToast(`Endorsed incident ${id}. Prioritization weight increased.`);
  };

  const filtered = nearbyList.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesCat = selectedCat === 'All Categories' || item.category === selectedCat;
    const matchesStatus = selectedStatus === 'All Statuses' || item.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto select-none font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Nearby Civic Issues
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fff5ee] text-[#ea580c] border border-[#fed7aa] font-semibold">
              Ward 112 Radar
            </span>
          </div>
          <p className="text-xs text-[#6b7280] pt-0.5">
            Discover community reports in your local vicinity and endorse critical grievances for rapid municipal attention.
          </p>
        </div>

        {/* View Mode Toggle & Report CTA */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Desktop View Mode Toggle */}
          <div className="hidden lg:flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e5e7eb] shadow-2xs text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'split' ? 'bg-[#111827] text-white font-semibold shadow-2xs' : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('map-only')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'map-only' ? 'bg-[#111827] text-white font-semibold shadow-2xs' : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              Map Only
            </button>
            <button
              onClick={() => setViewMode('list-only')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list-only' ? 'bg-[#111827] text-white font-semibold shadow-2xs' : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              List Only
            </button>
          </div>

          <button
            type="button"
            onClick={openReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Issue</span>
          </button>
        </div>
      </div>

      {/* Mobile Map / List Segmented Pill Switcher (screens < lg) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab('map')}
          className={`flex-1 min-touch-target py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-orange-600" />
          <span>Interactive Map</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('list')}
          className={`flex-1 min-touch-target py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>Incident List ({filtered.length})</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nearby streets or issues..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:border-[#ea580c] focus:bg-white focus:outline-none text-[#111827]"
            />
          </div>

          <div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:border-[#ea580c] focus:bg-white focus:outline-none text-[#111827] cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:border-[#ea580c] focus:bg-white focus:outline-none text-[#111827] cursor-pointer"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#6b7280] pt-1 border-t border-[#f3f4f6]">
          <span>Found <strong className="text-[#111827] font-semibold">{filtered.length}</strong> community reports within 1km radius</span>
          {(search || selectedCat !== 'All Categories' || selectedStatus !== 'All Statuses') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCat('All Categories');
                setSelectedStatus('All Statuses');
              }}
              className="text-[#ea580c] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className={`grid gap-6 ${
        viewMode === 'split' 
          ? 'grid-cols-1 lg:grid-cols-12' 
          : 'grid-cols-1'
      }`}>
        
        {/* Interactive Real Leaflet Map */}
        {(viewMode === 'split' || viewMode === 'map-only') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'col-span-1'} ${mobileTab === 'list' ? 'hidden lg:block' : 'block'} space-y-3`}>
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#ea580c]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
                    Ward 112 Spatial Radar Map
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#9ca3af]">Live OpenStreetMap</span>
              </div>

              <CivicInteractiveMap
                reports={reports}
                nearbyIssues={filtered}
                onSelectReport={(item) => {
                  if (openReportDrawer) openReportDrawer(item);
                }}
                className={viewMode === 'map-only' ? 'h-[580px]' : 'h-[360px] sm:h-[440px]'}
                showControls={true}
              />
            </div>
          </div>
        )}

        {/* Nearby Cards List */}
        {(viewMode === 'split' || viewMode === 'list-only') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'col-span-1'} ${mobileTab === 'map' ? 'hidden lg:block' : 'block'} space-y-3`}>
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const isVoted = upvoted[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (openReportDrawer) openReportDrawer(item);
                    }}
                    className="p-4 bg-white border border-[#e5e7eb] hover:border-[#ea580c]/50 rounded-2xl shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#6b7280] bg-[#f3f4f6] px-1.5 py-0.5 rounded">
                            {item.id}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.status === 'Resolved' ? 'bg-[#dcfce7] text-[#15803d]' :
                            item.status === 'In Progress' ? 'bg-[#ffedd5] text-[#c2410c]' :
                            'bg-[#fef3c7] text-[#b45309]'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-[#9ca3af] font-mono">
                            • {item.distance}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#ea580c] transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                          <span>📍 {item.location}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>

                      {/* Endorse Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(item.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex-shrink-0 cursor-pointer ${
                          isVoted
                            ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                            : 'bg-white hover:bg-[#fff5ee] text-[#374151] border-[#d1d5db] hover:border-[#ea580c]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-white' : ''}`} />
                        <span>{item.votes}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#9ca3af] pt-3 mt-3 border-t border-[#f3f4f6]">
                      <span>Reported by {item.reportedBy}</span>
                      <span className="text-[#ea580c] font-semibold group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center bg-white border border-[#e5e7eb] rounded-2xl text-xs text-[#6b7280] space-y-2">
                <MapPin className="w-8 h-8 text-[#9ca3af] mx-auto" />
                <p className="font-semibold text-[#111827]">No nearby issues match your filters</p>
                <p>Try searching for a different street or category.</p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
