import React from 'react';
import { 
  Compass, 
  MapPin, 
  AlertTriangle, 
  Trash2, 
  Lightbulb, 
  Droplets, 
  Waves, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Building2,
  Layers,
  ArrowRight,
  Clock,
  UserCheck
} from 'lucide-react';

export default function CitizenOnboardingVisual({ currentStep }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-white overflow-hidden hero-warm-gradient select-none">
      
      {/* Dynamic ambient background glow circles */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-yellow-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-pink-600/30 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none" />

      {/* TOP HEADER: Brand Identity & Step Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-white shadow-xs">
          <Compass className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
          <span>Citizen Onboarding • Step 0{currentStep} of 04</span>
        </div>
        <span className="text-[11px] font-mono text-white/80 bg-black/20 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
          Ward 112 Gateway
        </span>
      </div>

      {/* ========================================================
          DISTINCT VISUAL IDENTITIES FOR EACH STEP
          ======================================================== */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        
        {/* STEP 1: WELCOME & PROFILE VISUAL
            - Refined abstract civic-inspired composition with layered organic shapes,
            - subtle dimensionality, and warm iridescent glow */}
        {currentStep === 1 && (
          <div className="w-full space-y-4 animate-fadeIn">
            {/* Abstract Organic Dimensional Composition */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Concentric rotating aura rings */}
              <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow opacity-60" />
              <div className="absolute inset-4 rounded-full border border-dashed border-yellow-300/40 animate-reverse-spin opacity-70" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-amber-300/30 via-pink-500/30 to-purple-500/20 blur-xl" />
              
              {/* Iridescent Transparent Core Sphere */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-white/30 via-white/10 to-transparent backdrop-blur-lg border border-white/40 shadow-2xl flex items-center justify-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300/40 via-[#ff5722]/50 to-pink-500/60 flex items-center justify-center shadow-inner">
                  <UserCheck className="w-9 h-9 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Floating accent badge */}
              <div className="absolute -bottom-2 bg-neutral-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-white shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Citizen Node</span>
              </div>
            </div>

            {/* Context Card */}
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/15 rounded-lg p-4 shadow-xl space-y-1.5 text-center">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#ffab40] font-semibold">
                CivicFix Citizen Protocol
              </div>
              <h3 className="text-sm font-bold text-white">
                Empowering Community Action
              </h3>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Connect directly to your local municipal ward for verified, transparent grievance triage.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION PREFERENCES VISUAL
            - Clean modern city / neighborhood architectural composition
            - Stylized vector skyline, avenue lines, and community ward marker */}
        {currentStep === 2 && (
          <div className="w-full space-y-4 animate-fadeIn">
            {/* Neighborhood Vector Graphic Container */}
            <div className="relative w-full aspect-[4/3] rounded-lg bg-neutral-950/70 backdrop-blur-md border border-white/20 p-4 overflow-hidden shadow-2xl flex flex-col justify-between">
              
              {/* Stylized Map Grid Lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

              {/* Top Telemetry */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/70 border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Spatial Grid Active
                </span>
                <span>Bengaluru East • Ward 112</span>
              </div>

              {/* Central Neighborhood Pin with Radar Rings */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-orange-400/30 animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff5722] to-amber-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-xs border border-white/15">
                    Indiranagar 100ft Corridor
                  </span>
                </div>
              </div>

              {/* Bottom Spatial Specs */}
              <div className="relative z-10 grid grid-cols-2 gap-2 text-[10px] font-mono text-white/80 bg-white/5 p-2 rounded border border-white/10">
                <div>
                  <span className="text-white/50 block text-[9px]">Municipal Ward</span>
                  <span className="font-semibold text-white">Ward 112</span>
                </div>
                <div className="text-right">
                  <span className="text-white/50 block text-[9px]">SLA Response Zone</span>
                  <span className="font-semibold text-emerald-300">Rapid 24h</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-white/80 px-2">
              <span>Manual street entry ensures your reports route instantly to local ward field crews.</span>
            </div>
          </div>
        )}

        {/* STEP 3: CIVIC INTERESTS VISUAL
            - Carefully arranged illustration of civic categories
            - road maintenance, sanitation, streetlights, drainage, water supply */}
        {currentStep === 3 && (
          <div className="w-full space-y-3.5 animate-fadeIn">
            {/* Category Cluster Box */}
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/15 rounded-lg p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#ffab40]" />
                  <span>Civic Infrastructure Matrix</span>
                </span>
                <span className="text-[10px] font-mono text-white/60">6 Monitored Streams</span>
              </div>

              {/* Miniature Category Matrix Display */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className="p-1 rounded bg-orange-500/20 text-[#ff7043]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-semibold text-white truncate">Road Surface</div>
                    <div className="text-[9px] text-white/50">Pothole triage</div>
                  </div>
                </div>

                <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-semibold text-white truncate">Sanitation</div>
                    <div className="text-[9px] text-white/50">Clean corridors</div>
                  </div>
                </div>

                <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className="p-1 rounded bg-amber-500/20 text-yellow-300">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-semibold text-white truncate">Streetlights</div>
                    <div className="text-[9px] text-white/50">Dark pole alerts</div>
                  </div>
                </div>

                <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className="p-1 rounded bg-blue-500/20 text-blue-300">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-semibold text-white truncate">Water Supply</div>
                    <div className="text-[9px] text-white/50">Leakage sensors</div>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center justify-between text-[10px] font-mono text-white/70">
                <span>AI Optical Classification:</span>
                <span className="text-emerald-300 font-bold">Enabled</span>
              </div>
            </div>

            <div className="text-center text-xs text-white/80 px-2">
              <span>Tailor your feed to track the specific public infrastructure that impacts your daily transit.</span>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & COMPLETION VISUAL
            - Polished report-tracking visual with clear progress timeline and refined completion state */}
        {currentStep === 4 && (
          <div className="w-full space-y-4 animate-fadeIn">
            <div className="bg-neutral-900/85 backdrop-blur-xl border border-white/20 rounded-lg p-5 shadow-2xl space-y-4">
              
              {/* Verified Badge Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Onboarding Completed</div>
                    <div className="text-[10px] font-mono text-white/60">Ready for Citizen Portal</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Ready
                </span>
              </div>

              {/* 4-Stage Resolution Lifecycle Preview */}
              <div className="space-y-2 text-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Incident Resolution Lifecycle
                </div>

                <div className="space-y-2 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-white/20">
                  <div className="relative flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -left-4 border-2 border-neutral-900" />
                    <span className="font-medium text-white text-[11px]">1. Photo Geotagged Intake</span>
                    <span className="text-[10px] font-mono text-emerald-300">Instant</span>
                  </div>

                  <div className="relative flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -left-4 border-2 border-neutral-900" />
                    <span className="font-medium text-white text-[11px]">2. AI Optical Triage & Deduplication</span>
                    <span className="text-[10px] font-mono text-emerald-300">&lt;6 mins</span>
                  </div>

                  <div className="relative flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full bg-[#ff7043] absolute -left-4 border-2 border-neutral-900" />
                    <span className="font-medium text-white text-[11px]">3. Field Squad Dispatch</span>
                    <span className="text-[10px] font-mono text-orange-300">Ward Squad</span>
                  </div>

                  <div className="relative flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full bg-yellow-400 absolute -left-4 border-2 border-neutral-900" />
                    <span className="font-medium text-white text-[11px]">4. Photographic Proof Sign-off</span>
                    <span className="text-[10px] font-mono text-yellow-300">Verified</span>
                  </div>
                </div>
              </div>

              {/* Micro stats banner */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-center font-mono text-xs">
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <div className="text-white font-bold text-sm">Ward 112</div>
                  <div className="text-[9px] text-white/50 uppercase">Assigned Node</div>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <div className="text-emerald-300 font-bold text-sm">Active</div>
                  <div className="text-[9px] text-white/50 uppercase">Portal Status</div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* BOTTOM FOOTER: Editorial Quote & Protocol Tag */}
      <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
        <span className="truncate max-w-[240px] sm:max-w-none">
          “Better cities start with verified, responsive reports.”
        </span>
        <span className="text-[10px] font-mono text-white/50 flex-shrink-0">
          CivicFix AI v2.4
        </span>
      </div>

    </div>
  );
}
