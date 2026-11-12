import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageLayout from '../layouts/PublicPageLayout';

const impactPillars = [
  {
    title: 'Easier Issue Reporting',
    audience: 'For Citizens & Commuters',
    desc: 'Bypasses convoluted municipal grievance websites, long phone waiting queues, and paper bureaucracy. Citizens can log an issue with photographic proof in under thirty seconds from their mobile browser.',
    metric: 'Zero App Download Barrier',
    context: 'Direct web app intake accessible to anyone with a smartphone camera.',
  },
  {
    title: 'More Visible Status Updates',
    audience: 'For Neighborhood Transparency',
    desc: 'Historically, civic complaints enter a black hole where citizens have no way of knowing whether an issue was acknowledged or ignored. CivicFix provides transparent, timestamped milestone tracking across every case.',
    metric: 'Clear Milestone Progression',
    context: 'Logged &rarr; Triaged &rarr; Dispatched &rarr; Resolved.',
  },
  {
    title: 'Better Understanding of Recurring Problems',
    audience: 'For Ward Committees & Residents',
    desc: 'Isolated grievances often mask systemic municipal neglect. By aggregating geographic clustering data across wards, communities can see whether recurring pothole patches or repetitive pipeline bursts require complete capital overhaul.',
    metric: 'Spatial Cluster Intelligence',
    context: 'Uncovers chronic infrastructure bottlenecks across arterial corridors.',
  },
  {
    title: 'Clearer Communication Between Stakeholders',
    audience: 'For Municipal Crews & Public Teams',
    desc: 'Standardized issue dossiers give field repair squads unambiguous coordinates, defect measurements, and photographic evidence, reducing round trips and misplaced work orders.',
    metric: 'Standardized Incident Dossiers',
    context: 'Coordinates verified before repair machinery is dispatched to site.',
  },
];

export default function CommunityImpactPage() {
  return (
    <PublicPageLayout
      eyebrow="Civic Transformation"
      title="Better information. More connected communities."
      description="Exploring how structured public reports turn everyday infrastructure observations into actionable, verifiable improvements across local wards."
      badge
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 lg:py-28 space-y-24">
        
        {/* 4 Core Impact Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {impactPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-md bg-[#15151b] border border-white/10 p-8 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#ffab40]">
                    {pillar.audience}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#ff5722]" />
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {pillar.title}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 bg-black/40 -mx-8 -mb-8 p-6 rounded-b-md space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Design Outcome:
                </span>
                <span className="text-xs font-semibold text-white block">
                  {pillar.metric}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {pillar.context}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Visual Section */}
        <div className="rounded-md overflow-hidden border border-white/15 relative aspect-[16/8] sm:aspect-[21/9] min-h-[380px] flex items-end shadow-2xl">
          <img
            src="/images/community_story.jpg"
            alt="Local community street in India with restored asphalt"
            className="absolute inset-0 w-full h-full object-cover filter contrast-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#ffab40] font-semibold">
              Authentic Neighborhood Outcomes
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              A Safer Street Starts With A Verified Report
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
              When civic data is organized clearly, communities and municipal leadership share a common operational truth.
            </p>
          </div>
        </div>

        {/* Responsible Impact Commitment */}
        <div className="p-8 sm:p-10 rounded-md bg-[#131317] border border-white/10 space-y-4 text-xs text-neutral-400 max-w-3xl mx-auto text-center leading-relaxed">
          <strong className="text-white block text-sm">Our Public Impact Commitment:</strong>
          CivicFix AI does not fabricate municipal partner badges, claim unverified reduction percentages, or publish synthetic satisfaction metrics. We measure our platform purely on information accuracy, deduplication fidelity, and transparent lifecycle tracking.
        </div>

      </div>
    </PublicPageLayout>
  );
}
