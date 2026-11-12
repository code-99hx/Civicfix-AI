import React from 'react';

export default function BenefitsSection() {
  return (
    <section className="bg-black text-white pt-28 lg:pt-36 pb-20 border-b border-neutral-900">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header: Left Small Title & Right Large Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pb-20 lg:pb-28 border-b border-neutral-900">
          <div className="lg:col-span-4">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
              A Clearer Path to Better Streets
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-light text-white leading-[1.12] tracking-[-0.03em] max-w-2xl">
              Make civic problems easier to report, understand, and resolve.
            </h2>
          </div>
        </div>

        {/* Four Evenly Spaced Columns on the Same Baseline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pt-16 lg:pt-20">
          
          {/* Benefit 01 */}
          <div className="flex flex-col space-y-6">
            {/* Minimalist Grayscale Visual */}
            <div className="w-full h-44 bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-center p-6 relative overflow-hidden group">
              <svg className="w-24 h-24 text-neutral-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                {/* Minimalist isometric reporting frame */}
                <rect x="22" y="22" width="56" height="56" strokeWidth="1" strokeDasharray="3 3" className="text-neutral-600" />
                <path d="M50 15v14M50 71v14M15 50h14M71 50h14" strokeWidth="1.2" strokeLinecap="square" />
                <circle cx="50" cy="50" r="12" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="2.5" fill="currentColor" />
                <path d="M26 26l8 8M74 26l-8 8M26 74l8-8M74 74l-8-8" strokeWidth="0.8" className="text-neutral-700" />
              </svg>
            </div>
            
            <div className="space-y-3 pt-2">
              <h3 className="text-base sm:text-lg font-medium text-white tracking-tight">
                Make Every Report Count
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                Structured submissions with verified GPS coordinates and clear imagery make local infrastructure problems unambiguous and immediately actionable.
              </p>
            </div>
          </div>

          {/* Benefit 02 */}
          <div className="flex flex-col space-y-6">
            {/* Minimalist Grayscale Visual */}
            <div className="w-full h-44 bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-center p-6 relative overflow-hidden group">
              <svg className="w-24 h-24 text-neutral-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                {/* Concentric topology cluster rings */}
                <ellipse cx="50" cy="50" rx="38" ry="18" strokeWidth="1" className="text-neutral-700" />
                <ellipse cx="50" cy="50" rx="28" ry="13" strokeWidth="1.2" className="text-neutral-500" />
                <ellipse cx="50" cy="50" rx="16" ry="8" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
                <line x1="50" y1="12" x2="50" y2="88" strokeWidth="0.8" strokeDasharray="2 2" className="text-neutral-600" />
                <circle cx="34" cy="46" r="2" fill="currentColor" className="text-neutral-500" />
                <circle cx="66" cy="54" r="2" fill="currentColor" className="text-neutral-500" />
              </svg>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-base sm:text-lg font-medium text-white tracking-tight">
                Find Patterns, Not Just Complaints
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                Similar reports can be grouped across neighborhoods to reveal recurring drainage failures, chronic road wear, and systemic maintenance needs.
              </p>
            </div>
          </div>

          {/* Benefit 03 */}
          <div className="flex flex-col space-y-6">
            {/* Minimalist Grayscale Visual */}
            <div className="w-full h-44 bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-center p-6 relative overflow-hidden group">
              <svg className="w-24 h-24 text-neutral-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                {/* Monolithic status milestone token */}
                <rect x="32" y="18" width="36" height="64" rx="2" strokeWidth="1.2" />
                <line x1="40" y1="32" x2="60" y2="32" strokeWidth="1" className="text-neutral-500" />
                <line x1="40" y1="44" x2="60" y2="44" strokeWidth="1" className="text-neutral-500" />
                <line x1="40" y1="56" x2="54" y2="56" strokeWidth="1" className="text-neutral-600" />
                <circle cx="50" cy="68" r="3" fill="currentColor" />
              </svg>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-base sm:text-lg font-medium text-white tracking-tight">
                Follow the Progress
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                Transparent status updates and timestamped milestones ensure citizens understand what happens next from intake to verified site resolution.
              </p>
            </div>
          </div>

          {/* Benefit 04 */}
          <div className="flex flex-col space-y-6">
            {/* Minimalist Grayscale Visual */}
            <div className="w-full h-44 bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-center p-6 relative overflow-hidden group">
              <svg className="w-24 h-24 text-neutral-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                {/* Prioritized dispatch queue matrix */}
                <path d="M22 36l28-14 28 14-28 14-28-14z" strokeWidth="1.2" />
                <path d="M22 50l28 14 28-14" strokeWidth="1" className="text-neutral-500" />
                <path d="M22 64l28 14 28-14" strokeWidth="0.8" className="text-neutral-700" />
                <circle cx="50" cy="36" r="2.5" fill="currentColor" />
              </svg>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-base sm:text-lg font-medium text-white tracking-tight">
                Help Teams Focus
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                Organized incident information and duplicate detection help authorized crews prioritize safety-critical hazards and coordinate repair logistics.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
