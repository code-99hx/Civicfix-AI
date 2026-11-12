import React from 'react';
import PublicPageLayout from '../layouts/PublicPageLayout';

export default function AccessibilityPage() {
  return (
    <PublicPageLayout
      eyebrow="Universal Inclusion"
      title="Accessibility Statement"
      description="CivicFix AI's commitment to ensuring digital civic participation is accessible to all citizens regardless of ability."
      badge
    >
      <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-16 lg:py-24 space-y-10 text-neutral-300 text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">Our Universal Civic Commitment</h2>
          <p>
            Local streets and public infrastructure are shared by everyone. Consequently, reporting neighborhood hazards should never be gated by inaccessible web technology. CivicFix AI is committed to meeting and exceeding <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards across all web interfaces.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">Implemented Accessibility Measures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-md bg-[#141419] border border-white/10 space-y-1">
              <span className="font-semibold text-white block text-xs">High Contrast Surfaces</span>
              <p className="text-neutral-400 text-xs">All essential typography conforms to strict contrast ratios for low-vision readability.</p>
            </div>
            <div className="p-4 rounded-md bg-[#141419] border border-white/10 space-y-1">
              <span className="font-semibold text-white block text-xs">Full Keyboard Navigation</span>
              <p className="text-neutral-400 text-xs">Every interactive button, dropdown, modal, and input can be navigated and activated via keyboard alone.</p>
            </div>
            <div className="p-4 rounded-md bg-[#141419] border border-white/10 space-y-1">
              <span className="font-semibold text-white block text-xs">Accessible Focus Outlines</span>
              <p className="text-neutral-400 text-xs">High-visibility 2px white focus rings indicate active focus positions without ambiguity.</p>
            </div>
            <div className="p-4 rounded-md bg-[#141419] border border-white/10 space-y-1">
              <span className="font-semibold text-white block text-xs">Motion Sensitivity</span>
              <p className="text-neutral-400 text-xs">All ambient float animations strictly honor the system-level <code>prefers-reduced-motion</code> setting.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">Assistance and Accessibility Feedback</h2>
          <p>
            If you encounter any barrier while submitting an issue or navigating CivicFix AI with assistive technologies (such as screen readers or alternative input devices), please let us know: <a href="mailto:contact@civicfix.ai" className="text-[#ffab40] underline">contact@civicfix.ai</a>.
          </p>
        </section>

      </div>
    </PublicPageLayout>
  );
}
