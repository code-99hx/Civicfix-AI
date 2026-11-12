import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  MapPin, 
  Bell, 
  HelpCircle, 
  User, 
  Search, 
  ArrowLeft, 
  Share2, 
  PanelLeftClose, 
  ChevronDown, 
  Menu, 
  X,
  ShieldCheck,
  Sparkles,
  LogOut,
  Command,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  getDemoSession, 
  clearDemoSession, 
  getDemoReports, 
  getDemoNotifications, 
  getUnreadNotificationsCount,
  markDemoNotificationAsRead,
  markAllDemoNotificationsAsRead 
} from '../services/demoAuth';
import CitizenReportModal from '../components/CitizenReportModal';
import CitizenReportDetailDrawer from '../components/CitizenReportDetailDrawer';
import Toast from '../components/Toast';

export default function CitizenDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(getDemoSession());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reports, setReports] = useState(getDemoReports());
  const [notifications, setNotifications] = useState(getDemoNotifications());
  const [unreadCount, setUnreadCount] = useState(getUnreadNotificationsCount());
  const [selectedDrawerReport, setSelectedDrawerReport] = useState(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [headerSearch, setHeaderSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [toast, setToast] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const s = getDemoSession();
    setSession(s);
    setReports(getDemoReports());
    setNotifications(getDemoNotifications());
    setUnreadCount(getUnreadNotificationsCount());
  }, [location.pathname]);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to trigger SaaS Search Bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside search container to close dropdown
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

  const handleReportCreated = (updatedReports) => {
    setReports(updatedReports);
    setNotifications(getDemoNotifications());
    setUnreadCount(getUnreadNotificationsCount());
    showToast('New civic report recorded in demo sandbox.');
  };

  const handleMarkNotificationRead = (id) => {
    const updated = markDemoNotificationAsRead(id);
    setNotifications(updated);
    setUnreadCount(getUnreadNotificationsCount());
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = markAllDemoNotificationsAsRead();
    setNotifications(updated);
    setUnreadCount(0);
    showToast('All notifications marked as read.');
  };

  const citizenName = session?.user?.name || 'Jessica Parker';
  const citizenWard = session?.citizenProfile?.ward || 'Ward 112 • Indiranagar';

  // Navigation Items split into sections
  const coreWorkspaceNav = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Reports', path: '/dashboard/reports', icon: FileText, badge: `${reports.length}` },
    { name: 'Report an Issue', path: '/dashboard/report-issue', icon: PlusCircle, badge: 'New', isHighlight: true },
    { name: 'Nearby Issues', path: '/dashboard/nearby', icon: MapPin, badge: '4' },
  ];

  const communitySupportNav = [
    { 
      name: 'Notifications', 
      path: '/dashboard/notifications', 
      icon: Bell, 
      badge: unreadCount > 0 ? `${unreadCount}` : null, 
      badgeColor: 'bg-red-500 text-white' 
    },
    { name: 'Help & FAQs', path: '/dashboard/help', icon: HelpCircle },
    { name: 'Profile & Settings', path: '/dashboard/profile', icon: User },
  ];

  // Dynamic breadcrumb label
  const getBreadcrumbTitle = () => {
    if (location.pathname === '/dashboard') return 'Overview';
    if (location.pathname === '/dashboard/reports') return 'My Reports';
    if (location.pathname === '/dashboard/report-issue') return 'Report an Issue';
    if (location.pathname === '/dashboard/nearby') return 'Nearby Issues';
    if (location.pathname === '/dashboard/notifications') return 'Notifications';
    if (location.pathname === '/dashboard/help') return 'Help & FAQs';
    if (location.pathname === '/dashboard/profile') return 'Profile & Settings';
    return 'Workspace';
  };

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    setIsSearchFocused(false);
    navigate(`/dashboard/reports?q=${encodeURIComponent(query.trim())}`);
  };

  // Search suggestions based on query
  const searchSuggestions = reports
    .filter(r => !headerSearch || r.title.toLowerCase().includes(headerSearch.toLowerCase()) || r.category.toLowerCase().includes(headerSearch.toLowerCase()))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-100/80 p-0 sm:p-3 lg:p-4 font-sans antialiased text-slate-900 flex items-center justify-center selection:bg-orange-500 selection:text-white">
      
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Container Card */}
      <div className="w-full max-w-[1540px] h-[100dvh] sm:h-[calc(100dvh-2rem)] max-h-[100dvh] sm:max-h-[1050px] bg-white sm:rounded-3xl border border-slate-200/90 shadow-2xl flex overflow-hidden relative">
        
        {/* ========================================================
            PREMIUM DESKTOP SIDEBAR
            - Width: 248px (w-[248px]) for optimal breathing room
            - Elegant subtle border & clean layout
            - Modern group headers, high-contrast active indicator
            - Ward 112 Citizen Hub card & Profile card
            ======================================================== */}
        <aside 
          className="hidden lg:flex lg:flex-col w-[248px] h-full bg-slate-50/50 border-r border-slate-200/80 z-30 select-none overflow-hidden justify-between p-4 box-border flex-shrink-0"
          aria-label="Desktop Sidebar"
        >
          {/* Top Section: Brand + Filter + Grouped Navigation */}
          <div className="space-y-4 flex-shrink-0">
            
            {/* Brand Logo Row */}
            <div className="flex items-center justify-between px-1 pt-1">
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                {/* CivicFix Emblem with vibrant gradient and subtle glow */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[15px] tracking-tight text-slate-900 leading-none">
                      CivicFix
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 leading-none">
                      AI
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase pt-1">
                    Citizen Portal • Ward 112
                  </span>
                </div>
              </Link>

              {/* Sidebar lock action */}
              <button 
                type="button" 
                onClick={() => showToast('Sidebar locked in unified layout')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Sidebar view locked"
                aria-label="Toggle sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter Pill */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit(sidebarSearch);
                }}
                placeholder="Jump to report..."
                className="w-full bg-white text-xs py-1.5 pl-8 pr-7 rounded-xl text-slate-900 placeholder-slate-400 border border-slate-200/90 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 focus:outline-none transition-all font-medium shadow-2xs"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                ↵
              </span>
            </div>

            {/* Navigation Section 1: CORE WORKSPACE */}
            <div className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Workspace
              </div>
              <nav className="space-y-1" aria-label="Core navigation">
                {coreWorkspaceNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-orange-50/90 text-orange-950 shadow-xs border border-orange-200/70'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          item.badgeColor || (isActive ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-200/80 text-slate-700')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Navigation Section 2: COMMUNITY & SETTINGS */}
            <div className="space-y-1 pt-1">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Engagement & Support
              </div>
              <nav className="space-y-1" aria-label="Community navigation">
                {communitySupportNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-orange-50/90 text-orange-950 shadow-xs border border-orange-200/70'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-orange-600' : 'text-slate-400'
                        }`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          item.badgeColor || (isActive ? 'bg-orange-600 text-white' : 'bg-slate-200/80 text-slate-700')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

          </div>

          {/* Bottom Section: Ward Hub Card + User Profile Card */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80 flex-shrink-0">
            
            {/* Ward 112 Citizen Hub Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-3.5 space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-200">Ward 112 Radar</span>
                </div>
                <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.2 rounded text-slate-300">
                  Active SLA
                </span>
              </div>

              <div>
                <div className="text-[11px] text-slate-300">
                  <span className="font-bold text-white">{reports.length}</span> active grievances tracked
                </div>
                {/* Sleek Gradient SLA Progress Bar */}
                <div className="w-full bg-white/15 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-emerald-400 h-full w-[88%] rounded-full" />
                </div>
              </div>

              {/* Action Button: Quick Report Modal */}
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="w-full py-2 px-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </button>
            </div>

            {/* Profile Row with Dropdown toggle */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 transition-all text-left cursor-pointer shadow-2xs"
                aria-expanded={userDropdownOpen}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src="/images/feature_01.jpg"
                      alt={citizenName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                      {citizenName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {citizenWard}
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 text-xs space-y-0.5 animate-fadeIn">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Citizen Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/help"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Help & FAQs</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </aside>

        {/* ========================================================
            MAIN WORKSPACE AREA
            - Header with breadcrumbs, location badge, SAAS COMMAND SEARCH, actions
            - Scrollable main content region
            ======================================================== */}
        <div className="flex-1 h-full flex flex-col min-w-0 bg-white overflow-hidden">
          
          {/* ======================================================
              TOP NAVBAR: Breadcrumbs, Location, SaaS Command Search, Actions
              ====================================================== */}
          <header className="h-14 border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 bg-white/90 backdrop-blur-md z-20">
            
            {/* Left: Mobile Drawer Trigger + Back Button + Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Back Arrow Button */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Go back"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Mobile Page Title */}
              <span className="sm:hidden font-bold text-slate-900 text-sm truncate max-w-[130px]">
                {getBreadcrumbTitle()}
              </span>

              {/* Breadcrumbs */}
              <div className="hidden sm:flex items-center gap-2 pl-1">
                <Link to="/dashboard" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  Workspace
                </Link>
                <span className="text-slate-300">/</span>
                <span className="flex items-center gap-1.5 font-bold text-slate-900">
                  <span className="text-orange-600">●</span>
                  <span>{getBreadcrumbTitle()}</span>
                </span>
              </div>

              {/* Ward Location Tag */}
              <div className="hidden xl:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                <MapPin className="w-3 h-3 text-orange-600" />
                <span>{citizenWard}</span>
              </div>

            </div>

            {/* Right: SaaS Command Search Bar, Notifications, Share & Report Button */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium text-slate-600">
              
              {/* SAAS COMMAND PALETTE SEARCH BAR */}
              <div ref={searchContainerRef} className="relative hidden sm:block">
                <div className="flex items-center sm:w-60 md:w-72 lg:w-96 h-9 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all px-3 gap-2 shadow-2xs">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={headerSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchSubmit(headerSearch);
                      if (e.key === 'Escape') setIsSearchFocused(false);
                    }}
                    placeholder="Search issues, wards, or tickets..."
                    className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                  />

                  {headerSearch ? (
                    <button 
                      type="button" 
                      onClick={() => setHeaderSearch('')} 
                      className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium font-mono text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
                      ⌘K
                    </kbd>
                  )}
                </div>

                {/* SaaS Command Palette Dropdown on Focus */}
                {isSearchFocused && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-fadeIn space-y-2">
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <span>Quick Navigation & Filter</span>
                      <span className="font-mono">ESC to close</span>
                    </div>

                    {/* Pre-filtered Quick Filters */}
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {['Potholes', 'Sanitation', 'Streetlights', 'Water Leaks'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setHeaderSearch(cat);
                            handleSearchSubmit(cat);
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Matching Ticket Results Preview */}
                    <div className="space-y-1 pt-1">
                      <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Recent Reports
                      </div>
                      {searchSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSelectedDrawerReport(item);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-slate-800 text-xs truncate group-hover:text-orange-600">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {item.id} • {item.location}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex-shrink-0">
                            {item.status}
                          </span>
                        </button>
                      ))}
                    </div>

                    {headerSearch.trim() && (
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit(headerSearch)}
                          className="w-full py-1.5 px-2 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer"
                        >
                          Search all reports for "{headerSearch}" →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notifications Action */}
              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Notifications"
                aria-label={`Notifications, ${unreadCount} unread`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Share Action */}
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Citizen workspace link copied.');
                  }
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </button>

              {/* Primary Report Button (Hidden on mobile where bottom nav center button is primary) */}
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-orange-500/20 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </button>

              {/* Profile Avatar Quick Link */}
              <Link
                to="/dashboard/profile"
                className="p-0.5 rounded-full hover:ring-2 hover:ring-orange-500 transition-all ml-1 min-touch-target flex items-center justify-center"
                title="My Profile"
              >
                <img
                  src="/images/feature_01.jpg"
                  alt={citizenName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
              </Link>

            </div>

          </header>

          {/* ======================================================
              SCROLLABLE MAIN CONTENT REGION
              - Responsive bottom padding so mobile navigation never covers content
              ====================================================== */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-6">
            <Outlet context={{ 
              reports, 
              setReports, 
              notifications,
              setNotifications,
              unreadCount,
              markNotificationRead: handleMarkNotificationRead,
              markAllNotificationsRead: handleMarkAllNotificationsRead,
              openReportModal: () => setReportModalOpen(true),
              openReportDrawer: (report) => setSelectedDrawerReport(report),
              showToast
            }} />
          </main>

        </div>

      </div>

      {/* Slide-in Detailed Report Drawer */}
      <CitizenReportDetailDrawer
        report={selectedDrawerReport}
        onClose={() => setSelectedDrawerReport(null)}
        showToast={showToast}
      />

      {/* Global Citizen Report Intake Modal (Redesigned with Image Upload) */}
      <CitizenReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReportCreated={handleReportCreated}
      />

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-fadeIn">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block leading-tight">CivicFix AI</span>
                    <span className="text-[10px] text-orange-600 font-semibold">Citizen Portal</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Core Workspace */}
              <div className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Workspace
                </div>
                <nav className="space-y-1">
                  {coreWorkspaceNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive ? 'bg-orange-50 text-orange-950 border border-orange-200' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            item.badgeColor || 'bg-slate-200 text-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Community & Settings */}
              <div className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Support & Profile
                </div>
                <nav className="space-y-1">
                  {communitySupportNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive ? 'bg-orange-50 text-orange-950 border border-orange-200' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            item.badgeColor || 'bg-slate-200 text-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2.5 px-2 py-1">
                <img
                  src="/images/feature_01.jpg"
                  alt={citizenName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="truncate text-xs">
                  <div className="font-bold text-slate-900 truncate">{citizenName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{citizenWard}</div>
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
          MOBILE-FIRST FIXED BOTTOM NAVIGATION BAR
          - Optimized for single-handed thumb operation
          - Respects device safe-areas (e.g. iPhone home bar)
          - Elevated center primary pill for "Report Issue"
          ======================================================== */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-[var(--z-bottom-nav)] lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto px-2">
          {/* 1. Home */}
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center min-touch-target py-1 transition-all ${
              location.pathname === '/dashboard' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 transition-transform ${location.pathname === '/dashboard' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </Link>

          {/* 2. My Reports */}
          <Link
            to="/dashboard/reports"
            className={`flex flex-col items-center justify-center min-touch-target py-1 relative transition-all ${
              location.pathname === '/dashboard/reports' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <FileText className={`w-5 h-5 transition-transform ${location.pathname === '/dashboard/reports' ? 'scale-110' : ''}`} />
              {reports.length > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-slate-900 text-white text-[9px] font-mono font-bold px-1 rounded-full leading-tight">
                  {reports.length}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Reports</span>
          </Link>

          {/* 3. Hero Center Action: Report an Issue */}
          <Link
            to="/dashboard/report-issue"
            className="flex flex-col items-center justify-center -mt-5 group cursor-pointer"
            aria-label="Report a civic grievance"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
              location.pathname === '/dashboard/report-issue'
                ? 'bg-gradient-to-tr from-orange-600 to-orange-500 text-white shadow-orange-500/40 ring-4 ring-orange-500/20'
                : 'bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-orange-500/30 hover:scale-105'
            }`}>
              <PlusCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className={`text-[10px] mt-0.5 font-bold ${
              location.pathname === '/dashboard/report-issue' ? 'text-orange-600' : 'text-slate-700'
            }`}>
              Report
            </span>
          </Link>

          {/* 4. Nearby Map */}
          <Link
            to="/dashboard/nearby"
            className={`flex flex-col items-center justify-center min-touch-target py-1 transition-all ${
              location.pathname === '/dashboard/nearby' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className={`w-5 h-5 transition-transform ${location.pathname === '/dashboard/nearby' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Nearby</span>
          </Link>

          {/* 5. Profile & Settings */}
          <Link
            to="/dashboard/profile"
            className={`flex flex-col items-center justify-center min-touch-target py-1 transition-all ${
              location.pathname === '/dashboard/profile' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className={`w-5 h-5 transition-transform ${location.pathname === '/dashboard/profile' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
          </Link>
        </div>
      </nav>

    </div>
  );
}
