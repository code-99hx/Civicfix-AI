import React from 'react';

export default function IntroductionSection() {
  return (
    <section id="products" className="bg-black py-28 sm:py-36 lg:py-44 border-b border-neutral-900">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Top Label */}
        <div className="mb-14 sm:mb-20">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            Meet CivicFix AI
          </span>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Isolated Product Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-[4/3] bg-neutral-950 border border-neutral-900 flex items-center justify-center p-4 overflow-hidden">
              <img
                src="/images/meet_product.jpg"
                alt="CivicFix AI mobile interface preview showing geotagged issue reporting"
                className="w-full h-full object-contain filter contrast-105"
              />
            </div>
          </div>

          {/* Right Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pl-8">
            <h2 className="text-3xl sm:text-4xl lg:text-[54px] font-light text-white leading-[1.12] tracking-[-0.03em]">
              From the first report to the final resolution, every civic issue deserves to be seen.
            </h2>
            
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed font-normal">
              Structured reports, location information, and AI-assisted organization help make civic problems easier to track, categorize, and address with speed and clarity.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
