import React from 'react';

const impactPoints = [
  {
    number: '01',
    title: 'Easier Reporting',
    desc: 'Structured smartphone intake replaces cumbersome paper forms, phone queues, and unmonitored email inboxes with geotagged photographic reports.',
  },
  {
    number: '02',
    title: 'Fewer Duplicate Reports',
    desc: 'Intelligent spatial clustering groups multiple citizen observations of the same pothole or broken streetlight into a single consolidated master ticket.',
  },
  {
    number: '03',
    title: 'Clearer Status Updates',
    desc: 'Transparent progress milestones eliminate uncertainty for citizens who wonder whether their reported neighborhood issue was ever acknowledged.',
  },
  {
    number: '04',
    title: 'Better Organized Civic Information',
    desc: 'Categorized incident records and geographic heat patterns assist civic teams in allocating machinery and materials where needs are most critical.',
  },
];

export default function CommunityImpactSection() {
  return (
    <section id="impact" className="bg-[#fcfbf9] text-neutral-900 py-28 lg:py-36 border-b border-neutral-200 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-20 space-y-4">
          <div className="inline-block text-xs uppercase tracking-widest text-[#ff5722] font-semibold">
            Community Impact
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-neutral-900 leading-[1.08]">
            When Neighborhood Observations Become Actionable Data.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed pt-2">
            CivicFix AI bridges the gap between everyday citizen frustration and effective civic infrastructure maintenance through organized information architecture.
          </p>
        </div>

        {/* Four-Column Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactPoints.map((point) => (
            <div
              key={point.number}
              className="rounded-md bg-white border border-neutral-200/80 p-7 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-[#ff5722] tracking-wider block mb-4">
                  BENEFIT // {point.number}
                </span>

                <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-3">
                  {point.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  {point.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-neutral-400 text-xs">
                <span>Core Pillar</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e5f]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
