import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onOpenReportModal, variant = 'auto' }) {
  const [activeMenu, setActiveMenu] = useState(null); // 'product' | 'community' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null); // 'product' | 'community' | null
  const [scrolled, setScrolled] = useState(false);
  
  const navRef = useRef(null);
  const timeoutRef = useRef(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setMobileAccordion(null);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close mega menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key to close mega menus & mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth hover handlers with safe intent bridge
  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  return (
    <header 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4.5 px-3 sm:px-6 pointer-events-none transition-all duration-300"
    >
      {/* Floating White Capsule Container */}
      <div 
        className={`pointer-events-auto max-w-5xl mx-auto rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/80 transition-all duration-300 ${
          scrolled 
            ? 'shadow-[0_12px_32px_rgba(0,0,0,0.18)] py-2 sm:py-2.5 px-4 sm:px-6 bg-white' 
            : 'shadow-[0_8px_28px_rgba(0,0,0,0.12)] py-2 sm:py-2.5 px-4 sm:px-6'
        } flex items-center justify-between relative`}
      >
        
        {/* Left: Brand Wordmark */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 text-neutral-900 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5722] rounded-full pr-2"
          aria-label="CivicFix AI Home"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#ff5722] via-[#ff4081] to-[#ffab40] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
            CivicFix<span className="text-[#ff5722] font-semibold ml-0.5">AI</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links with Mega Menu Triggers */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-xs lg:text-[13px] font-medium text-neutral-600">
          
          {/* Product Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('product')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveMenu(activeMenu === 'product' ? null : 'product')}
              aria-haspopup="true"
              aria-expanded={activeMenu === 'product'}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5722] cursor-pointer ${
                activeMenu === 'product' || location.pathname === '/features'
                  ? 'text-neutral-950 font-semibold bg-neutral-100'
                  : 'hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <span>Product</span>
              <svg 
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${activeMenu === 'product' ? 'rotate-180 text-neutral-900' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* How It Works Direct Link */}
          <Link
            to="/how-it-works"
            className={`px-3 py-1.5 rounded-full transition-colors hover:text-neutral-900 hover:bg-neutral-100/70 ${
              location.pathname === '/how-it-works' ? 'text-neutral-950 font-semibold bg-neutral-100' : ''
            }`}
          >
            How It Works
          </Link>

          {/* Community Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('community')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveMenu(activeMenu === 'community' ? null : 'community')}
              aria-haspopup="true"
              aria-expanded={activeMenu === 'community'}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5722] cursor-pointer ${
                activeMenu === 'community' || location.pathname === '/community-impact'
                  ? 'text-neutral-950 font-semibold bg-neutral-100'
                  : 'hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <span>Community</span>
              <svg 
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${activeMenu === 'community' ? 'rotate-180 text-neutral-900' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* About Direct Link */}
          <Link
            to="/about"
            className={`px-3 py-1.5 rounded-full transition-colors hover:text-neutral-900 hover:bg-neutral-100/70 ${
              location.pathname === '/about' ? 'text-neutral-950 font-semibold bg-neutral-100' : ''
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right: Log In and Get Started Action Buttons */}
        <div className="hidden md:flex items-center space-x-2.5">
          <Link
            to="/login"
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
          >
            Log in
          </Link>

          <button
            onClick={onOpenReportModal}
            className="rounded-md bg-gradient-to-r from-[#ff5722] to-[#ff7043] text-white text-xs font-semibold px-4 py-2 shadow-xs hover:shadow-md hover:from-[#f4511e] hover:to-[#ff5722] active:scale-[0.99] transition-all tracking-wide cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5722]"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* ========================================================= */}
        {/* DESKTOP MEGA MENUS (Spanning clean card below capsule) */}
        {/* ========================================================= */}

        {/* 1. PRODUCT MEGA MENU */}
        {activeMenu === 'product' && (
          <div 
            className="hidden md:block absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[92vw] max-w-4xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            onMouseEnter={() => handleMouseEnter('product')}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="w-full rounded-2xl bg-white text-neutral-900 border border-neutral-200/90 shadow-2xl overflow-hidden p-7"
              role="menu"
              aria-label="Product Mega Menu"
            >
              <div className="grid grid-cols-12 gap-7 items-stretch">
                
                {/* Left Column: Editorial Feature & Custom Visual Preview */}
                <div className="col-span-5 bg-[#faf9f6] border border-neutral-200/70 rounded-md p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff5722] block">
                      The Platform
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-neutral-900 leading-snug">
                      Make civic issues easier to follow.
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      Discover how CivicFix AI helps communities report local problems and follow their progress in real time.
                    </p>
                  </div>

                  {/* Custom Product Preview Asset */}
                  <div className="rounded border border-neutral-200 overflow-hidden bg-white shadow-xs aspect-[4/3] relative">
                    <img
                      src="/images/mega_product.jpg"
                      alt="CivicFix AI interactive map and incident preview"
                      className="w-full h-full object-cover filter contrast-102"
                    />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-neutral-700 font-medium flex items-center justify-between border border-neutral-200/60">
                      <span>Incident Triage Active</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenReportModal();
                      }}
                      className="w-full text-center rounded-md bg-neutral-900 text-white text-xs font-semibold py-2.5 hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                    >
                      Open Live Demo Intake &rarr;
                    </button>
                  </div>
                </div>

                {/* Right Column: Navigation Links */}
                <div className="col-span-7 flex flex-col justify-between py-1 pl-2">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                      Platform Navigation
                    </span>

                    <div className="space-y-1">
                      
                      {/* Link 1: Platform Overview */}
                      <Link
                        to="/"
                        className="group p-2.5 rounded-md hover:bg-neutral-50 transition-colors flex items-start gap-3 border border-transparent hover:border-neutral-200/60"
                        role="menuitem"
                      >
                        <div className="w-7 h-7 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff5722] mt-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff5722] transition-colors flex items-center gap-1.5">
                            <span>Platform Overview</span>
                            <span className="text-xs text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                            Understand the CivicFix AI experience from citizen report to verified fix.
                          </div>
                        </div>
                      </Link>

                      {/* Link 2: Features */}
                      <Link
                        to="/features"
                        className="group p-2.5 rounded-md hover:bg-neutral-50 transition-colors flex items-start gap-3 border border-transparent hover:border-neutral-200/60"
                        role="menuitem"
                      >
                        <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mt-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff5722] transition-colors flex items-center gap-1.5">
                            <span>Features</span>
                            <span className="text-xs text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                            Explore reporting, classification, deduplication, and issue tracking.
                          </div>
                        </div>
                      </Link>

                      {/* Link 3: How It Works */}
                      <Link
                        to="/how-it-works"
                        className="group p-2.5 rounded-md hover:bg-neutral-50 transition-colors flex items-start gap-3 border border-transparent hover:border-neutral-200/60"
                        role="menuitem"
                      >
                        <div className="w-7 h-7 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mt-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff5722] transition-colors flex items-center gap-1.5">
                            <span>How It Works</span>
                            <span className="text-xs text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                            See how an infrastructure report moves through each verification stage.
                          </div>
                        </div>
                      </Link>

                      {/* Link 4: Report an Issue Action */}
                      <button
                        onClick={() => {
                          setActiveMenu(null);
                          onOpenReportModal();
                        }}
                        className="w-full text-left group p-2.5 rounded-md hover:bg-neutral-50 transition-colors flex items-start gap-3 border border-transparent hover:border-neutral-200/60 cursor-pointer"
                        role="menuitem"
                      >
                        <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mt-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff5722] transition-colors flex items-center gap-1.5">
                            <span>Report an Issue</span>
                            <span className="text-[9px] bg-[#ff5722]/10 text-[#ff5722] font-semibold px-1.5 py-0.2 rounded">Demo Intake</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                            Test the interactive client-side issue reporting flow.
                          </div>
                        </div>
                      </button>

                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>CivicFix AI • Platform Core</span>
                    <Link to="/about" className="hover:text-neutral-700 transition-colors">Operating Principles &rarr;</Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 2. COMMUNITY MEGA MENU */}
        {activeMenu === 'community' && (
          <div 
            className="hidden md:block absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[92vw] max-w-4xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            onMouseEnter={() => handleMouseEnter('community')}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="w-full rounded-2xl bg-white text-neutral-900 border border-neutral-200/90 shadow-2xl overflow-hidden p-7"
              role="menu"
              aria-label="Community Mega Menu"
            >
              <div className="grid grid-cols-12 gap-7 items-stretch">
                
                {/* Left Column: Featured Visual */}
                <div className="col-span-5 bg-[#faf9f6] border border-neutral-200/70 rounded-md p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff5722] block">
                      Community First
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-neutral-900 leading-snug">
                      Better neighbourhoods start with better information.
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      Explore how clearer reporting and traceable updates can help communities stay informed.
                    </p>
                  </div>

                  {/* Custom Community Visual Asset */}
                  <div className="rounded border border-neutral-200 overflow-hidden bg-white shadow-xs aspect-[4/3] relative">
                    <img
                      src="/images/mega_community.jpg"
                      alt="Indian residential neighborhood street in warm morning light"
                      className="w-full h-full object-cover filter contrast-102"
                    />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/65 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-white/90 font-medium">
                      Neighborhood Ground Truth
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-neutral-500">
                    Built for citizens, ward committees, and authorized municipal crews.
                  </div>
                </div>

                {/* Right Column: Community Navigation Links */}
                <div className="col-span-7 flex flex-col justify-between py-1 pl-2">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                      Community & Mission
                    </span>

                    <div className="space-y-1">
                      
                      {/* Link 1: Community Impact */}
                      <Link
                        to="/community-impact"
                        className="group p-2.5 rounded-md hover:bg-neutral-50 transition-colors flex items-start gap-3 border border-transparent hover:border-neutral-200/60"
                        role="menuitem"
                      >
                        <div className="w-7 h-7 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff5722] mt-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff5722] transition-colors flex items-center gap-1.5">
                            <span>Community Impact</span>
                            <span className="text-xs text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                            How organized reports reveal localized needs and eliminate duplicate dispatches.
                          </div>
                        </div>
                      </Link>

                      {/* Link 2: About CivicFix */}
                      <Link
                        to="/about"
                        className="group p-2.5 rounded-md hover:bg-neutral-50 transition-colors flex items-start gap-3 border border-transparent hover:border-neutral-200/60"
                        role="menuitem"
                      >
                        <div className="w-7 h-7 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mt-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff5722] transition-colors flex items-center gap-1.5">
                            <span>About CivicFix</span>
                            <span className="text-xs text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                            Our purpose, ethical AI principles, and open civic architecture.
                          </div>
                        </div>
                      </Link>

                      {/* Link 3: Contact & Support */}
                      <Link
                        to="/contact"
                        className="group p-2.5 rounded-md hover:bg-neutral-50 transition-colors flex items-start gap-3 border border-transparent hover:border-neutral-200/60"
                        role="menuitem"
                      >
                        <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mt-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff5722] transition-colors flex items-center gap-1.5">
                            <span>Contact & Support</span>
                            <span className="text-xs text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                            Connect with the team regarding platform inquiries and pilot deployments.
                          </div>
                        </div>
                      </Link>

                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <Link to="/accessibility" className="hover:text-neutral-700 transition-colors">
                      Accessibility Statement &rarr;
                    </Link>
                    <Link to="/privacy" className="hover:text-neutral-700 transition-colors">
                      Privacy Guidelines &rarr;
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MOBILE FLOATING MENU SHEET */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto max-w-5xl mx-auto mt-2 rounded-2xl bg-white text-neutral-900 border border-neutral-200/90 shadow-2xl p-5 space-y-4 animate-in fade-in max-h-[82vh] overflow-y-auto">
          
          {/* Mobile Accordion: Product */}
          <div className="border-b border-neutral-100 pb-2.5">
            <button
              onClick={() => setMobileAccordion(mobileAccordion === 'product' ? null : 'product')}
              className="w-full flex items-center justify-between text-sm font-bold text-neutral-900 py-1.5 focus:outline-none"
            >
              <span>Product</span>
              <svg 
                className={`w-4 h-4 text-neutral-500 transition-transform ${mobileAccordion === 'product' ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileAccordion === 'product' && (
              <div className="pl-3 py-2 space-y-2 text-xs text-neutral-600 border-l-2 border-[#ff5722] mt-1">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium text-neutral-900 hover:text-[#ff5722]">
                  Platform Overview
                </Link>
                <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium text-neutral-900 hover:text-[#ff5722]">
                  Features & AI Triage
                </Link>
                <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium text-neutral-900 hover:text-[#ff5722]">
                  How It Works (4 Phases)
                </Link>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReportModal();
                  }}
                  className="block py-1 font-semibold text-[#ff5722] text-left cursor-pointer"
                >
                  Report an Issue (Demo) &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Direct Link: How It Works */}
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2.5"
          >
            How It Works
          </Link>

          {/* Mobile Accordion: Community */}
          <div className="border-b border-neutral-100 pb-2.5">
            <button
              onClick={() => setMobileAccordion(mobileAccordion === 'community' ? null : 'community')}
              className="w-full flex items-center justify-between text-sm font-bold text-neutral-900 py-1.5 focus:outline-none"
            >
              <span>Community</span>
              <svg 
                className={`w-4 h-4 text-neutral-500 transition-transform ${mobileAccordion === 'community' ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileAccordion === 'community' && (
              <div className="pl-3 py-2 space-y-2 text-xs text-neutral-600 border-l-2 border-[#ffab40] mt-1">
                <Link to="/community-impact" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium text-neutral-900 hover:text-[#ff5722]">
                  Community Impact
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium text-neutral-900 hover:text-[#ff5722]">
                  About CivicFix
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium text-neutral-900 hover:text-[#ff5722]">
                  Contact & Support
                </Link>
                <Link to="/accessibility" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-neutral-500">
                  Accessibility Statement
                </Link>
              </div>
            )}
          </div>

          {/* Direct Link: About */}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2.5"
          >
            About CivicFix AI
          </Link>

          {/* Action CTAs */}
          <div className="pt-1 grid grid-cols-2 gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center rounded-md border border-neutral-300 text-neutral-900 text-xs font-semibold py-2.5 hover:bg-neutral-50 transition-colors"
            >
              Log in
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportModal();
              }}
              className="w-full text-center rounded-md bg-[#ff5722] text-white text-xs font-semibold py-2.5 shadow hover:bg-[#e64a19] transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
