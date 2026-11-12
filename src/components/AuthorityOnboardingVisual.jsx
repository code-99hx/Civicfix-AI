import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Compass,
  FileCheck2,
  Users,
  Briefcase,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function AuthorityOnboardingVisual({ currentStep }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-white overflow-hidden bg-gradient-to-br from-[#121217] via-[#1a171e] to-[#0f1115] select-none">
      
      {/* Subtle warm orange & coral operational ambient lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5722]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/15 rounded-full blur-[90px] pointer-events-none" />

      {/* TOP BAR: Header Tag & Security Status */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide text-white shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff7043]" />
          <span>Authority Dispatch Network • Step 0{currentStep} of 04</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          ● SECURE GOV CHANNEL
        </span>
      </div>

      {/* ========================================================
          DISTINCT VISUAL IDENTITIES FOR EACH STEP
          ======================================================== */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        
        {/* STEP 1: ORGANIZATION VISUAL
            - Institutional municipal authority crest / insignia */}
        {currentStep === 1 && (
          <div className="w-full space-y-4 animate-fadeIn">
            {/* Emblem Box */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-dashed border-white/20" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#ff5722]/20 via-pink-500/20 to-amber-500/10 blur-xl" />
              
              <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-tr from-white/15 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center justify-center p-3">
                <Building2 className="w-10 h-10 text-[#ff7043] drop-shadow-md" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/80 mt-1">BBMP GOV</span>
              </div>
            </div>

            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/15 rounded-lg p-4 shadow-xl space-y-1.5 text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#ffab40] font-semibold">
                Institutional Civic Gateway
              </div>
              <h3 className="text-sm font-bold text-white">
                Municipal Corporation Access
              </h3>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Connect your engineering divisions directly to citizen verified incident telemetry.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: DEPARTMENT & ROLE VISUAL
            - Departmental operational matrix, executive engineering role badge */}
        {currentStep === 2 && (
          <div className="w-full space-y-3.5 animate-fadeIn">
            <div className="bg-neutral-900/85 backdrop-blur-xl border border-white/15 rounded-lg p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#ffab40]" />
                  <span>Division Credential Matrix</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Authorized Officer</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Operational Unit</span>
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Roads & Infrastructure Squad</span>
                    <span className="text-[10px] text-orange-400 font-mono">Squad Delta</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Dispatch Designation</span>
                  <div className="font-bold text-white">
                    Assistant Executive Engineer (AEE)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono text-white/70 pt-1">
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <span className="block text-white font-bold text-xs">Level 4</span>
                  <span>Triage Authority</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <span className="block text-emerald-300 font-bold text-xs">Direct BBMP</span>
                  <span>Field Routing</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-white/80 px-2">
              <span>Supervisors receive instant notifications when priority potholes or hazards are reported.</span>
            </div>
          </div>
        )}

        {/* STEP 3: JURISDICTION VISUAL
            - Ward zoning grid map, territory boundary polygons */}
        {currentStep === 3 && (
          <div className="w-full space-y-3.5 animate-fadeIn">
            <div className="relative w-full aspect-[4/3] rounded-lg bg-neutral-950/80 backdrop-blur-md border border-white/20 p-4 overflow-hidden shadow-2xl flex flex-col justify-between">
              
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/70 border-b border-white/10 pb-2">
                <span className="text-orange-400">Territory Jurisdiction</span>
                <span>Bengaluru East • Zone East</span>
              </div>

              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-xl border border-orange-500/30 animate-pulse absolute" />
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#ff5722] to-amber-500 flex items-center justify-center shadow-lg border border-white/30">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="mt-2 text-xs font-bold text-white bg-black/60 px-3 py-0.5 rounded backdrop-blur-xs border border-white/15">
                  Ward 112 Boundary (Indiranagar)
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-2 text-[10px] font-mono text-white/80 bg-white/5 p-2 rounded border border-white/10">
                <div>
                  <span className="text-white/50 block text-[9px]">Road Network</span>
                  <span className="font-semibold text-white">48.2 km Arterial</span>
                </div>
                <div className="text-right">
                  <span className="text-white/50 block text-[9px]">Active Squads</span>
                  <span className="font-semibold text-emerald-300">4 Crews</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-white/80 px-2">
              <span>Grievances submitted inside your ward boundary populate your dispatch queue in real-time.</span>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & REQUEST ACCESS VISUAL
            - Dispatch console approval badge, pending municipal clearance badge */}
        {currentStep === 4 && (
          <div className="w-full space-y-4 animate-fadeIn">
            <div className="bg-neutral-900/85 backdrop-blur-xl border border-white/20 rounded-lg p-5 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Credentials Recorded</div>
                    <div className="text-[10px] font-mono text-white/60">Simulated Access Ready</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Demo Evaluation
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Assigned Command</span>
                  <div className="font-semibold text-white">
                    BBMP Ward 112 Triage Console
                  </div>
                </div>

                <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Automated Dispatch</span>
                  <div className="text-neutral-300 text-[11px]">
                    Integrated with optical duplicate clustering and field squad work orders.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-200">
                Demo clearance active. You will enter the Authority Dashboard with preloaded sample roadwork incidents.
              </div>

            </div>
          </div>
        )}

      </div>

      {/* BOTTOM FOOTER */}
      <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
        <span>“Accelerating municipal triage with verified intelligence.”</span>
        <span className="text-[10px] font-mono text-white/50">Gov Protocol v2.4</span>
      </div>

    </div>
  );
}
