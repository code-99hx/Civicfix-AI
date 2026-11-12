import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Building2, 
  ListOrdered, 
  Map, 
  Users, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers, 
  Search, 
  ArrowLeft, 
  Bell, 
  ChevronDown, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  PanelLeftClose,
  ChevronRight,
  Activity,
  Flame,
  Radio,
  SlidersHorizontal,
  Compass,
  CornerDownLeft
} from 'lucide-react';
import { 
  getDemoSession, 
  clearDemoSession 
} from '../services/demoAuth';
import { 
  getAuthorityIssues, 
  updateAuthorityIssue, 
  assignSquadToIssue,
  getAuthoritySettings,
  getSlaCondition
} from '../services/authorityData';
import AuthorityIssueDetailDrawer from '../components/AuthorityIssueDetailDrawer';
import Toast from '../components/Toast';

export default function AuthorityDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(getDemoSession());
  const [settings, setSettings] = useState(getAuthoritySettings());
  const [issues, setIssues] = useState(getAuthorityIssues());
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [toast, setToast] = useState(null);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Sync session and issues
  useEffect(() => {
    setSession(getDemoSession());
    setSettings(getAuthoritySettings());
    setIssues(getAuthorityIssues());

    const handleIssuesUpdated = (e) => {
      if (e.detail) {
        setIssues(e.detail);
        if (selectedIssue) {
          const matched = e.detail.find(i => i.id === selectedIssue.id);
          if (matched) setSelectedIssue(matched);
        }
      }
    };

    const handleSettingsUpdated = (e) => {
      if (e.detail) setSettings(e.detail);
    };

    window.addEventListener('civicfix_authority_issues_updated', handleIssuesUpdated);
    window.addEventListener('civicfix_authority_settings_updated', handleSettingsUpdated);

    return () => {
      window.removeEventListener('civicfix_authority_issues_updated', handleIssuesUpdated);
      window.removeEventListener('civicfix_authority_settings_updated', handleSettingsUpdated);
    };
  }, [location.pathname]);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to focus sidebar search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close search suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    clearDemoSession();
    navigate('/login');
  };

  const handleUpdateIssue = (id, updates) => {
    const updated = updateAuthorityIssue(id, updates);
    setIssues(updated);
    if (selectedIssue && selectedIssue.id === id) {
      setSelectedIssue({ ...selectedIssue, ...updates });
    }
  };

  const handleAssignSquad = (issueId, squadName, assigneeName, note) => {
    const updated = assignSquadToIssue(issueId, squadName, assigneeName, note);
    setIssues(updated);
    if (selectedIssue && selectedIssue.id === issueId) {
      const match = updated.find(i => i.id === issueId);
      if (match) setSelectedIssue(match);
    }
    showToast(`Work order dispatched to ${squadName}`);
  };

  const handleHeaderSearch = (e) => {
    if (e.key === 'Enter' && headerSearch.trim()) {
      setIsSearchFocused(false);
      navigate(`/authority/issues?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const handleSidebarSearchSubmit = (query) => {
    if (!query.trim()) return;
    setIsSearchFocused(false);
    navigate(`/authority/issues?q=${encodeURIComponent(query.trim())}`);
  };

  // Search Results Matching for Header Command Palette
  const searchResults = useMemo(() => {
    if (!headerSearch.trim()) return issues.slice(0, 5);
    const q = headerSearch.toLowerCase().trim();
    return issues.filter(i => 
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      (i.locality && i.locality.toLowerCase().includes(q)) ||
      (i.assignedTeam && i.assignedTeam.toLowerCase().includes(q)) ||
      (i.severity && i.severity.toLowerCase().includes(q)) ||
      (i.status && i.status.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [issues, headerSearch]);

  const handleSelectSearchIssue = (issue) => {
    setIsSearchFocused(false);
    setHeaderSearch('');
    if (location.pathname === '/authority/map') {
      navigate(`/authority/map?issueId=${issue.id}`);
    } else {
      setSelectedIssue(issue);
    }
  };

  // Status Counts
  const unassignedCount = issues.filter(i => i.assignedTeam === 'Unassigned' || !i.assignedTeam).length;
  const overdueCount = issues.filter(i => getSlaCondition(i) === 'Overdue').length;
  const inProgressCount = issues.filter(i => i.status === 'In Progress').length;
  const nonOverdueCount = issues.length - overdueCount;
  const slaComplianceRate = issues.length > 0 ? Math.round((nonOverdueCount / issues.length) * 100) : 100;

  // Grouped Navigation Items
  const primaryOperationsNav = [
    { 
      name: 'Overview', 
      path: '/authority/dashboard', 
      icon: Layers,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/20'
    },
    { 
      name: 'Incident Queue', 
      path: '/authority/issues', 
      icon: ListOrdered, 
      badge: unassignedCount > 0 ? `${unassignedCount} new` : `${issues.length}`,
      badgeColor: unassignedCount > 0 ? 'bg-[#ff5722] text-white font-bold' : 'bg-slate-100 text-slate-700'
    },
    { 
      name: 'GIS Command Map', 
      path: '/authority/map', 
      icon: Map, 
      badge: 'Radar',
      badgePulse: true,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold'
    },
    { 
      name: 'Squad Allocations', 
      path: '/authority/assignments', 
      icon: Users,
      badge: '5 Crews',
      badgeColor: 'bg-slate-100 text-slate-600'
    },
  ];

  const secondaryGovernanceNav = [
    { 
      name: 'Analytics & SLA', 
      path: '/authority/analytics', 
      icon: BarChart3,
      badge: `${slaComplianceRate}%`,
      badgeColor: slaComplianceRate >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
    },
    { 
      name: 'Console Settings', 
      path: '/authority/settings', 
      icon: Settings 
    },
  ];

  const getBreadcrumbTitle = () => {
    if (location.pathname === '/authority/dashboard') return 'Operations Overview';
    if (location.pathname === '/authority/issues') return 'Municipal Incident Queue';
    if (location.pathname === '/authority/map') return 'Spatial GIS Command Map';
    if (location.pathname === '/authority/assignments') return 'Squad Allocations & Dispatch';
    if (location.pathname === '/authority/analytics') return 'Performance Analytics & SLA';
    if (location.pathname === '/authority/settings') return 'Authority Settings';
    return 'Authority Console';
  };

  const isMapRoute = location.pathname === '/authority/map';
  const isAssignmentsRoute = location.pathname === '/authority/assignments';
  const officerName = settings?.nodalOfficer || session?.authorityProfile?.roleTitle || 'Insp. Ramesh Rao';
  const orgName = settings?.orgName || session?.authorityProfile?.orgName || 'Bruhat Bengaluru Mahanagara Palike';
  const wardName = settings?.ward || session?.authorityProfile?.jurisdiction?.ward || 'Ward 112 (Indiranagar)';

  return (
    <div className="min-h-screen bg-[#f1f3f5] p-0 sm:p-3 lg:p-4 font-sans antialiased text-[#111827] flex items-center justify-center selection:bg-[#ea580c] selection:text-white">
      
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Container Card */}
      <div className="w-full max-w-[1540px] h-[100dvh] sm:h-[calc(100dvh-2rem)] max-h-[100dvh] sm:max-h-[1050px] bg-white sm:rounded-3xl border border-slate-200/90 shadow-2xl flex overflow-hidden relative">
        
        {/* ========================================================
            PREMIUM REDESIGNED AUTHORITY SIDEBAR
            - Width: 260px for elegant proportions & high-density layout
            - Subtle dual-tone slate background with refined hairlines
            - Smart interactive command search bar with instant matching & hotkey
            - Grouped operations hierarchy & active visual indicators
            - Dynamic ward telemetry pulse widget
            - Modern officer executive profile & popover switcher
            ======================================================== */}
        <aside 
          className="hidden lg:flex lg:flex-col w-[260px] h-full bg-[#fafbfc] border-r border-slate-200/80 z-30 select-none overflow-hidden justify-between p-3.5 box-border flex-shrink-0"
          aria-label="Authority Command Sidebar"
        >
          {/* Top Section: Brand + Smart Search + Grouped Navigation */}
          <div className="space-y-3.5 flex-shrink-0">
            
            {/* Brand Logo & Station Header */}
            <div className="flex items-center justify-between px-1 pt-1">
              <Link to="/authority/dashboard" className="flex items-center gap-2.5 group">
                {/* Premium Gradient Emblem */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#c2410c] text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[15px] tracking-tight text-slate-900 leading-none">
                      CivicFix
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-[#ea580c] leading-none">
                      AI HUB
                    </span>
                  </div>
                  <div className="flex items-center gap-1 pt-1 text-[9px] font-semibold text-slate-500 tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Command • Ward 112</span>
                  </div>
                </div>
              </Link>

              {/* Sidebar View Pinned Toggle */}
              <button 
                type="button" 
                onClick={() => showToast('Authority Console sidebar locked')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Sidebar fixed in workspace"
                aria-label="Sidebar pinned"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Smart Interactive Search Bar */}
            <div className="relative" ref={searchContainerRef}>
              <div className={`relative flex items-center rounded-xl bg-white border transition-all shadow-2xs ${
                isSearchFocused 
                  ? 'border-[#ea580c] ring-2 ring-[#ea580c]/15 shadow-sm' 
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}>
                <Search className={`w-3.5 h-3.5 absolute left-3 transition-colors ${
                  isSearchFocused ? 'text-[#ea580c]' : 'text-slate-400'
                }`} />
                
                <input
                  ref={searchInputRef}
                  type="text"
                  value={sidebarSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSidebarSearchSubmit(sidebarSearch);
                    if (e.key === 'Escape') setIsSearchFocused(false);
                  }}
                  placeholder="Quick search tickets or squads..."
                  className="w-full bg-transparent text-xs py-2 pl-8 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                />

                {sidebarSearch ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSidebarSearch('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="absolute right-2.5 flex items-center gap-0.5 text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                    ⌘K
                  </span>
                )}
              </div>

              {/* Dynamic Instant Search Results Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                  
                  {/* Results List */}
                  {sidebarSearch.trim() ? (
                    <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Matching Incidents</span>
                        <span className="text-[9px] font-mono">{searchResults.length} found</span>
                      </div>

                      {searchResults.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-500">
                          <p className="font-semibold text-slate-700">No matching tickets</p>
                          <p className="text-[11px] text-slate-400 pt-0.5">Press Enter to run broad queue search</p>
                        </div>
                      ) : (
                        searchResults.map(issue => {
                          const isOverdue = getSlaCondition(issue) === 'Overdue';
                          return (
                            <button
                              key={issue.id}
                              type="button"
                              onClick={() => handleSelectSearchIssue(issue)}
                              className="w-full text-left p-2 rounded-lg hover:bg-orange-50/70 transition-colors flex items-start gap-2 cursor-pointer group"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors">
                                    {issue.id}
                                  </span>
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                                    issue.severity === 'Critical' 
                                      ? 'bg-red-100 text-red-700' 
                                      : issue.severity === 'High' 
                                      ? 'bg-orange-100 text-[#ea580c]' 
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {issue.severity}
                                  </span>
                                  {isOverdue && (
                                    <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 rounded">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-slate-800 truncate pt-0.5 group-hover:text-slate-900">
                                  {issue.title}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  {issue.locality || issue.category} • {issue.assignedTeam || 'Unassigned'}
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#ea580c] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                            </button>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    /* Instant Quick Navigation Presets when input is empty */
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Quick Filters & Jump
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate('/authority/issues?filter=overdue');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          <span>Overdue SLA Incidents</span>
                        </div>
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                          {overdueCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate('/authority/issues?filter=unassigned');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>Unassigned Triage Queue</span>
                        </div>
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-orange-100 text-[#ea580c]">
                          {unassignedCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate('/authority/map');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Radio className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Live GIS Geospatial Radar</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Search Dropdown Footer */}
                  <div className="p-2 bg-slate-50 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <button
                      type="button"
                      onClick={() => handleSidebarSearchSubmit(sidebarSearch)}
                      className="hover:text-[#ea580c] flex items-center gap-1 font-semibold"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      <span>Search All Queue</span>
                    </button>
                    <span>ESC to close</span>
                  </div>

                </div>
              )}
            </div>

            {/* Navigation Group 1: COMMAND & OPERATIONS */}
            <div className="space-y-1">
              <div className="px-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Command Operations
              </div>
              <nav className="space-y-0.5" aria-label="Command Operations navigation">
                {primaryOperationsNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-orange-50/90 text-orange-950 border border-orange-200/80 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-[#ea580c]' : 'text-slate-400'
                        }`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <div className="flex items-center gap-1">
                          {item.badgePulse && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                            item.badgeColor
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Navigation Group 2: GOVERNANCE & ANALYTICS */}
            <div className="space-y-1 pt-1">
              <div className="px-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Governance & Controls
              </div>
              <nav className="space-y-0.5" aria-label="Governance navigation">
                {secondaryGovernanceNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-orange-50/90 text-orange-950 border border-orange-200/80 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-[#ea580c]' : 'text-slate-400'
                        }`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                          item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {/* Direct Citizen Portal Jump */}
                <Link
                  to="/dashboard"
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-all group"
                  title="Switch to Resident Grievance Portal"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#ea580c] transition-colors" />
                    <span>Citizen Portal View</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-[#ea580c] transition-colors">
                    Switch
                  </span>
                </Link>
              </nav>
            </div>

          </div>

          {/* Bottom Section: Telemetry Pulse Card & Executive Officer Profile */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200/80 flex-shrink-0">
            
            {/* Live Operations Telemetry Mini-Widget */}
            <div className="bg-gradient-to-br from-white to-slate-50/90 border border-slate-200/90 rounded-2xl p-3 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-bold text-slate-900 truncate">
                    {wardName}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {slaComplianceRate}% SLA
                </span>
              </div>

              {/* Progress Bar of SLA Health */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#ea580c] rounded-full transition-all duration-500"
                    style={{ width: `${slaComplianceRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                  <span>Active: <strong className="text-slate-800">{issues.filter(i => i.status !== 'Resolved').length}</strong></span>
                  {overdueCount > 0 ? (
                    <span className="text-red-600 font-bold">⚠️ {overdueCount} Overdue</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">✓ 0 Overdue</span>
                  )}
                </div>
              </div>

              {/* Quick Launch GIS Map Button */}
              <Link
                to="/authority/map"
                className="w-full py-1.5 px-2 bg-white hover:bg-orange-50 text-slate-800 hover:text-[#ea580c] border border-slate-200 hover:border-orange-200 rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span>Launch GIS Command Map</span>
                <span className="group-hover:translate-x-0.5 transition-transform">🗺️</span>
              </Link>
            </div>

            {/* Officer Profile Row & Popover */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200/90 transition-all text-left cursor-pointer shadow-2xs hover:shadow-xs"
                aria-expanded={userDropdownOpen}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-[11px] shadow-xs flex-shrink-0">
                    AR
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate leading-tight flex items-center gap-1">
                      <span>{officerName}</span>
                      <ShieldCheck className="w-3 h-3 text-[#ea580c]" />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate pt-0.5">
                      Nodal Operations Officer
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180 text-slate-700' : ''}`} />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-40 text-xs space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Authority Controls
                  </div>
                  <Link
                    to="/authority/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jurisdiction Settings</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Citizen Portal View</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Authority</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </aside>

        {/* ========================================================
            MAIN WORKSPACE AREA
            - Header with breadcrumbs, location badge, search, actions
            - Body area (filling completely for Map, scrollable for others)
            ======================================================== */}
        <div className="flex-1 h-full flex flex-col min-w-0 bg-white overflow-hidden">
          
          {/* TOP HEADER */}
          <header className="h-12 border-b border-[#f0f2f5] px-4 sm:px-6 flex items-center justify-between flex-shrink-0 bg-white z-[var(--z-header)]">
            
            {/* Left: Mobile trigger + Back Button + Breadcrumbs + Ward */}
            <div className="flex items-center gap-2 text-xs text-[#6b7280] min-w-0">
              
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 rounded-lg text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg hover:bg-[#f3f4f6] text-[#4b5563] hover:text-[#111827] transition-colors"
                title="Go back"
                aria-label="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5 pl-1 truncate">
                <Link to="/authority/dashboard" className="hidden sm:flex items-center gap-1 font-medium text-[#4b5563] hover:text-[#111827]">
                  <span>Authority Command</span>
                </Link>
                <span className="text-[#9ca3af] hidden sm:inline">&gt;</span>
                <span className="flex items-center gap-1 font-semibold text-[#111827] truncate">
                  <span className="text-[#ea580c]">⚡</span>
                  <span className="truncate">{getBreadcrumbTitle()}</span>
                </span>
              </div>

              {/* Node Badge */}
              <div className="hidden md:flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#4b5563] text-[11px] font-medium border border-[#e5e7eb] flex-shrink-0">
                <Building2 className="w-3 h-3 text-[#ea580c]" />
                <span className="truncate">{wardName}</span>
              </div>

            </div>

            {/* Right: Search, Notifications, Demo Environment Tag */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-medium text-[#4b5563]">
              
              {/* Modern SaaS Command Palette Search Bar */}
              <div ref={searchContainerRef} className="relative hidden sm:block">
                <div className="flex items-center w-44 md:w-60 lg:w-72 h-8 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/15 transition-all px-2.5 gap-2 shadow-2xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={headerSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleHeaderSearch(e);
                      if (e.key === 'Escape') setIsSearchFocused(false);
                    }}
                    placeholder="Search tickets, squads, wards..."
                    className="w-full bg-transparent text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                  />

                  {headerSearch ? (
                    <button 
                      type="button" 
                      onClick={() => setHeaderSearch('')} 
                      className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      aria-label="Clear search input"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-medium font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                      ⌘K
                    </kbd>
                  )}
                </div>

                {/* Command Palette Dropdown on Focus */}
                {isSearchFocused && (
                  <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-2">
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <span>Command Incident Search</span>
                      <span className="font-mono text-[9px]">ESC to close</span>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-1 px-1">
                      {['Critical SLA', 'Unassigned', 'Overdue', 'Roads', 'Sanitation'].map((filterTag) => (
                        <button
                          key={filterTag}
                          type="button"
                          onClick={() => {
                            setHeaderSearch(filterTag);
                            navigate(`/authority/issues?q=${encodeURIComponent(filterTag)}`);
                            setIsSearchFocused(false);
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-[#ea580c] text-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          {filterTag}
                        </button>
                      ))}
                    </div>

                    {/* Real-time Incident Matches Preview */}
                    <div className="space-y-0.5 pt-1">
                      <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {headerSearch.trim() ? 'Matching Incidents' : 'Recent Queue Activity'}
                      </div>
                      {searchResults.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-500">
                          No matching tickets or squads found.
                        </div>
                      ) : (
                        searchResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectSearchIssue(item)}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                          >
                            <div className="min-w-0 pr-2 space-y-0.5">
                              <div className="font-semibold text-slate-900 text-xs truncate group-hover:text-[#ea580c] transition-colors">
                                {item.title}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate">
                                <span className="font-mono font-bold text-[#ea580c]">{item.id}</span>
                                <span>•</span>
                                <span className="truncate">📍 {item.locality || item.department}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                item.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200 font-bold' :
                                item.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {item.severity}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                {item.assignedTeam || 'Unassigned'}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {headerSearch.trim() && (
                      <div className="pt-1.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/authority/issues?q=${encodeURIComponent(headerSearch.trim())}`);
                          }}
                          className="w-full py-1.5 px-2 bg-orange-50 hover:bg-orange-100 text-[#ea580c] rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer"
                        >
                          View all results in incident queue for "{headerSearch}" →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Honest Demo State Badge */}
              <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fff7ed] border border-[#ffedd5] text-[#c2410c] text-[10px] font-medium font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                <span>Simulated Sandbox</span>
              </div>

              {/* Citizen Portal Link */}
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-[#f3f4f6] text-[#4b5563] hover:text-[#111827] transition-colors"
                title="Switch to Citizen Portal"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">Citizen Portal</span>
              </Link>

              {/* Notifications Pill */}
              <button
                type="button"
                onClick={() => showToast(`${overdueCount} incidents currently require SLA attention`)}
                className="relative p-1.5 rounded-md hover:bg-[#f3f4f6] text-[#4b5563] hover:text-[#111827] transition-colors cursor-pointer"
                title="SLA Alerts"
                aria-label={`SLA Alerts: ${overdueCount} overdue`}
              >
                <Bell className="w-4 h-4" />
                {overdueCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#ef4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {overdueCount}
                  </span>
                )}
              </button>

              {/* Officer Profile Avatar */}
              <Link
                to="/authority/settings"
                className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center hover:ring-2 hover:ring-[#ea580c] transition-all ml-1 shadow-xs"
                title="Officer Settings"
              >
                AR
              </Link>

            </div>

          </header>

          {/* MAIN CONTENT AREA */}
          <main className={`flex-1 min-w-0 ${
            isMapRoute 
              ? 'h-[calc(100%-3rem)] overflow-hidden p-0 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0' 
              : isAssignmentsRoute
              ? 'h-[calc(100%-3rem)] flex flex-col p-3 sm:p-5 lg:overflow-hidden overflow-y-auto space-y-3.5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-5'
              : 'overflow-y-auto px-4 sm:px-8 py-5 space-y-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-6'
          }`}>
            <Outlet context={{ 
              issues, 
              setIssues, 
              updateIssue: handleUpdateIssue,
              assignSquad: handleAssignSquad,
              openIssueDetail: (iss) => setSelectedIssue(iss),
              selectedIssue,
              setSelectedIssue,
              showToast,
              settings
            }} />
          </main>

        </div>

      </div>

      {/* Global Slide-in Issue Detail Drawer */}
      {selectedIssue && (
        <AuthorityIssueDetailDrawer
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdateIssue={handleUpdateIssue}
          onNavigateToMap={(iss) => {
            navigate(`/authority/map?issueId=${iss.id}`);
          }}
          showToast={showToast}
        />
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10 overflow-y-auto">
            <div className="space-y-4">
              
              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-orange-500/20">
                    <ShieldAlert className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block leading-tight">CivicFix AI</span>
                    <span className="text-[10px] text-[#ea580c] font-bold uppercase tracking-wider">Authority Portal</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSidebarSearchSubmit(sidebarSearch);
                      setMobileMenuOpen(false);
                    }
                  }}
                  placeholder="Search incidents or squads..."
                  className="w-full bg-slate-50 text-xs py-2 pl-8 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ea580c] font-medium"
                />
              </div>

              {/* Mobile Nav Links */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Command
                </div>
                {primaryOperationsNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive ? 'bg-orange-50 text-[#ea580c] border border-orange-200/60' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#ea580c]' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          item.badgeColor || 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="space-y-1 pt-1">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Governance
                </div>
                {secondaryGovernanceNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive ? 'bg-orange-50 text-[#ea580c] border border-orange-200/60' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#ea580c]' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Citizen Portal View</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                    Switch
                  </span>
                </Link>
              </div>

            </div>

            {/* Mobile Footer */}
            <div className="pt-3 border-t border-slate-200 space-y-2 mt-4">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  AR
                </div>
                <div className="truncate text-xs">
                  <div className="font-bold text-slate-900 truncate">{officerName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{wardName}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 rounded-xl hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          AUTHORITY OPERATIONS MOBILE BOTTOM NAVIGATION BAR
          - Operations-focused: Overview, Incident Queue, GIS Map, Squads, More
          - Respects device safe-area insets
          - Center map radar button for rapid field situational awareness
          ======================================================== */}
      <nav 
        aria-label="Authority Operations Navigation"
        className="fixed bottom-0 left-0 right-0 z-[var(--z-bottom-nav)] lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.3)] pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto px-2">
          {/* 1. Overview */}
          <Link
            to="/authority/dashboard"
            className={`flex flex-col items-center justify-center min-touch-target py-1 transition-all ${
              location.pathname === '/authority/dashboard' || location.pathname === '/authority'
                ? 'text-[#ea580c] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className={`w-5 h-5 transition-transform ${location.pathname === '/authority/dashboard' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Overview</span>
          </Link>

          {/* 2. Incident Queue */}
          <Link
            to="/authority/issues"
            className={`flex flex-col items-center justify-center min-touch-target py-1 relative transition-all ${
              location.pathname === '/authority/issues'
                ? 'text-[#ea580c] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ListOrdered className={`w-5 h-5 transition-transform ${location.pathname === '/authority/issues' ? 'scale-110' : ''}`} />
              {unassignedCount > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-[#ea580c] text-white text-[9px] font-mono font-bold px-1 rounded-full leading-tight">
                  {unassignedCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Queue</span>
          </Link>

          {/* 3. Hero Center Action: GIS Command Map */}
          <Link
            to="/authority/map"
            className="flex flex-col items-center justify-center -mt-5 group cursor-pointer"
            aria-label="GIS Command Map"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
              isMapRoute
                ? 'bg-gradient-to-tr from-[#ea580c] to-amber-500 text-white shadow-orange-500/40 ring-4 ring-orange-500/30'
                : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-slate-200 border border-slate-600 hover:scale-105'
            }`}>
              <Map className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className={`text-[10px] mt-0.5 font-bold ${
              isMapRoute ? 'text-[#ea580c]' : 'text-slate-300'
            }`}>
              GIS Map
            </span>
          </Link>

          {/* 4. Squad Assignments */}
          <Link
            to="/authority/assignments"
            className={`flex flex-col items-center justify-center min-touch-target py-1 transition-all ${
              location.pathname === '/authority/assignments'
                ? 'text-[#ea580c] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className={`w-5 h-5 transition-transform ${location.pathname === '/authority/assignments' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Squads</span>
          </Link>

          {/* 5. More / Settings Sheet Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center min-touch-target py-1 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            aria-label="Open authority menu and settings"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
