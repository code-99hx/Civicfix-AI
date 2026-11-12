import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Camera, 
  MapPin, 
  Users, 
  CheckCircle2 
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    phase: 'Step 1',
    title: 'Report a Civic Issue',
    badge: 'Citizen Intake',
    image: '/images/civicfix-report-workflow.png',
    alt: 'Citizen using smartphone to capture photo of road pothole',
    desc: 'Citizens photograph civic defects like potholes, dark streetlights, or drainage overflow. Vision AI suggests categories and attaches GPS metadata instantly.',
    accent: '#ff6243',
    accentBg: 'bg-orange-50 text-[#ea580c] border-orange-200',
    icon: Camera
  },
  {
    step: '02',
    phase: 'Step 2',
    title: 'Locate and Track',
    badge: 'Spatial GIS',
    image: '/images/civicfix-location-tracking.png',
    alt: 'Street map showing GPS coordinates and spatial radius tracking',
    desc: 'The report is mapped with high-precision coordinates. Spatial deduplication groups nearby complaints, and a permanent incident ID is generated.',
    accent: '#fca311',
    accentBg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: MapPin
  },
  {
    step: '03',
    phase: 'Step 3',
    title: 'Authority Reviews & Assigns',
    badge: 'Municipal Triage',
    image: '/images/civicfix-authority-assignment.png',
    alt: 'Municipal supervisor dashboard assigning work order to field crew squad',
    desc: 'Municipal supervisors review prioritized reports, verify safety SLA targets, and dispatch specialized field squads with digital work orders.',
    accent: '#3b82f6',
    accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Users
  },
  {
    step: '04',
    phase: 'Step 4',
    title: 'Track Progress Through Resolution',
    badge: 'Verified Resolution',
    image: '/images/civicfix-issue-resolution.png',
    alt: 'Repaired road with verified green checkmark badge and citizen rating',
    desc: 'Field teams upload timestamped photographic verification upon repair. The ticket is inspected, verified, and closed with citizen notification.',
    accent: '#10b981',
    accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2
  }
];

export default function HowItWorksWorkflow({ onOpenReportModal }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section 
      id="how-it-works" 
      aria-label="How CivicFix AI Works"
      className="bg-[#fbfbfd] text-neutral-900 py-20 sm:py-28 lg:py-32 border-b border-neutral-200/80 relative overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#ea580c] text-xs font-semibold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Four-Stage Civic Lifecycle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-neutral-900 leading-[1.12]">
            How CivicFix AI Works
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-2xl mx-auto leading-relaxed">
            From the initial street observation to verified on-site resolution, every phase is connected, transparent, and auditable.
          </p>
        </div>

        {/* 4 Connected Stages: Responsive Grid with Custom PNG Illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Subtle Directional Progress Bar on Desktop */}
          <div 
            className="hidden lg:block absolute top-[180px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-orange-300 via-amber-300 to-emerald-400 pointer-events-none z-0" 
            aria-hidden="true" 
          />

          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isSelected = activeStep === index;

            return (
              <div 
                key={step.step}
                onMouseEnter={() => setActiveStep(index)}
                className={`relative z-10 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-xl ${
                  isSelected 
                    ? 'border-orange-400 ring-2 ring-orange-500/20 -translate-y-1' 
                    : 'border-neutral-200/90 hover:border-neutral-300 hover:-translate-y-0.5'
                }`}
              >
                {/* Card Header: Step Pill & Phase */}
                <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-xs"
                      style={{ 
                        backgroundColor: `${step.accent}15`, 
                        color: step.accent,
                        border: `1px solid ${step.accent}30` 
                      }}
                    >
                      {step.step}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800 tracking-tight">
                      {step.phase}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${step.accentBg}`}>
                    {step.badge}
                  </span>
                </div>

                {/* Main Visual: Custom High-Quality PNG Illustration */}
                <div className="w-full aspect-[4/3] bg-neutral-50/60 border-b border-neutral-100 overflow-hidden relative p-3 flex items-center justify-center">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                    loading="lazy"
                  />
                </div>

                {/* Card Body: Title and Description */}
                <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2 group-hover:text-[#ea580c] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal pt-1.5">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bottom Indicator */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                      <Icon className="w-3.5 h-3.5" style={{ color: step.accent }} />
                      Phase {step.step} of 04
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">Step {index + 1}</span>
                  </div>
                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom Interactive Workflow Callout CTA */}
        <div className="mt-14 p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#ea580c] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900">Experience the reporting lifecycle first-hand</div>
              <div className="text-xs text-neutral-600">Test the citizen intake dialog to observe auto-geotagging and municipal ticket creation.</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#ff6243] hover:bg-[#ea580c] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Test Citizen Intake</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
