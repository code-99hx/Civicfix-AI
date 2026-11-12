import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageLayout from '../layouts/PublicPageLayout';

const steps = [
  {
    num: '01',
    phase: 'Step 01',
    title: 'Report the Issue',
    subtitle: 'Citizen Mobile & Web Intake',
    desc: 'Citizens capture a smartphone photograph of the infrastructure defect. High-precision GPS auto-detects the exact coordinate pin, while computer vision suggests the appropriate civic categorization (e.g., Pothole, Broken Streetlight, Sewage Overflow).',
    bullets: [
      'Sub-meter GPS coordinate lock',
      'Instant image quality validation',
      'Contextual description and street landmarks',
    ],
    image: '/images/feature_01.jpg',
  },
  {
    num: '02',
    phase: 'Step 02',
    title: 'Organize and Review',
    subtitle: 'AI Triage & Deduplication Engine',
    desc: 'Incoming reports are cross-referenced against active neighborhood incidents within a configurable spatial radius. Redundant submissions are merged into a single parent ticket, eliminating duplicate work orders.',
    bullets: [
      'Spatial clustering within 50m radius',
      'Configurable urgency & pedestrian risk scoring',
      'Triage flag assigned for authorized squad review',
    ],
    image: '/images/feature_02.jpg',
  },
  {
    num: '03',
    phase: 'Step 03',
    title: 'Track Progress',
    subtitle: 'Transparent Milestone Propagation',
    desc: 'Once triaged, the incident is routed to the authorized zonal maintenance squad. Citizens receive timestamped status updates across verified milestones: Logged, Triaged, Dispatched, and In Repair.',
    bullets: [
      'Real-time status transitions with timestamps',
      'Clear contractor & squad accountability',
      'Community subscription to neighborhood issues',
    ],
    image: '/images/feature_03.jpg',
  },
  {
    num: '04',
    phase: 'Step 04',
    title: 'Review the Outcome',
    subtitle: 'Photographic Completion Audit',
    desc: 'When field work finishes, repair crews upload proof-of-completion imagery. The incident lifecycle is formally closed with an immutable audit log, and reporting residents are notified of the completed fix.',
    bullets: [
      'Before & After photographic evidence',
      'Resident confirmation feedback loop',
      'Permanent civic infrastructure record',
    ],
    image: '/images/feature_04.jpg',
  },
];

export default function HowItWorksPage() {
  return (
    <PublicPageLayout
      eyebrow="Civic Resolution Architecture"
      title="From a local problem to a clearer path forward."
      description="CivicFix AI transforms unstructured public complaints into a verifiable, 4-phase coordination pipeline that empowers citizens and equips maintenance teams."
      badge
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 lg:py-28 space-y-24">
        
        {/* 4 Step In-Depth Walkthrough */}
        <div className="space-y-20">
          {steps.map((step, idx) => (
            <div 
              key={step.num}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Info */}
              <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold font-mono text-[#ffab40]">{step.num}</span>
                  <span className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                    {step.subtitle}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {step.title}
                </h2>

                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                  {step.desc}
                </p>

                {/* Bullets */}
                <div className="space-y-2.5 pt-2">
                  {step.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Showcase */}
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="rounded-md overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl aspect-[4/3] group relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-white/90">
                    Phase {step.num} // Standard Operational Procedure
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clear CTA to Test the Intake Flow */}
        <div className="rounded-md hero-warm-gradient p-8 sm:p-14 text-white text-center max-w-4xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight relative z-10">
            Experience the Intake Flow in Real Time
          </h3>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto relative z-10 leading-relaxed">
            Test how a street photo is parsed, geotagged, and triaged in our interactive client-side demonstration sandbox.
          </p>
          <div className="pt-2 relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-md bg-white text-neutral-900 text-xs font-semibold px-6 py-3.5 hover:bg-neutral-100 transition-colors uppercase tracking-wider shadow"
            >
              Contact Team
            </Link>
            <Link
              to="/features"
              className="rounded-md bg-black/30 backdrop-blur-md border border-white/40 text-white text-xs font-semibold px-6 py-3.5 hover:bg-black/50 transition-colors uppercase tracking-wider"
            >
              Explore All Features
            </Link>
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
}
