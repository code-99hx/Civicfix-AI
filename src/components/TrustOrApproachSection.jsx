import React from 'react';

export default function TrustOrApproachSection() {
  return (
    <section id="impact" className="bg-black text-white py-24 sm:py-32 lg:py-36 border-b border-neutral-900">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Small Section Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            Designed Around Real Community Needs
          </span>
        </div>

        {/* Wide Dark-Gray Panel matching Tri.wi reference */}
        <div className="bg-[#141414] border border-neutral-800 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Core Principle / Statement */}
            <div className="lg:col-span-7">
              <p className="text-2xl sm:text-3xl lg:text-[38px] font-light text-white leading-tight tracking-[-0.025em]">
                “A clearer report is the first step toward a more accountable response.”
              </p>
            </div>

            {/* Right Column: Explanatory Context & Honest Attribution */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-neutral-800 lg:pl-10">
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                When civic reports contain verifiable details, geotags, and accurate urgency indicators, community issues move from overlooked grievances to structured, actionable tasks that civic teams can track to resolution.
              </p>

              {/* Attribution / Approach Standard */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-mono text-neutral-300">
                  CF
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white">
                    Our Approach
                  </div>
                  <div className="text-xs text-neutral-400">
                    CivicFix AI Public Infrastructure Standards
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
