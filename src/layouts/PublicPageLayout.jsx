import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReportModal from '../components/ReportModal';

export default function PublicPageLayout({ children, eyebrow, title, description, badge }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white flex flex-col font-sans selection:bg-[#ff6243] selection:text-white">
      {/* Shared Navbar */}
      <Navbar 
        onOpenReportModal={() => setIsReportModalOpen(true)} 
        variant="solid" 
      />

      <main className="flex-grow pt-24 sm:pt-28">
        {/* Editorial Page Header with Warm Ambient Glow */}
        {(title || eyebrow) && (
          <div className="relative py-16 sm:py-24 border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#16161d] to-[#0d0d11]">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
              <div className="max-w-3xl space-y-5">
                {eyebrow && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-xs text-[#ffab40] font-semibold uppercase tracking-widest">
                    {badge && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                    <span>{eyebrow}</span>
                  </div>
                )}

                {title && (
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                    {title}
                  </h1>
                )}

                {description && (
                  <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal pt-1 max-w-2xl">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        {children}
      </main>

      {/* Shared Footer with Closing CTA */}
      <Footer onOpenReportModal={() => setIsReportModalOpen(true)} />

      {/* Global Interactive Intake Demo Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
