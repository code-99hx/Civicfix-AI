import React from 'react';
import { 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export default function VisualWorkflowIntro({ onOpenReportModal }) {
  return (
    <section 
      id="workflow-intro" 
      aria-label="CivicFix AI Workflow Overview"
      className="bg-white text-neutral-900 py-16 sm:py-24 border-b border-neutral-200/80 relative overflow-hidden"
    >
      {/* Subtle warm ambient background glow for natural transition from hero */}
      <div 
        className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-[#ff6243]/08 via-[#fca311]/04 to-transparent rounded-full blur-[100px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#ea580c] text-xs font-semibold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Connected Civic Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-neutral-900 leading-[1.12]">
            How CivicFix AI Bridges Citizens & City Operations
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl">
            A single, unified municipal intelligence platform where citizen observations immediately transform into prioritized, verified field work orders.
          </p>
        </div>

        {/* Feature Spotlight Grid: PNG Map Operations Visual + 3 Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Custom PNG Map Operations Illustration */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-2 sm:p-3 shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden group hover:shadow-xl transition-all duration-300">
              
              {/* Actual Custom PNG Map Operations Graphic */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-neutral-200/70 relative">
                <img 
                  src="/images/civicfix-map-illustration.png" 
                  alt="Civic GIS operations overview showing city street grid, incident markers, and cluster hotspots"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="eager"
                />
              </div>

              {/* Floating Highlight Banner */}
              <div className="mt-3 p-3 sm:p-4 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-neutral-800">
                    Live GIS Operations Matrix • Ward 112 Node Active
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#ea580c] font-bold">
                  Cluster Hotspot Engine
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Core Pillars of the CivicFix Loop */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Pillar 1 */}
            <div className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 hover:bg-white hover:border-orange-300/80 hover:shadow-md transition-all duration-200 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-[#ea580c] flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  Instant Geotagged Intake
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pl-11">
                Citizens report potholes, dark streetlights, or drainage issues in under 30 seconds with automatic GPS coordinate capture.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 hover:bg-white hover:border-orange-300/80 hover:shadow-md transition-all duration-200 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  Algorithmic Ward Triage
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pl-11">
                Spatial radius filtering detects duplicate reports within 50 meters, prioritizing urgent public hazards automatically.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 hover:bg-white hover:border-orange-300/80 hover:shadow-md transition-all duration-200 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  Accountable Field Resolution
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pl-11">
                Field squads are dispatched with defined SLA countdowns. Every repair concludes with photo verification and citizen updates.
              </p>
            </div>

            {/* Direct Action */}
            <div className="pt-2 pl-2">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#ff6243] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Report an Issue Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
