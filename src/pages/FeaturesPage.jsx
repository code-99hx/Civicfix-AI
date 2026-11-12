import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageLayout from '../layouts/PublicPageLayout';

const featuresList = [
  {
    title: 'Photo & Location-Based Reports',
    category: 'Citizen Intake',
    desc: 'Empowers any resident to document infrastructure breakdown with a single camera snap. GPS metadata and reverse-geocoding pinpoint ward boundaries automatically.',
    highlights: ['EXIF integrity validation', 'Sub-5-second submission speed', 'Works in low-bandwidth urban areas'],
    image: '/images/feature_01.jpg',
  },
  {
    title: 'AI-Assisted Issue Classification',
    category: 'Multimodal Vision',
    desc: 'Computer vision identifies defects—distinguishing asphalt craters from routine gravel wear, or illegal waste mounds from municipal bins—recommending categorical tags instantly.',
    highlights: ['Multi-class civic hazard taxonomy', 'Confidence scoring', 'Human-in-the-loop review overrides'],
    image: '/images/feature_02.jpg',
  },
  {
    title: 'Potential Duplicate Detection',
    category: 'Spatial Deduplication',
    desc: 'When dozens of commuters photograph the same broken streetlight or flooded underpass, the algorithm clusters reports within a proximity radius into one primary ticket.',
    highlights: ['Eliminates redundant contractor dispatches', 'Aggregates community upvotes & urgency', 'Saves municipal triage hours'],
    image: '/images/feature_04.jpg',
  },
  {
    title: 'Location-Based Issue Grouping',
    category: 'Geographic Intelligence',
    desc: 'Aggregates neighborhood complaints onto real-time geographic heat patterns, allowing civic leadership to detect chronic drainage failures and systemic contractor neglect.',
    highlights: ['Ward & zone level aggregation', 'Recurring defect alerts', 'Infrastructure longevity analytics'],
    image: '/images/feature_03.jpg',
  },
  {
    title: 'Status Tracking & Update Timelines',
    category: 'Transparency Engine',
    desc: 'Residents and ward committees can follow live progress transitions: from initial intake to field dispatch, active repair, and verified sign-off with timestamps.',
    highlights: ['Audit-grade chronological logs', 'Notification alerts on status shift', 'Clear accountability milestones'],
    image: '/images/meet_product.jpg',
  },
  {
    title: 'Evidence-Backed Summaries',
    category: 'Municipal Operations',
    desc: 'Provides authorized maintenance squads with clear executive summaries containing before-and-after imagery, coordinate benchmarks, and work order specifications.',
    highlights: ['Exportable PDF & GIS formats', 'Pre-formatted contractor dispatch orders', 'Zero reliance on unverified rumors'],
    image: '/images/community_story.jpg',
  },
];

export default function FeaturesPage() {
  return (
    <PublicPageLayout
      eyebrow="Platform Capabilities"
      title="Everything needed to make civic issues easier to follow."
      description="Engineered to bridge community observations and municipal maintenance teams with clarity, spatial intelligence, and accountable audit trails."
      badge
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 lg:py-28 space-y-24">
        
        {/* Features Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feat) => (
            <div
              key={feat.title}
              className="rounded-md bg-[#141418] border border-white/10 p-6 flex flex-col justify-between hover:border-white/25 transition-all duration-200 group"
            >
              <div>
                <div className="aspect-[16/10] rounded-md overflow-hidden border border-white/10 bg-black mb-5 relative">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-102"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] text-[#ffab40] font-mono uppercase tracking-wider">
                    {feat.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-2.5">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal mb-5">
                  {feat.desc}
                </p>

                <div className="space-y-2 pt-1 border-t border-white/5">
                  {feat.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e5f]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500">
                <span>CivicFix Core Module</span>
                <span className="text-white group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Deep Dive Callout */}
        <div className="rounded-md border border-white/15 bg-neutral-900/60 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#ff7e5f] font-semibold">
              Platform Integration Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Responsible AI Designed With Human Oversight
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-normal">
              CivicFix AI assists in sorting, clustering, and prioritizing infrastructure reports without making autonomous municipal governance decisions. All public dispatches require human authorization.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/how-it-works"
              className="rounded-md bg-white text-neutral-900 text-xs font-semibold px-6 py-3.5 hover:bg-neutral-100 transition-colors uppercase tracking-wider"
            >
              View Workflow
            </Link>
            <Link
              to="/contact"
              className="rounded-md border border-white/20 text-white text-xs font-semibold px-6 py-3.5 hover:bg-white/10 transition-colors uppercase tracking-wider"
            >
              Contact Team
            </Link>
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
}
