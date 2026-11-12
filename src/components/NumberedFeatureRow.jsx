import React from 'react';

const features = [
  {
    number: '01.',
    label: 'Report in Seconds',
    headline: 'Turn everyday civic problems into clear, location-based reports.',
    description: 'Citizens can submit a photo, choose an issue category, and share the location of the problem.',
    image: '/images/feature_01.jpg',
    imageAlt: 'Hands capturing a photograph of a road surface fissure for civic report',
  },
  {
    number: '02.',
    label: 'AI-Powered Prioritization',
    headline: 'Bring the most relevant problems into focus.',
    description: 'AI helps classify reports, identify potential duplicates, and organize incidents by configurable urgency and impact signals. AI provides decision support without replacing human judgment.',
    image: '/images/feature_02.jpg',
    imageAlt: 'Architectural 3D model showing urban sector nodes and spatial clustering',
  },
  {
    number: '03.',
    label: 'Track Every Update',
    headline: 'Know what happens after your report is submitted.',
    description: 'Follow reported, acknowledged, in-progress, and resolved statuses, with timestamps and updates when available.',
    image: '/images/feature_03.jpg',
    imageAlt: 'Matte aluminum status badge displaying logged, verified, in-progress progression',
  },
  {
    number: '04.',
    label: 'Connected Communities',
    headline: 'Give citizens and civic teams a clearer picture of local needs.',
    description: 'Organize reports by location and category so authorized teams can identify recurring issues and coordinate their work.',
    image: '/images/feature_04.jpg',
    imageAlt: 'Architectural tablet displaying neighborhood coordination grid and sector zones',
  },
];

export default function NumberedFeatureRows() {
  return (
    <section id="how-it-works" className="bg-white text-black border-b border-[#e5e5e5]">
      <div className="max-w-[1440px] mx-auto">
        {features.map((feature, idx) => (
          <div
            key={feature.number}
            className={`grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[580px] ${
              idx < features.length - 1 ? 'border-b border-[#e5e5e5]' : ''
            }`}
          >
            {/* Left Column: Number, Label, Headline, and Description */}
            <div className="lg:col-span-6 px-6 sm:px-10 lg:px-16 py-12 lg:py-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#e5e5e5]">
              
              {/* Row Top Header */}
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-neutral-800 mb-12 lg:mb-16">
                <span className="font-mono text-sm">{feature.number}</span>
                <span className="tracking-widest">{feature.label}</span>
              </div>

              {/* Main Headline & Narrative */}
              <div className="space-y-6 max-w-xl my-auto">
                <h3 className="text-3xl sm:text-4xl lg:text-[46px] font-light text-[#666666] leading-[1.14] tracking-[-0.025em]">
                  {feature.headline}
                </h3>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-normal pt-2">
                  {feature.description}
                </p>
              </div>

              {/* Bottom spacing spacer for baseline alignment */}
              <div className="hidden lg:block h-6" />
            </div>

            {/* Right Column: High-Key Rectangular Editorial Photograph */}
            <div className="lg:col-span-6 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16">
              <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  className="w-full h-full object-contain filter contrast-102 hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
