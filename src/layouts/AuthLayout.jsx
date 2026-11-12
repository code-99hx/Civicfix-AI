import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ 
  children, 
  visualQuote = "Every report can help move a community forward.", 
  visualSub = "Report. Track. Resolve.",
  decorativeVisual = null 
}) {
  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-[#0d0d11] box-border">
      
      {/* Form Panel (Light / Warm-White Surface) */}
      <div className="w-full md:w-[50%] lg:w-[46%] xl:w-[42%] h-full flex flex-col justify-between bg-[#fcfbf9] text-neutral-900 px-6 sm:px-10 lg:px-12 py-5 sm:py-7 overflow-y-auto z-20">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-1 flex-shrink-0">
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-md"
            aria-label="CivicFix AI Home"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-[#ff5722] via-[#ff4081] to-[#ffab40] flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              CivicFix<span className="text-[#ff5722] font-semibold ml-0.5">AI</span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 font-medium"
          >
            <span>Back to site</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Center: Dynamic Form Slot */}
        <div className="my-auto py-2 sm:py-4 max-w-md w-full mx-auto flex-grow flex flex-col justify-center">
          {children}
        </div>

        {/* Subtle Footer Meta */}
        <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-200/80 flex-shrink-0">
          <span>&copy; {new Date().getFullYear()} CivicFix AI</span>
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="hover:text-neutral-700 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-neutral-700 transition-colors">Terms</Link>
          </div>
        </div>

      </div>

      {/* Visual Decorative Panel (Warm Gradient) */}
      <div className="hidden md:flex md:w-[50%] lg:w-[54%] xl:w-[58%] h-full hero-warm-gradient relative overflow-hidden flex-col justify-between p-8 lg:p-14 text-white z-10">
        
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-yellow-400/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 -left-10 w-[400px] h-[400px] bg-pink-600/30 rounded-full blur-[90px] pointer-events-none" />

        {/* Decorative Visual Slot: Either Custom 2D Artwork or Default Sphere */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none select-none z-10">
          {decorativeVisual ? (
            decorativeVisual
          ) : (
            <div className="w-[420px] lg:w-[560px] xl:w-[640px] aspect-square animate-float-slow">
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-400/20 via-pink-500/25 to-yellow-300/30 blur-[45px] opacity-70" />
              <img
                src="/images/rainbow_sphere.png"
                alt="Luminous rainbow iridescent bubble reflection"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(255,100,60,0.35)] opacity-85"
              />
            </div>
          )}
        </div>

        {/* Top Tag */}
        <div className="relative z-20 flex justify-end">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/15 backdrop-blur-md border border-white/25 text-xs text-white font-medium uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
            <span>Civic Intelligence Network</span>
          </div>
        </div>

        {/* Bottom Editorial Copy & Subtle Preview Badge */}
        <div className="relative z-20 max-w-lg space-y-3">
          <p className="text-2xl sm:text-3xl font-light text-white leading-tight tracking-tight drop-shadow-sm">
            “{visualQuote}”
          </p>

          <div className="flex items-center gap-4 text-xs tracking-wider uppercase text-white/85">
            <span>{visualSub}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="text-white/70">Verified Reporting</span>
          </div>

          {/* Small Sample Interface Badge */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2.5 p-2 rounded-md bg-black/30 backdrop-blur-md border border-white/20 text-xs text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Ward 112 Triage Hub: Active Node</span>
              <span className="text-[10px] text-white/50 font-mono pl-2 border-l border-white/20">GPS Auto-Lock</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
