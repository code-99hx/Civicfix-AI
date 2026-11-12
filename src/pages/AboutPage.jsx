import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageLayout from '../layouts/PublicPageLayout';

const principles = [
  {
    title: 'Civic Data Belongs to Communities',
    desc: 'Public infrastructure problems occur in shared civic spaces. Information regarding potholes, water leaks, and street hazards should be visible, transparent, and openly trackable by the residents who navigate those streets every day.',
  },
  {
    title: 'Responsible AI with Human Oversight',
    desc: 'AI is deployed strictly for assistance—computer vision categorization, spatial deduplication, and signal prioritization. CivicFix AI never makes official government decisions, dispatches emergency services, or replaces human judgment.',
  },
  {
    title: 'Milestone Integrity Over Synthetic Metrics',
    desc: 'We do not publish exaggerated resolution claims or invented government partnerships. We believe authentic civic trust is earned through verifiable before-and-after photographic evidence and transparent status logs.',
  },
  {
    title: 'Accessibility for Every Neighborhood',
    desc: 'Civic tech must be usable across all devices, including low-cost mobile smartphones and low-bandwidth connections, ensuring every citizen has an equal voice in neighborhood safety.',
  },
];

export default function AboutPage() {
  return (
    <PublicPageLayout
      eyebrow="Mission & Principles"
      title="Built around the places we call home."
      description="CivicFix AI is an open civic technology initiative focused on transforming everyday infrastructure observations into transparent, actionable community improvements."
      badge
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 lg:py-28 space-y-24">
        
        {/* Core Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#ff7e5f] font-semibold">
              The Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Moving From Frustration to Actionable Coordination
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
              Across urban India and developing cities worldwide, citizens observe defective roads, overflowing waste, and failed utilities daily. Too often, reporting feels pointless because grievances vanish into opaque bureaucratic silos.
            </p>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
              CivicFix AI was architected to make every civic observation structured, geotagged, clustered, and openly trackable—giving communities and municipal teams a common operational baseline.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-2">
              Our Core Architecture Principles
            </span>

            <div className="space-y-4">
              {principles.map((pr, idx) => (
                <div 
                  key={pr.title}
                  className="rounded-md bg-[#141419] border border-white/10 p-6 space-y-2 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#ffab40]">
                    <span>0{idx + 1}</span>
                    <span>//</span>
                    <span className="text-white font-semibold">{pr.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                    {pr.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Transparency Notice */}
        <div className="rounded-md border border-white/15 bg-neutral-900/40 p-8 sm:p-12 space-y-4 max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-[#ffab40] font-semibold">
            Civic Tech Standards
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Honest Civic Engineering
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            In strict compliance with our design principles, we do not invent fictional founders, simulated corporate biographies, or counterfeit municipal endorsements. CivicFix AI is designed for real communities, built around transparent open data principles.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-block rounded-md bg-white text-neutral-900 text-xs font-semibold px-6 py-3 hover:bg-neutral-100 transition-colors uppercase tracking-wider"
            >
              Connect With Us
            </Link>
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
}
