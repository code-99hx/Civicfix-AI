import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BuiltForCivicActionSection() {
  return (
    <section 
      id="civic-action" 
      aria-label="Built for Transparent Civic Action"
      className="bg-white text-neutral-900 py-20 sm:py-28 border-b border-neutral-200/80 relative overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#ea580c] text-xs font-semibold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Platform Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-neutral-900 leading-[1.12]">
            Built for Transparent Civic Action
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl">
            Practical, accountable civic technology designed to keep communities informed and empower municipal operations teams with actionable ground truth.
          </p>
        </div>

        {/* 4 Carefully Designed Visual Product Blocks (2x2 Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* BLOCK 1: Clear Issue Tracking (For Citizens) */}
          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/70 text-[#ea580c] text-xs font-bold">
                <span>Citizen Visibility</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Clear Issue Tracking
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Citizens follow report progression from submission to verification with dedicated reference IDs and transparent status milestones.
              </p>
            </div>

            {/* Micro-UI Component: Live Citizen Tracking Card */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <span className="font-mono text-xs font-bold text-[#ea580c]">CF-4115</span>
                  <div className="text-xs font-bold text-neutral-900">Asphalt Pothole • Indiranagar 100ft Rd</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                  In Progress
                </span>
              </div>

              {/* Progress Milestones Stepper */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <span><strong>Reported</strong> • 09:14 AM by citizen with GPS photo</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <span><strong>Triaged</strong> • Spatial deduplication verified (0 duplicates)</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] animate-pulse">
                    ●
                  </div>
                  <span><strong>Dispatched</strong> • Squad Alpha (Roadworks) active on site</span>
                </div>
              </div>

              {/* Notification Pill */}
              <div className="p-2.5 rounded-lg bg-orange-50/70 border border-orange-200/60 text-[11px] text-neutral-700 flex items-center justify-between">
                <span>SMS & Push updates sent automatically upon stage transitions.</span>
                <span className="font-mono text-[#ea580c] font-bold">Live Sync</span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Zero-login intake available for instant community reporting.</span>
            </div>
          </div>

          {/* BLOCK 2: Organized Issue Management (For Authorities) */}
          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-bold">
                <span>Authority Console</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Organized Issue Management
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Supervisors review, sort, and prioritize incoming community reports by severity, ward boundary, and SLA risk without chaotic manual spreadsheets.
              </p>
            </div>

            {/* Micro-UI Component: Triage Queue Snippet */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-100">
                <span className="font-bold text-neutral-800">Priority Triage Stream (Ward 112)</span>
                <span className="text-[11px] text-neutral-500 font-mono">18 Active Cases</span>
              </div>

              {/* Snippet Row 1 */}
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-[#ea580c]">CF-4115</span>
                    <span>18" Asphalt Pothole</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">100ft Rd • Road Infrastructure</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                  Urgent (SLA 4h)
                </span>
              </div>

              {/* Snippet Row 2 */}
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-neutral-600">CF-4112</span>
                    <span>High-Mast Streetlight</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">CMH Road • Civic Lighting</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                  Medium (SLA 24h)
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Automated duplicate grouping active</span>
                <Link to="/authority/issues" className="text-[#ea580c] font-bold hover:underline flex items-center gap-1">
                  <span>Open Triage Queue</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Configurable municipal SLA timelines with automated escalation alerts.</span>
            </div>
          </div>

          {/* BLOCK 3: Accountable Workflows (Dispatch & Field Roster) */}
          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-700 text-xs font-bold">
                <span>Field Operations</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Accountable Workflows
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Squad rosters, work orders, and photographic audit trails make field team progress verifiable and transparent across departments.
              </p>
            </div>

            {/* Micro-UI Component: Squad Dispatch & Workload Snippet */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    α
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">Squad Alpha (Roadworks)</div>
                    <div className="text-[10px] text-neutral-500">Lead: Rajesh Kumar • 4 On-Duty Techs</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Active On Duty
                </span>
              </div>

              {/* Workload Capacity Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-600">
                  <span>Current Workload</span>
                  <span className="font-mono font-bold text-neutral-900">4 / 5 Capacity (80%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Verified Inspection Pill */}
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Mandatory before & after photo audit
                </span>
                <span className="font-mono text-neutral-500">Verified</span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Full audit trail maintained for municipal integrity and reporting.</span>
            </div>
          </div>

          {/* BLOCK 4: Data-Informed Decisions (Analytics & Cluster Intelligence) */}
          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold">
                <span>Spatial Analytics</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Data-Informed Decisions
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Available issue records, spatial clustering, and ward analytics help municipal authorities identify recurring problem corridors and allocate resources where needed most.
              </p>
            </div>

            {/* Micro-UI Component: Ward Spatial Analytics Card */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs">
                <span className="font-bold text-neutral-900">Ward 112 Spatial Telemetry</span>
                <span className="text-[10px] font-mono text-neutral-500">Updated 10 mins ago</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-mono text-sm font-bold text-neutral-900">18.4h</div>
                  <div className="text-[10px] text-neutral-500">Avg Resolution</div>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-mono text-sm font-bold text-emerald-600">98.4%</div>
                  <div className="text-[10px] text-neutral-500">GPS Accuracy</div>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-mono text-sm font-bold text-[#ea580c]">3</div>
                  <div className="text-[10px] text-neutral-500">Hotspot Zones</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-200/60 text-[11px] text-purple-900 flex items-center justify-between">
                <span>Hotspot detected: 100ft Rd Corridor (4 clustered road repairs)</span>
                <Link to="/authority/analytics" className="font-bold text-[#ea580c] hover:underline flex items-center gap-1">
                  <span>View Trends</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Illustrative dataset reflecting CivicFix AI active state architecture.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
