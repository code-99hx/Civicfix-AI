import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Compass, Sparkles } from 'lucide-react';

export default function HeroSection({ onOpenReportModal, onScrollToFeatures }) {
  return (
    <section className="relative min-h-[94vh] lg:min-h-[100vh] hero-warm-gradient overflow-hidden flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 select-none">
      
      {/* Ambient background illumination circles */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-orange-400/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-pink-500/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-yellow-400/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Signature Organic Iridescent 3D Hero Object Layer */}
      <div 
        className="absolute top-[3%] -right-16 sm:-right-6 lg:right-[2%] xl:right-[7%] w-[360px] sm:w-[500px] lg:w-[620px] xl:w-[700px] aspect-square pointer-events-none select-none z-10 animate-float-slow"
        aria-hidden="true"
      >
        {/* Soft Multi-hued Ambient Glow Behind Membrane */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-400/25 via-pink-500/30 to-amber-300/35 blur-[55px] opacity-75" />
        
        {/* The Transparent 3D Rainbow Iridescent Sphere Object */}
        <img
          src="/images/rainbow_sphere.png"
          alt=""
          className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(255,100,60,0.35)] opacity-85"
        />

        {/* Subtle luminous edge highlight ring */}
        <div className="absolute inset-8 rounded-full border border-white/30 pointer-events-none opacity-40 shadow-[inset_0_0_40px_rgba(255,255,255,0.25)]" />
      </div>

      {/* Main Content Region with Grid Layout */}
      <div className="max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-10 relative z-20 flex-grow flex flex-col justify-center my-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          
          {/* Left Column: Authoritative Typography & Main Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 max-w-2xl">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold uppercase tracking-widest shadow-xs">
              <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
              <span>AI-Powered Civic Intelligence</span>
            </div>

            {/* Headline with deliberate line breaks and illuminated emphasis */}
            <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.04em] text-white leading-[1.04]">
              Better Streets.<br />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-pink-100 drop-shadow-sm">
                Stronger Communities.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl leading-relaxed font-normal pt-0.5 drop-shadow-xs">
              Report local problems, track every update, and help communities move from complaints to meaningful action with verified municipal routing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenReportModal}
                className="rounded-md bg-white text-neutral-900 text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3.5 shadow-lg hover:bg-neutral-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Report an Issue
              </button>

              <button
                onClick={onScrollToFeatures}
                className="rounded-md bg-black/25 backdrop-blur-md border border-white/40 text-white text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3.5 hover:bg-black/40 hover:border-white transition-all duration-200 cursor-pointer"
              >
                Explore the Platform
              </button>
            </div>

            {/* Restrained Trust Line */}
            <div className="pt-2 flex items-center gap-5 text-white/85 text-[11px] font-medium tracking-wider uppercase">
              <span>Report. Track. Resolve.</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span className="text-white/75">Verified Civic Routing</span>
            </div>

          </div>

          {/* Right Column (Bottom-Right Area): Slim Interactive Floating Report an Issue CTA */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-end w-full pt-6 lg:pt-0">
            <button
              type="button"
              onClick={onOpenReportModal}
              aria-label="Report a civic infrastructure issue"
              className="group relative inline-flex items-center gap-3.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-md bg-white/95 hover:bg-white text-neutral-900 border border-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_40px_rgba(255,98,67,0.28)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff5722] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ff6b4a] backdrop-blur-md"
            >
              {/* Micro Live Radar Pulse Indicator */}
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5722] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff5722]" />
              </span>

              {/* Brand-Accented Report/Plus Icon */}
              <div className="w-7 h-7 rounded-sm bg-gradient-to-tr from-[#ff5722] to-[#ffab40] flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(255,87,34,0.5)] transition-all duration-200 flex-shrink-0">
                <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>

              {/* Label & Micro Context */}
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-[#ff5722] transition-colors">
                  <span>Report an Issue</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#ff5722] group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <span className="block text-[10px] text-neutral-500 font-medium">
                  Ward 112 • Instant AI Triage
                </span>
              </div>
            </button>
          </div>

        </div>

      </div>

      {/* Subtle bottom telemetry bar */}
      <div className="max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-10 relative z-20 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/80 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Node: Active</span>
          </span>
          <span className="text-white/40">|</span>
          <span>4 Active Municipal Squads Online</span>
        </div>
        <span className="text-white/60 text-[11px]">
          Transparent Public Infrastructure Protocol
        </span>
      </div>

    </section>
  );
}
