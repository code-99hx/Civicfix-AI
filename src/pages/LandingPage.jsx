import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import VisualWorkflowIntro from '../components/VisualWorkflowIntro';
import FromReportToResolutionSection from '../components/FromReportToResolutionSection';
import BuiltForCivicActionSection from '../components/BuiltForCivicActionSection';
import ProblemMissionSection from '../components/ProblemMissionSection';
import AiIntelligenceSection from '../components/AiIntelligenceSection';
import ProductLifecyclePreview from '../components/ProductLifecyclePreview';
import CommunityImpactSection from '../components/CommunityImpactSection';
import CommunityStorySection from '../components/CommunityStorySection';
import Footer from '../components/Footer';
import ReportModal from '../components/ReportModal';

export default function LandingPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleScrollToFeatures = () => {
    const el = document.getElementById('workflow-intro') || document.getElementById('report-to-resolution');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-[#ff6243] selection:text-white">
      {/* 1. Responsive Navigation with Auto/Light Glass Header */}
      <Navbar onOpenReportModal={handleOpenReportModal} />

      <main className="flex-grow">
        {/* 2. Hero Section: Warm gradient & iridescent sphere preserved */}
        <HeroSection 
          onOpenReportModal={handleOpenReportModal}
          onScrollToFeatures={handleScrollToFeatures}
        />

        {/* 3. Visual Workflow Introduction using Custom PNG Map Operations Graphic */}
        <VisualWorkflowIntro 
          onOpenReportModal={handleOpenReportModal}
        />

        {/* 4. Section A: "From Report to Resolution" - 4-Stage Connected Workflow with Custom PNG Assets */}
        <FromReportToResolutionSection 
          onOpenReportModal={handleOpenReportModal} 
        />

        {/* 5. Section B: "Built for Transparent Civic Action" - 4 Product Value Blocks for Citizens & Authorities */}
        <BuiltForCivicActionSection />

        {/* 6. The Civic Challenge & Infrastructure Breakdowns */}
        <ProblemMissionSection />

        {/* 7. AI Intelligence Engine & Spatial Deduplication */}
        <AiIntelligenceSection />

        {/* 8. End-to-End Visibility & Citizen Mobile Case Study */}
        <ProductLifecyclePreview />

        {/* 9. Community Impact & Benefits Grid */}
        <CommunityImpactSection />

        {/* 10. Ground-Level Transformation Community Story */}
        <CommunityStorySection />
      </main>

      {/* 11. Signature CivicFix AI Footer */}
      <Footer onOpenReportModal={handleOpenReportModal} />

      {/* Interactive Zero-Login Citizen Intake Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
      />
    </div>
  );
}
