import React from 'react';

export default function CommunityStorySection() {
  return (
    <section className="bg-white text-neutral-900 py-20 sm:py-28 border-b border-neutral-200/80 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Photographic Showcase Container */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 aspect-[16/9] sm:aspect-[21/9] min-h-[380px] shadow-lg flex items-end">
          
          {/* Authentic Street Photograph */}
          <img
            src="/images/community_story.jpg"
            alt="Authentic Indian neighborhood street in morning light with completed road surface maintenance"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent hidden md:block" />

          {/* Editorial Content Overlay */}
          <div className="relative z-10 p-6 sm:p-12 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold px-2.5 py-0.5 rounded bg-black/40 border border-white/20 backdrop-blur-md inline-block">
              Ground-Level Transformation
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Small Reports Can Start Meaningful Change.
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 font-normal leading-relaxed max-w-lg">
              When one citizen pauses to report a damaged road, defective light, or broken pipeline, the entire neighborhood benefits from safer transit, reduced accidents, and responsive public maintenance.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
