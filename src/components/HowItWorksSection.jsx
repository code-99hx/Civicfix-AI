import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Report the Issue',
    desc: 'Capture a clear photo of the infrastructure defect. The platform automatically tags GPS coordinates and suggests the appropriate issue category.',
    image: '/images/feature_01.jpg',
    imageAlt: 'Capturing photo of street defect',
    tag: 'Citizen Intake',
  },
  {
    number: '02',
    title: 'Verify the Details',
    desc: 'Automated intelligence parses the image, filters duplicate reports within the vicinity, and computes configurable urgency indicators.',
    image: '/images/feature_02.jpg',
    imageAlt: 'Spatial analysis and duplicate detection',
    tag: 'Automated Triage',
  },
  {
    number: '03',
    title: 'Track Progress',
    desc: 'Citizens and community members receive transparent status milestones as the issue transitions to authorized civic maintenance teams.',
    image: '/images/feature_03.jpg',
    imageAlt: 'Status progression display',
    tag: 'Live Status',
  },
  {
    number: '04',
    title: 'Confirm Resolution',
    desc: 'Once work is completed on site, photographic verification is recorded and the incident lifecycle is formally closed with audit trail integrity.',
    image: '/images/feature_04.jpg',
    imageAlt: 'Neighborhood coordination terminal',
    tag: 'Resolution Audit',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#111115] text-white py-28 lg:py-36 border-b border-white/10 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-block text-xs uppercase tracking-widest text-[#ff7e5f] font-semibold">
            Operational Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.14]">
            An Elegant, Connected Four-Step Flow
          </h2>
          <p className="text-base text-neutral-400 font-normal">
            From the initial street observation to verified resolution on the ground.
          </p>
        </div>

        {/* 4 Connected Step Cards with Connector Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, idx) => (
            <div 
              key={step.number}
              className="rounded-md bg-neutral-900/80 border border-white/10 p-6 flex flex-col justify-between hover:border-white/30 transition-all duration-200 group relative"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-2xl font-bold font-mono text-[#ffab40]">
                    {step.number}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                    {step.tag}
                  </span>
                </div>

                {/* Step Thumbnail */}
                <div className="aspect-[4/3] rounded-md overflow-hidden border border-white/10 bg-black mb-5 relative">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-102"
                    loading="lazy"
                  />
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Phase {step.number} of 04</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e5f]" />
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
