import React from 'react';

const problems = [
  {
    category: 'Road Hazards',
    title: 'Deep Potholes & Surface Cracks',
    desc: 'Unmarked craters damage vehicles and pose severe hazards for two-wheeler commuters on high-density arterial roads.',
    tag: 'Safety Critical',
    accent: 'border-l-orange-500',
    number: '01'
  },
  {
    category: 'Sanitation',
    title: 'Overflowing Waste & Illegal Dumping',
    desc: 'Uncollected refuse blocks pedestrian walkways and compromises community health when left unaddressed.',
    tag: 'Public Health',
    accent: 'border-l-amber-500',
    number: '02'
  },
  {
    category: 'Public Lighting',
    title: 'Defective Streetlights & Dark Corridors',
    desc: 'Failed lighting infrastructure creates blind spots, directly impacting nighttime safety for women and pedestrians.',
    tag: 'Civic Security',
    accent: 'border-l-yellow-500',
    number: '03'
  },
  {
    category: 'Water & Utilities',
    title: 'Pipeline Leakages & Drainage Backups',
    desc: 'Treated water loss and flooded underpasses cause severe disruption during monsoon and heavy transit hours.',
    tag: 'Resource Loss',
    accent: 'border-l-blue-500',
    number: '04'
  },
];

export default function ProblemMissionSection() {
  return (
    <section id="platform" className="bg-white text-neutral-900 py-20 sm:py-28 border-b border-neutral-200/80 relative">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Statement & Photo */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="inline-block text-xs uppercase tracking-widest text-[#ea580c] font-semibold px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
              The Civic Challenge
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]">
              Everyday Problems Deserve More Than Another Complaint.
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              CivicFix AI helps turn local observations into structured reports that communities and authorized civic teams can track with accountability.
            </p>

            {/* Authentic Street Visual */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 aspect-[16/10] relative group">
              <img
                src="/images/hero.jpg"
                alt="Urban street in India with infrastructure inspection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-white">
                <span className="font-semibold block text-sm">Ground Truth Infrastructure Data</span>
                <span className="text-white/80 text-[11px]">Real incidents require structured location data and verified tracking.</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Categorized Civic Problems */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">
              Common Infrastructure Breakdowns
            </div>

            {problems.map((prob) => (
              <div
                key={prob.title}
                className={`rounded-xl p-5 sm:p-6 bg-neutral-50/70 border border-neutral-200/90 hover:bg-white hover:shadow-md transition-all duration-200 border-l-4 ${prob.accent}`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#ea580c] font-semibold">
                    {prob.number} • {prob.category}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 shadow-2xs">
                    {prob.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-2">
                  {prob.title}
                </h3>

                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  {prob.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
