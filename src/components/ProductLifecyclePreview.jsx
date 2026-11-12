import React from 'react';

export default function ProductLifecyclePreview() {
  return (
    <section className="bg-white text-neutral-900 py-20 sm:py-28 border-b border-neutral-200/80 relative">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block text-xs uppercase tracking-widest text-[#ea580c] font-semibold px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
            End-To-End Visibility
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.14]">
            Follow Every Issue From Citizen Photo to Verified Fix
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal">
            Real-time status tracking keeps citizens informed and municipal field contractors accountable.
          </p>
        </div>

        {/* Dual Desktop & Mobile Product Mockup Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Desktop Lifecycle Card */}
          <div className="lg:col-span-8 rounded-2xl bg-neutral-50/60 border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Top Bar with Clear Sample Disclosure */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                  CASE FILE #CF-99214 • SAMPLE CONTENT
                </span>
                <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                  Pothole on Main Road • Indiranagar
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                  Status: In Progress
                </span>
              </div>
            </div>

            {/* Media & Key Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Evidence Photo */}
              <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 relative bg-neutral-100">
                <img
                  src="/images/feature_01.jpg"
                  alt="Sample report photo of pothole on asphalt road"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                  Verified Photo EXIF • 1080p
                </span>
              </div>

              {/* Metadata Fields */}
              <div className="md:col-span-7 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider block font-semibold">Category</span>
                    <strong className="text-neutral-900 font-bold text-sm">Road Damage</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider block font-semibold">Logged Time</span>
                    <strong className="text-neutral-900 font-bold text-sm">Today • 09:14 AM</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider block font-semibold">Location Coords</span>
                    <strong className="text-neutral-900 font-mono">12.9716° N, 77.5946° E</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider block font-semibold">Ward Administration</span>
                    <strong className="text-neutral-900 font-bold">Ward 112 (East Zone)</strong>
                  </div>
                </div>

                <p className="text-neutral-600 text-xs leading-relaxed">
                  "Asphalt depression approximately 18 inches diameter in the middle lane, creating dangerous swerve conditions for morning two-wheelers."
                </p>
              </div>

            </div>

            {/* Complete Chronological Lifecycle Timeline */}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold block">
                Official Incident Timeline
              </span>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <strong className="text-neutral-900 font-bold">09:14 AM</strong> — Report submitted by citizen with geotagged photo.
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">Citizen App</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <strong className="text-neutral-900 font-bold">09:16 AM</strong> — AI triage verified image, matched 2 nearby reports, set priority Level 4.
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">AI Core</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 animate-pulse" />
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <strong className="text-amber-700 font-bold">10:30 AM</strong> — Work order dispatched to Ward 112 Rapid Roadworks Crew.
                    </div>
                    <span className="text-[10px] font-mono text-amber-700 font-semibold">In Progress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-2 text-[10px] text-neutral-500 border-t border-neutral-200">
              * Illustrative case data shown for platform workflow demonstration. CivicFix AI coordinates data structures and does not replace official municipal authorities.
            </div>

          </div>

          {/* Complementary Mobile Citizen Interface Preview */}
          <div className="lg:col-span-4 rounded-2xl bg-neutral-50/60 border border-neutral-200 p-6 shadow-sm space-y-5">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ea580c] font-bold pb-3 border-b border-neutral-200 flex justify-between items-center">
              <span>Citizen Mobile View</span>
              <span className="text-[10px] text-neutral-500 font-normal">iOS / Android</span>
            </div>

            {/* Mobile View Container */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4 shadow-xs">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                <img
                  src="/images/meet_product.jpg"
                  alt="Mobile app interface"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-900">Live Push Notification</span>
                  <span className="text-[10px] text-neutral-500">Just now</span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                  "Your reported road defect on Indiranagar 100ft Rd is now <strong className="text-neutral-900">In Repair</strong> by municipal crew."
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 text-center pt-1">
                Transparent milestones delivered directly to the reporting citizen.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
